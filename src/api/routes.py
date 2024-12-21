"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Events, EventMedia
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from datetime import datetime

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200


# CREATE USER | SIGN-UP
@api.route('/signup', methods=['POST'])
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





# Login route
@api.route('/login',methods=['POST'])
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


# Event creation
@api.route('/addevent',methods=['POST'])
@jwt_required()
def add_event():
    email=get_jwt_identity()
    user = db.session.execute(db.select(User).filter_by(email=email)).one_or_none()[0]
    print("This is the user id:",user.id)
    data=request.json
    event_name = data.get("event_name")
    event_description = data.get("event_description")
    event_date = data.get("event_date")
    event_start_time = data.get("event_start_time")
    event_duration = data.get("event_duration")
    ticket_price = data.get("ticket_price")
    event_address = data.get("event_address")
    event_city = data.get("event_city")
    event_country = data.get("event_country")
    event_category = data.get("event_category")
    age_clasification = data.get("age_clasification")
    flyer_img_url = data.get("flyer_img_url")
    event_media = data.get("event_media")

    print("This is the event media variable:",type(event_media))
    print("this is the event media data:",event_media)
    try:
        event_date_obj = datetime.strptime(event_date, "%Y-%m-%d").date()
    except ValueError:
        return jsonify({"message": "Invalid birthdate format. Use YYYY-MM-DD"}), 400

    new_event = Events(
        event_name = event_name,
        event_description = event_description,
        organizer_user_id = user.id,
        event_date = event_date_obj,
        event_start_time = event_start_time,
        event_duration = event_duration,
        ticket_price = ticket_price,
        event_address = event_address,
        event_city = event_city,
        event_country = event_country,
        event_category = event_category,
        age_clasification = age_clasification,
        flyer_img_url = flyer_img_url
    )

    try:
        db.session.add(new_event)
        db.session.commit()
    except Exception as error:
        db.session.rollback()
        print("Database error:", error)
        return jsonify({"message": "Error saving user to database"}), 500
    
    serialized_event=new_event.serialize()
    new_event_id=serialized_event.get("id")
    print("New event id:",new_event_id)

    for media in event_media:
        print("media type:",media.get("media_type")," media url:",media.get("media_url"))
        new_media = EventMedia (
            media_type = media.get("media_type"),
            media_url = media.get("media_url"),
            event_id = new_event_id
        )
        try:
            db.session.add(new_media)
            db.session.commit()
        except Exception as error:
            db.session.rollback()
            print("Database error:", error)
            return jsonify({"message": "Error saving user to database"}), 500

    return jsonify (serialized_event)




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



# ADMIN Verification
@api.route('/check-admin', methods=['GET'])
@jwt_required()
def check_admin():
    current_user_email = get_jwt_identity()
    user = User.query.filter_by(email=current_user_email).first()
    if user and user.has_admin_privileges():
        return jsonify({"is_admin": True}), 200
    return jsonify({"is_admin": False}), 403