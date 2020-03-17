from .extensions import db
from datetime import datetime

class UserLogin(db.Model):
    __tablename__ = 'user_login'
    user_id = db.Column(db.Integer,primary_key = True)
    user_name = db.Column(db.String(),unique = True)
    password = db.Column(db.String())
    def __init__(self, user_name, password):
        self.user_name = user_name
        self.password = password

    def serialize(self):
        return {
            'user_id': self.user_id,
            'user_name': self.user_name, 
            'password': self.password
        }

class LoginActivity(db.Model):
    __tablename__ = 'login_activity'
    login_id = db.Column(db.Integer,primary_key = True)
    user_name = db.Column(db.String(),db.ForeignKey("user_login.user_name", ondelete="CASCADE"))
    login_time = db.Column(db.DateTime(), default=datetime.now())
    logout_time = db.Column(db.DateTime(),default=None)

    def __init__(self, user_name):
        self.user_name = user_name


    def serialize(self):
        return {
            'login_id': self.login_id,
            'user_name': self.user_name, 
            'login_time': self.login_time,
            'logout_time': self.logout_time
        }

class UserInfo(db.Model):
    __tablename__ = 'user_info'
    user_id = db.Column(db.Integer,primary_key = True)
    user_name = db.Column(db.String(),db.ForeignKey("user_login.user_name", ondelete="CASCADE"), unique = True)
    user_lang = db.Column(db.String())
    user_email = db.Column(db.String())

    def __init__(self, user_name, user_lang, user_email):
        self.user_name = user_name
        self.user_lang = user_lang
        self.user_email = user_email

    def serialize(self):
        return {
            'user_id': self.user_id,
            'user_name': self.user_name,
            'user_lang': self.user_lang,
            'user_email': self.user_email 
        }


class ImgInfo(db.Model):
    __tablename__ = 'img_info'
    img_id = db.Column(db.Integer,primary_key = True)
    user_name = db.Column(db.String(),db.ForeignKey("user_login.user_name", ondelete="CASCADE"))
    img_create_time = db.Column(db.DateTime(), default=datetime.now())
    img_delete_time = db.Column(db.DateTime(),default=None)
    img_link = db.Column(db.String(), unique = True)


    def __init__(self, user_name, img_link):
        self.user_name = user_name
        self.img_link = img_link

    def serialize(self):
        return {
            'img_id': self.img_id,
            'user_name': self.user_name,
            'img_create_time': self.img_create_time,
            'img_delete_time': self.img_delete_time,
            'img_link': self.img_link
        }
