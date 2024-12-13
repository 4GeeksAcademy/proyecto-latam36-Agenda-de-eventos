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

    if None in [email, username, password]:
        return jsonify({"message": "Email, Username, and Password are required"}), 400

    email_exist = db.session.execute(db.select(User).filter_by(email=email)).one_or_none()
    if email_exist:
        return jsonify({"message": "The email already exists, try another one or log-in"}), 400

    username_exist = db.session.execute(db.select(User).filter_by(username=username)).one_or_none()
    if username_exist:
        return jsonify({"message": "The username already exists, try another one"}), 400

    password_hash = generate_password_hash(password)

    try:
         birthdate_obj = datetime.strptime(birthdate, "%d/%m/%Y").date() if birthdate else None
    except ValueError:
        return jsonify({"message": "Invalid birthdate format. Use DD/MM/YYYY"}), 400

    new_user = User(email, username, password_hash, birthdate_obj, country, city)

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

# Sign up route
@api.route('/login',methods=['POST'])
def login():
    pass
