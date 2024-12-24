from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Column, ForeignKey, Integer, String, Date
from sqlalchemy.orm import relationship
from flask import jsonify

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
    user_gender = db.Column(db.String(10), unique=False, nullable=True)
    is_admin = db.Column(db.Boolean(), unique=False, nullable=True)
    is_active = db.Column(db.Boolean(), unique=False, nullable=True)

# Child:Events relationship
    events=db.relationship("Events",back_populates="user")


    def __repr__(self):
        return f'<User {self.email}>'

    def __init__(self, email, password_hash, first_name=None, last_name=None, gender=None, birthdate=None, city=None, country=None):
        self.email = email
        self.password_hash = password_hash
        self.first_name = first_name
        self.last_name = last_name
        self.user_gender = gender
        self.birthdate = birthdate
        self.user_city = city
        self.user_country = country
        self.user_role = "User"
        self.is_admin = False
        self.is_active = True

    def serialize(self):
        self.role = "User"
        if self.is_admin:
            self.role = "Admin"
        return {
            "id": self.id,
            "email": self.email,
            "role": self.role,
            "is_admin": self.is_admin,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "country": self.user_country,
            "city": self.user_city,
            "genere": self.user_gender,
            "date_of_birth": self.birthdate.strftime("%d/%m/%Y") if self.birthdate else None,
            "role": self.role
        }
    
    def has_admin_privileges(self):
        return self.is_admin

    
class Events(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    event_name = db.Column(db.String(100),unique=False, nullable=False)
    event_description = db.Column(db.String(300),unique=False, nullable=False)
    organizer_user_id = db.Column(db.Integer, ForeignKey(User.id), unique=False, nullable=False)
    event_date = db.Column(db.Date, unique=False, nullable=False)
    event_start_time = db.Column(db.Time, unique=False, nullable=False)
    event_duration = db.Column(db.Time, unique=False, nullable=True)
    ticket_price = db.Column(db.Float, unique=False, nullable=True)
    event_address = db.Column(db.String(80), unique=False, nullable=False)
    event_city = db.Column(db.String(30), unique=False, nullable=False)
    event_country = db.Column(db.String(25), unique=False, nullable=False)
    event_category = db.Column(db.String(25),unique=False, nullable=False)
    age_clasification = db.Column(db.String(10),unique=False, nullable=True)
    status = db.Column(db.String(10), unique=False, nullable=False)
    flyer_img_url = db.Column(db.String(150),unique=False, nullable=False)
    event_reject_msg = db.Column(db.String(250), unique=False, nullable=True)

#Parent: User relatioship
    user=db.relationship(User, back_populates="events")

#Child: EventMedia relationship
    media=db.relationship("EventMedia", back_populates="event")

#Child: ContactInfo relationship
    contact_info=db.relationship("ContactInfo", back_populates="event")

    def __repr__(self):
        return f'<Events {self.event_name}>'

    def __init__(self, event_name, event_description,organizer_user_id,event_date,event_start_time,event_duration,ticket_price,event_address,event_city,event_country,event_category,age_clasification,flyer_img_url):
        self.event_name = event_name
        self.event_description = event_description
        self.organizer_user_id = organizer_user_id
        self.event_date = event_date
        self.event_start_time = event_start_time
        self.event_duration = event_duration
        self.ticket_price = ticket_price
        self.event_address = event_address
        self.event_city = event_city
        self.event_country = event_country
        self.event_category = event_category
        self.age_clasification = age_clasification
        self.status = "submitted"
        self.flyer_img_url = flyer_img_url

    def serialize(self):
        return{"id":self.id,
               "event_name":self.event_name,
               "description":self.event_description,
               "date":self.event_date,
               "user_id": self.organizer_user_id,
               "status":self.status}

    def serialize_media(self):
        media_list=[]
        for media_item in self.media:
            media_list.append(media_item.serialize())

        contact_list=[]
        for contact_item in self.contact_info:
            contact_list.append(contact_item.serialize())
    
        return{
            "event_name":self.event_name,
            "description":self.event_description,
            "date":self.event_date,
            "address":self.event_address,
            "city":self.event_city,
            "country":self.event_country,
            "organizer_id": self.organizer_user_id,
            "organizer_name":self.user.first_name,
            "status":self.status,
            "ticket_price":self.ticket_price,
            "media_files":media_list,
            "contact_info":contact_list
        }

class EventMedia(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    media_type = db.Column(db.String(25), unique=False, nullable=False )
    media_url = db.Column(db.String(150), unique=False, nullable=False)
    event_id = db.Column(db.Integer, ForeignKey(Events.id),unique=False, nullable=False)

#Parent:Events relationship
    event=db.relationship(Events, back_populates="media")

    def __repr__(self):
        return f'<{self.media_type} : {self.media_url}>'
    
    def __init__(self, media_type, media_url,event_id):
        self.media_type = media_type
        self.media_url = media_url
        self.event_id = event_id

    def serialize(self):
        return {"media_type":self.media_type,
                "url":self.media_url
                }

class ContactInfo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    contact_media = db.Column(db.String(25), unique=False, nullable=False )
    contact_data = db.Column(db.String(150), unique=False, nullable=False)
    contact_event_id = db.Column(db.Integer, ForeignKey(Events.id),unique=False, nullable=False)

# Parent: Events relationship
    event=db.relationship(Events, back_populates="contact_info")

    def __repr__(self):
        return f'<ContactInfo {self.contact_media}>'
    
    def __init__(self, contact_media, contact_data, contact_event_id):
        self.contact_media = contact_media
        self.contact_data = contact_data
        self.contact_event_id = contact_event_id
    
    def serialize(self):
        return {"contact_media":self.contact_media,
                "contact_data":self.contact_data,
                "contact_event_id":self.contact_event_id
                }