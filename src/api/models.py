from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(250), unique=False, nullable=False)
    first_name = db.Column(db.String(100), unique=False, nullable=True)
    last_name = db.Column(db.String(100), unique=False, nullable=True)
    user_city = db.Column(db.String(30), unique=False, nullable=True)
    user_country = db.Column(db.String(25), unique=False, nullable=True)
    user_role = db.Column(db.String(15), unique=False, nullable=True)
    birthdate = db.Column(db.Date, unique=False, nullable=True)
    user_genre = db.Column(db.String(10), unique=False, nullable=True)
    is_admin = db.Column(db.Boolean(), unique=False, nullable=True)
    is_event_organizer = db.Column(db.Boolean(), unique=False, nullable=True)
    is_active = db.Column(db.Boolean(), unique=False, nullable=True)

    def __repr__(self):
        return f'<User {self.email}>'

    def __init__(self, email, password_hash, first_name=None, last_name=None, genre=None, birthdate=None, city=None, country=None):
        self.email = email
        self.password_hash = password_hash
        self.first_name = first_name
        self.last_name = last_name
        self.genre = genre
        self.birthdate = birthdate
        self.city = city
        self.country = country
        self.role = "User"
        self.is_admin = False
        self.is_event_organizer = False
        self.is_active = True

    def serialize(self):
        role = "User"
        if self.is_admin:
            role = "Admin"
        elif self.is_event_organizer:
            role = "Event Organizer"
        return {
            "id": self.id,
            "email": self.email,
            "role": self.role,
            "first_name": self.user_first_name,
            "last_name": self.user_last_name,
            "country": self.user_country,
            "city": self.user_city,
            "genere": self.user_genere,
            "date_of_birth": self.user_date_of_birth.strftime("%d/%m/%Y") if self.user_date_of_birth else None,
            "role": role
        }