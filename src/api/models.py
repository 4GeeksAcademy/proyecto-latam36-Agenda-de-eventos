from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(80), unique=False, nullable=False)
    first_name = db.Column(db.String(100), unique=False, nullable=True)
    last_name = db.Column(db.String(100), unique=False, nullable=True)
    user_city = db.Column(db.String(30), unique=False, nullable=True)
    user_state = db.Column(db.String(25), unique=False, nullable=True)
    user_country = db.Column(db.String(25), unique=False, nullable=True)
    user_role = db.Column(db.String(15), unique=False, nullable=True)
    birthdate = db.Column(db.Date, unique=False, nullable=True)
    user_genre = db.Column(db.String(10), unique=False, nullable=True)
    is_admin = db.Column(db.Boolean(), unique=False, nullable=True)
    is_event_organizer = db.Column(db.Boolean(), unique=False, nullable=True)
    is_active = db.Column(db.Boolean(), unique=False, nullable=True)

    def __repr__(self):
        return f'<User {self.email}>'

    def __init__(self, email, password_hashed):
        self.email = email
        self.password_hash = password_hashed
        self.role = None
        self.is_admin = False
        self.is_event_organizer = False
        self.is_active = True

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "role": self.role
        }
