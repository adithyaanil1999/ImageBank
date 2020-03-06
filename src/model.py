from .extensions import db

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
    login_time = db.Column(db.DateTime())

    def __init__(self, user_name):
        self.login_id = login_id
        self.user_name = user_name
        self.last_login = login_time

    def serialize(self):
        return {
            'login_id': self.login_id,
            'user_name': self.user_name, 
            'last_login': self.login_time
        }

class UserInfo(db.Model):
    __tablename__ = 'user_info'
    user_id = db.Column(db.Integer,primary_key = True)
    user_name = db.Column(db.String(),db.ForeignKey("user_login.user_name", ondelete="CASCADE"), unique = True)
    user_lang = db.Column(db.String());
    user_email = db.Column(db.String());

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
