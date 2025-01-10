"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import or_



from api.models import db, User, Events, EventMedia, ContactInfo, Favorites
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from datetime import date, datetime

import os
import inspect
import cloudinary
import cloudinary.uploader
import cloudinary.api

cloudinary.config( 
  cloud_name = "dxweetk1w", 
  api_key = "932178836968972", 
  api_secret = "4tMaS9oNlEtDYSgEcQ7Z7XwFhA4",
  secure = True
)

from cloudinary import CloudinaryImage
from cloudinary import CloudinaryVideo

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)



# USERS endpoints

# CREATE USER | SIGN-UP
@api.route('/users', methods=['POST'])
def create_user():
    data = request.json

    email = data.get("email")
    password = data.get("password")
    first_name = data.get("first_name")
    last_name = data.get("last_name")
    user_gender = data.get("user_gender")
    birthdate = data.get("birthdate")
    user_country = data.get("user_country")
    user_city = data.get("user_city")

    if not all([email, password, first_name, last_name, user_gender, birthdate, user_country, user_city]):
        return jsonify({"message": "Email, Password, First Name, Last Name, Gender, Birthdate, Country, and City are required"}), 400
    
    if "@" not in email or "." not in email:
        return jsonify({"message": "Invalid email format"}), 400
    
    if len(password) < 8:
        return jsonify({"message": "Password must be at least 8 characters long"}), 400

    if user_gender not in ["Male", "Female", "Other"]:
        return jsonify({"message": "Invalid genre. Use Male, Female, or Other"}), 400

    try:
        birthdate_obj = datetime.strptime(birthdate, "%Y-%m-%d").date()
    except ValueError:
        return jsonify({"message": "Invalid birthdate format. Use YYYY-MM-DD"}), 400


    email_exist = User.query.filter_by(email=email).first()
    if email_exist:
        return jsonify({"message": "The email already exists, try another one or log-in"}), 400

    password_hash = generate_password_hash(password)

    new_user = User(
        email=email,
        password_hash=password_hash,
        first_name=first_name,
        last_name=last_name,
        country=user_country,
        city=user_city,
        gender=user_gender,
        birthdate=birthdate_obj,
    )

    try:
        db.session.add(new_user)
        db.session.commit()
    except Exception as error:
        db.session.rollback()
        print("Database error:", error)
        return jsonify({"message": "Error saving user to database"}), 500

    return jsonify({
        "user": new_user.serialize(),
        "message": "Registration completed successfully, you will be redirected to the Log-in"
    }), 200


# LOGIN
@api.route('/users/token',methods=['POST'])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")
    print("email:",email," password:",password)
    user_exist = db.session.execute(db.select(User).filter_by(email=email)).one_or_none()
    if user_exist==None:
        return jsonify({"msg":"invalid user or password"}),400

    user=user_exist[0]
    valid_password = check_password_hash(user.password_hash,password)
    print("This is the password hash from login:",valid_password)
    
    if valid_password !=True :
        return jsonify ({'msg':'invalid user or password, try again'}),400
    
    print("will try to create access token:")
    access_token = create_access_token(identity=user.email)
    return jsonify ({'access token':access_token}),200


# User Profile view
@api.route('/users/me', methods=['GET'])
@jwt_required()
def profile():
    email=get_jwt_identity()
    user = db.session.execute(db.select(User).filter_by(email=email)).one_or_none()[0]
    return jsonify(user.serialize())


# TOKEN Verification 
@api.route('/users/token/verify', methods=['GET'])
@jwt_required()
def verify_token():
    try:
        current_user_email = get_jwt_identity() 
        return jsonify({"message": "Token válido", "email": current_user_email}), 200
    except Exception as e:
        return jsonify({"error": "Token inválido o expirado", "details": str(e)}), 401


# ADMIN Verification
@api.route('/users/admin/verify', methods=['GET'])
@jwt_required()
def check_admin():
    current_user_email = get_jwt_identity()
    user = User.query.filter_by(email=current_user_email).first()
    if user and user.has_admin_privileges():
        return jsonify({"is_admin": True}), 200
    return jsonify({"is_admin": False}), 403


# TEST enpoints

# test route
@api.route('/test',methods=['GET'])
def test():
    password="1234"
    password_hash= generate_password_hash(password)
    return jsonify({"Password hash":password_hash}),200

# private test route
@api.route('/private', methods=['GET'])
@jwt_required()
def private():
    email=get_jwt_identity()
    user = db.session.execute(db.select(User).filter_by(email=email)).scalar_one()
    return jsonify(user.serialize()),200



# EVENTS endpoints

# EVENT creation
@api.route('/events', methods=['POST'])
@jwt_required()
def add_event():
    email = get_jwt_identity()
    user = db.session.execute(db.select(User).filter_by(email=email)).scalar_one_or_none()
    
    if not user:
        return jsonify({"message": "User not found"}), 404

    data = request.json

    # Campos requeridos
    required_fields = ["event_name", "event_description", "event_date", "event_start_time",
                       "event_address", "event_city", "event_country", "event_category",
                       "flyer_img_url"]
    missing_fields = [field for field in required_fields if not data.get(field)]
    if missing_fields:
        return jsonify({"message": f"Missing required fields: {', '.join(missing_fields)}"}), 400

    # Validación de clasificación por edades
    valid_classifications = ["Todo Público", "13+", "16+", "18+", "Infantiles", "Adultos Mayores"]
    age_classification = data.get("age_classification", "Todo Público")
    if age_classification not in valid_classifications:
        return jsonify({
            "message": f"Invalid age classification. Allowed values are: {', '.join(valid_classifications)}"
        }), 400

    # Validación de categorías predefinidas
    valid_categories = [
        "Música",
        "Teatro y Danza",
        "Cine",
        "Arte y Exposiciones",
        "Literarios",
        "Conferencias",
        "Talleres y Seminarios",
        "Educación y Aprendizaje",
        "Negocios y Emprendimiento",
        "Deportes",
        "Fitness y Salud",
        "Deportes extremos",
        "Artes Marciales",
        "Familiares",
        "Caridad y Voluntariado",
        "Religión y Espiritualidad",
        "Tecnología",
        "Ciencia",
        "Gastronomía",
        "Bebidas",
        "Moda",
        "Estilo de Vida",
        "Festivales y Carnavales",
        "Celebraciones"
    ]
    event_category = data["event_category"]
    if event_category not in valid_categories:
        return jsonify({
            "message": f"Invalid category. Allowed values are: {', '.join(valid_categories)}"
        }), 400

    # Validación de fecha
    try:
        event_date_obj = datetime.strptime(data["event_date"], "%Y-%m-%d").date()
    except ValueError:
        return jsonify({"message": "Invalid date format. Use YYYY-MM-DD"}), 400

    new_event = Events(
        event_name=data["event_name"],
        event_description=data["event_description"],
        organizer_user_id=user.id,
        event_date=event_date_obj,
        event_start_time=data["event_start_time"],
        event_duration=data.get("event_duration"),
        ticket_price=data.get("ticket_price"),
        event_address=data["event_address"],
        event_city=data["event_city"],
        event_country=data["event_country"],
        event_category=event_category,
        age_classification=age_classification,
        is_online=data.get("is_online", False),
        flyer_img_url=data["flyer_img_url"]
    )

    try:
        db.session.add(new_event)
        db.session.commit()
    except Exception as error:
        db.session.rollback()
        print("Database error:", error)
        return jsonify({"message": "Error saving event to database"}), 500

    serialized_event = new_event.serialize()
    new_event_id = serialized_event["id"]

    # Procesar media
    for media in data.get("event_media", []):
        new_media = EventMedia(
            media_type=media.get("media_type"),
            media_url=media.get("media_url"),
            event_id=new_event_id
        )
        try:
            db.session.add(new_media)
            db.session.commit()
        except Exception as error:
            db.session.rollback()
            print("Database error:", error)
            return jsonify({"message": "Error saving media to database"}), 500

    for contact in data.get("contact_info", []):
        new_contact_info = ContactInfo(
            contact_media=contact.get("contact_media"),
            contact_data=contact.get("contact_data"),
            contact_event_id=new_event_id
        )
        try:
            db.session.add(new_contact_info)
            db.session.commit()
        except Exception as error:
            db.session.rollback()
            print("Database error:", error)
            return jsonify({"message": "Error saving contact info to database"}), 500

    return jsonify(serialized_event), 201



# Obtener todos los eventos [Filtros]
@api.route('/events', methods=['GET'])
@jwt_required(optional=True)
def get_all_events():
    status = request.args.get('status')
    categories = request.args.getlist('category')
    is_online = request.args.get('is_online')
    price_type = request.args.get('price_type')
    age_classification = request.args.get('age_classification')
    
    # Lista de status válidos
    valid_statuses = ['submitted', 'approved', 'rejected']
    
    # Verificar si el usuario está logueado y es mayor de 18 años
    current_user = None
    is_adult = True
    
    if get_jwt_identity():
        current_user = get_jwt_identity()
        user_age = current_user.get('age', 0) if isinstance(current_user, dict) else 0
        if user_age < 18:
            is_adult = False
    
    try:
        query = Events.query
        
        # Aplicar filtros solo si tienen valores válidos
        if status and status != 'undefined':
            if status not in valid_statuses:
                return jsonify({"error": f"Invalid status. Must be one of: {', '.join(valid_statuses)}"}), 400
            query = query.filter_by(status=status)
        
        if categories and categories != ['undefined']:
            processed_categories = []
            for category in categories:
                
                subcategories = [cat.strip() for cat in category.split(',')]
                processed_categories.extend(subcategories)
            
            query = query.filter(or_(*[Events.event_category == cat for cat in processed_categories]))
        
        if is_online and is_online != 'undefined':
            is_online_bool = is_online.lower() == 'true'
            query = query.filter_by(is_online=is_online_bool)
        
        if price_type and price_type != 'undefined':
            if price_type.lower() == 'free':
                query = query.filter(Events.ticket_price == 0)
            elif price_type.lower() == 'paid':
                query = query.filter(Events.ticket_price > 0)
        
        if age_classification and age_classification != 'undefined' and age_classification != "Todos":
            query = query.filter_by(age_classification=age_classification)
        
        # Filtrar eventos 18+ si el usuario no está logueado o si es menor de 18 años
        if not is_adult:
            query = query.filter(Events.age_classification != '18+')
        
        events = query.all()
        
        return jsonify([event.serialize() for event in events]), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500





# OBTENER, ACTUALIZAR y ELIMINAR Eventos [id]
@api.route('/events/<int:event_id>', methods=['GET', 'PUT', 'DELETE'])
def get_event(event_id):
    event = Events.query.get(event_id)
    if not event:
        return jsonify({"error": "Event not found"}), 404

    if request.method == 'GET':
        # Permitir acceso no autenticado
        user = None
        if 'Authorization' in request.headers:
            try:
                token = request.headers['Authorization'].split(" ")[1]
                user = User.decode_auth_token(token)
            except Exception as e:
                pass

        if user is None and event.age_classification == "18+":
            return jsonify({"msg": "Event restricted due to age classification"}), 403

        if user:
            today = date.today()
            user_age = today.year - user.birthdate.year
            if (today.month, today.day) < (user.birthdate.month, user.birthdate.day):
                user_age -= 1
            if user_age < 18 and event.age_classification == "18+":
                return jsonify({"msg": "Event classified as 18+"}), 403

        # Verificar si se necesitan detalles completos
        include_details = request.args.get('details', 'false').strip().lower() in ['true', '1', 'yes']
        return jsonify(event.serialize(include_details=include_details)), 200

    if request.method == 'PUT' or request.method == 'DELETE':
        @jwt_required()
        def protected_action():
            current_user_email = get_jwt_identity()
            user = User.query.filter_by(email=current_user_email).first()

            if not user:
                return jsonify({"error": "User not found"}), 404

            # Verificar permisos
            if not user.is_admin and event.organizer_user_id != user.id:
                return jsonify({"error": "Unauthorized access"}), 403

            if request.method == 'PUT':
                data = request.get_json()
                try:
                    event.event_name = data.get('event_name', event.event_name)
                    event.event_description = data.get('event_description', event.event_description)
                    event.event_date = data.get('event_date', event.event_date)
                    event.event_start_time = data.get('event_start_time', event.event_start_time)
                    event.event_duration = data.get('event_duration', event.event_duration)
                    event.ticket_price = data.get('ticket_price', event.ticket_price)
                    event.event_address = data.get('event_address', event.event_address)
                    event.event_city = data.get('event_city', event.event_city)
                    event.event_country = data.get('event_country', event.event_country)
                    event.event_category = data.get('event_category', event.event_category)
                    event.age_classification = data.get('age_classification', event.age_classification)
                    event.flyer_img_url = data.get('flyer_img_url', event.flyer_img_url)
                    db.session.commit()
                    return jsonify(event.serialize()), 200
                except Exception as e:
                    db.session.rollback()
                    return jsonify({"error": str(e)}), 400

            if request.method == 'DELETE':
                try:
                    db.session.delete(event)
                    db.session.commit()
                    return jsonify({"message": "Event deleted successfully"}), 200
                except Exception as e:
                    db.session.rollback()
                    return jsonify({"error": str(e)}), 400

        return protected_action()


# APROBACION y RECHAZO de Eventos [ADMIN]
@api.route('/events/<int:event_id>/status', methods=['PUT']) 
@jwt_required()
def update_event_status(event_id):
    current_user_email = get_jwt_identity()
    user = User.query.filter_by(email=current_user_email).first()

    if not user or not user.has_admin_privileges():
        return jsonify({"message": "Acceso denegado"}), 403

    event = Events.query.get(event_id)
    if not event:
        return jsonify({"message": "Evento no encontrado"}), 404

    data = request.get_json()
    new_status = data.get("status")
    justification = data.get("justification")

    if new_status not in ["approved", "rejected"]:
        return jsonify({"message": "Estado inválido"}), 400

    if new_status == "rejected" and (not justification or justification.strip() == ""):
        return jsonify({"message": "La justificación es requerida para rechazar"}), 400

    try:
        event.status = new_status
        event.event_admin_msg = justification.strip() if justification else None
        db.session.commit()
        return jsonify({
            "message": f"Evento '{event.event_name}' {new_status}",
            "justification": justification
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"Error al actualizar el estado del evento: {str(e)}"}), 500


#FAVORITES endpoints

# Agregar evento favorito a un usuario
@api.route('/favorite/<int:event_id>', methods=['POST'])
@jwt_required()
def add_favorite(event_id):
    current_user_email = get_jwt_identity()
    user = User.query.filter_by(email=current_user_email).first()
    user_id=user.id
    event = Events.query.get(event_id)
    if not event:
        return jsonify({"message": "Evento no encontrado"}), 404
    event_id=event.id

    new_favorite=Favorites(
        user_id=user_id,
        event_id=event_id
    )

    try:
        db.session.add(new_favorite)
        db.session.commit()
    except Exception as error:
        db.session.rollback()
        print("Database error:", error)
        return jsonify({"message": "Error saving media to database"}), 500
    
    return jsonify ({'msg':'favorite added',
                     'user_id':user_id,
                     'event_id':event_id})


# Eliminar evento de favoritos de un usuario
@api.route('/favorite/<int:event_id>', methods=['DELETE'])
@jwt_required()
def remove_favorite(event_id):
    current_user_email = get_jwt_identity()
    user = User.query.filter_by(email=current_user_email).first()
    if not user:
        return jsonify({"message": "Usuario no encontrado"}), 404
    
    favorite = Favorites.query.filter_by(user_id=user.id, event_id=event_id).first()
    if not favorite:
        return jsonify({"message": "Favorito no encontrado"}), 404
    
    try:
        db.session.delete(favorite)
        db.session.commit()
    except Exception as error:
        db.session.rollback()
        print("Database error:", error)
        return jsonify({"message": "Error al eliminar de favoritos"}), 500
    
    return jsonify({"msg": "Favorito eliminado"})


# Obtener los favoritos de un usuario
@api.route('/user/favorite', methods=['GET'])
@jwt_required()
def user_favorites():
    current_user_email = get_jwt_identity()
    user = User.query.filter_by(email=current_user_email).first()
    return jsonify(user.favorites_serialize())




# RESOURCES endpoints

# Image Uploads
@api.route('/image', methods=['POST'])
def upload_file():
    user = request.args.get('user')
    flyer = request.args.get('flyer')
    img = request.args.get('img')

    upload_folder = 'src/api/uploads'

    if 'file' not in request.files:
        return jsonify ({"msg":"No file part in the request"})
    file = request.files['file']
    if file.filename == '':
        return jsonify ({"msg":"No selected file"})
    if file:
        # Save the file to the configured upload folder
        file.save(f"{upload_folder}/{file.filename}")

    file_path = f"{upload_folder}/{file.filename}"
    response = cloudinary.uploader.upload(file_path)

    print('this is cloudinary response url:',response)
    print("this is the file directory:",os.getcwd())
    try:
        if os.path.exists(file_path):
            os.remove(file_path)
            print(f"File '{file_path}' has been deleted.")
        else:
            print(f"File '{file_path}' does not exist.")
    except Exception as e:
        print(f"An error occurred: {e}")


    if user!=None : 
        user = User.query.filter_by(id=user).first()
        
        if user== None :
            return jsonify({'msg':'invalid user id'}),400
        
        user.profile_image=response['url']
        try:
            db.session.commit()
            return jsonify({'msg':'profile picture updated',
                            'user_id':user.id, 
                            'url':response['url'],
                            'format':response['format'],
                            'resource_type':response['resource_type']}),200
        except Exception as e:
            db.session.rollback()
            return jsonify ({'msg':'An error occurred: {e}'}), 500
        
    if flyer !=None :
        print("flyer event id:",flyer)
        event=Events.query.filter_by(id=flyer).first()

        if event== None :
            return jsonify({'msg':'invalid event id'}),400

        event.flyer_img_url=response['url']
        try:
            db.session.commit()
            return jsonify({'msg':'event flyer uploaded ', 
                        'url':response['url'],
                        'format':response['format'],
                        'resource_type':response['resource_type']}),200
        except Exception as e:
            db.session.rollback()
            return jsonify ({'msg':'An error occurred: {e}'}), 500
        
    if img !=None :
        print("img event id:",img)
        event=Events.query.filter_by(id=img).first()

        if event== None :
            return jsonify({'msg':'invalid event id'}),400

        media_type=response['format']
        media_url=response['url']
        event_id=event.id

        new_media=EventMedia(
            media_type=media_type,
            media_url=media_url,
            event_id=event_id
        )

        try:
            db.session.add(new_media)
            db.session.commit()
            return jsonify({'msg':'event media uploaded ',
                            'event_id': event_id, 
                            'url':response['url'],
                            'format':response['format'],
                            'resource_type':response['resource_type']}),200
        except Exception as e:
            db.session.rollback()
            return jsonify ({'msg':'An error occurred: {e}'}), 500
     
    return jsonify ({'media_url':response['url'],
                     'format':response['format'],
                     'resource_type':response['resource_type']}),200
