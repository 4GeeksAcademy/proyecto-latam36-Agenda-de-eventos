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
    username = data.get("username")
    password = data.get("password")
    birthdate = data.get("birthdate")
    country = data.get("country")
    city = data.get("city")

    if not all([email, username, password]):
        return jsonify({"message": "Email, username, and password are required"}), 400
    
    if "@" not in email or "." not in email:
        return jsonify({"message": "Invalid email format"}), 400

    email_exist = User.query.filter_by(email=email).first()
    if email_exist:
        return jsonify({"message": "The email already exists, try another one or log-in"}), 400

    username_exist = User.query.filter_by(user_name=username).first()
    if username_exist:
        return jsonify({"message": "The username already exists, try another one"}), 400

    password_hash = generate_password_hash(password)

    birthdate_obj = None
    if birthdate:
        try:
            birthdate_obj = datetime.strptime(birthdate, "%d/%m/%Y").date()
        except ValueError:
            return jsonify({"message": "Invalid birthdate format. Use DD/MM/YYYY"}), 400

    new_user = User(
        email=email,
        password_hash=password_hash,
        user_name=username,
        user_city=city,
        user_country=country,
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
        "message": "Registration completed successfully",
        "user": {
            "id": new_user.id,
            "email": new_user.email,
            "username": new_user.user_name,
            "country": new_user.user_country,
            "city": new_user.user_city
        }
    }), 200
