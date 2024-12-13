"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
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




#CREATE USER | SIGN-UP
@api.route('/signUp', methods=['POST'])
def create_user():
    data = request.json

    email = data.get("email")
    password = data.get("password")
    user_first_name = data.get("user_first_name")
    user_last_name = data.get("user_last_name")
    user_genere = data.get("user_genere")
    birthdate = data.get("birthdate")
    country = data.get("country")
    city = data.get("city")
    state = data.get("state")

    if not all([email, password, user_first_name, user_last_name, user_genere, birthdate]):
        return jsonify({"message": "Email, Password, First Name, Last Name, Gender, and Birthdate are required"}), 400
    
    if "@" not in email or "." not in email:
        return jsonify({"message": "Invalid email format"}), 400
    
    if len(password) < 8:
        return jsonify({"message": "Password must be at least 8 characters long"}), 400

    if user_genere not in ["Male", "Female", "Other"]:
        return jsonify({"message": "Invalid gender. Use Male, Female, or Other"}), 400

    try:
        birthdate_obj = datetime.strptime(birthdate, "%d/%m/%Y").date()
    except ValueError:
        return jsonify({"message": "Invalid birthdate format. Use DD/MM/YYYY"}), 400

    email_exist = User.query.filter_by(email=email).first()
    if email_exist:
        return jsonify({"message": "The email already exists, try another one or log-in"}), 400

    password_hash = generate_password_hash(password)

    new_user = User(
        email=email,
        password_hash=password_hash,
        user_first_name=user_first_name,
        user_last_name=user_last_name,
        user_country=country,
        user_state=state,
        user_city=city,
        user_genere=user_genere,
        user_date_of_birth=birthdate_obj,
        is_admin=False,
        is_event_organizer=False,
        is_active=True
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

