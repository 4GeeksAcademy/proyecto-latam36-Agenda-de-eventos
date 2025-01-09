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
    profile_image = db.Column(db.String(255), unique=False, nullable=True)
    is_admin = db.Column(db.Boolean(), unique=False, nullable=True)
    is_active = db.Column(db.Boolean(), unique=False, nullable=True)

# Child:Events relationship
    events=db.relationship("Events",back_populates="user")

#Child: Favorites relationship
    favorites=db.relationship("Favorites",back_populates="user")

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
        self.profile_image = None
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
            "profile_image": self.profile_image,
        }
    
    def has_admin_privileges(self):
        return self.is_admin

    def favorites_serialize(self):
        favs_serialized=[]
        for favs_list in self.favorites:
            print(favs_list.event_id)
            favs_serialized.append(favs_list.event_id) 
        return {"user_id":self.id,
                "favorites_event_id":favs_serialized}


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
    age_classification = db.Column(db.String(20), unique=False, nullable=False, default="Todo Público")
    is_online = db.Column(db.Boolean, unique=False, nullable=False, default=False)
    status = db.Column(db.String(10), unique=False, nullable=False)
    flyer_img_url = db.Column(db.String(150),unique=False, nullable=False)
    event_admin_msg = db.Column(db.String(250), unique=False, nullable=True)
    favorite_count = db.Column(db.Integer, unique=False, nullable=False, default=0)

#Parent: User relatioship
    user=db.relationship(User, back_populates="events")

#Child: EventMedia relationship
    media=db.relationship("EventMedia", back_populates="event")

#Child: ContactInfo relationship
    contact_info=db.relationship("ContactInfo", back_populates="event")

#Child: Favorites relationship
    favorites=db.relationship("Favorites",back_populates="event")

    def __repr__(self):
        return f'<Events {self.event_name}>'

    def __init__(self, event_name, event_description,organizer_user_id,event_date,event_start_time,event_duration,ticket_price,event_address,event_city,event_country,event_category,age_classification,flyer_img_url, is_online=False):
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
        self.age_classification = age_classification
        self.is_online = is_online
        self.status = "submitted"
        self.flyer_img_url = flyer_img_url

    def serialize(self, include_details=False):
        base_data = {
            "id": self.id,
            "event_name": self.event_name,
            "description": self.event_description,
            "date": self.event_date,
            "start_time": self.event_start_time.strftime("%H:%M:%S") if self.event_start_time else None,
            "duration": self.event_duration.strftime("%H:%M:%S") if self.event_duration else None,
            "ticket_price": self.ticket_price,
            "category": self.event_category,
            "age_classification": self.age_classification,
            "is_online": self.is_online,
            "status": self.status,
            "flyer_img_url": self.flyer_img_url,
            "event_admin_msg": self.event_admin_msg,
            "location": f"{self.event_address}, {self.event_city}, {self.event_country}",
            "organizer_id": self.organizer_user_id,
            "organizer_name": self.user.first_name if self.user else None,
            "organizer_email": self.user.email if self.user else None,
        }

        if include_details:
            base_data.update({
                "media_files": [media.serialize() for media in self.media],
                "contact_info": [contact.serialize() for contact in self.contact_info],
            })

        return base_data

class Favorites(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, ForeignKey(User.id), unique=False, nullable=False)
    event_id = db.Column(db.Integer, ForeignKey(Events.id), unique=False, nullable=False)

    #Parent: User relatioship
    user=db.relationship(User,back_populates="favorites")

    #Parent: Events relationship
    event=db.relationship(Events,back_populates="favorites")

    def __repr__(self):
        return f'<{self.event_id} : {self.user_id}>'
    
    def __init__(self,user_id,event_id):
        self.user_id=user_id
        self.event_id=event_id

    def serialiaze(self):
        return {"user_id":self.user_id,
                "event_id":self.event_id
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