from .extensions import db

class UserLogin(db.Model):
    __tablename__ = 'user_login'
    user_id = db.Column(db.String(),primary_key=True)
    password = db.Column(db.String())
    last_login = db.Column(db.String())

    def __init__(self, password):
        self.name = user_id
        self.author = author
        self.last_login = last_login

    def __repr__(self):
        return '<id {}>'.format(self.username)

    def serialize(self):
        return {
            'username': self.username, 
            'password': self.password,
            'last_login': self.last_login
        }