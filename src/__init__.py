from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from .routes.main import main
from .model import UserLogin
from flask_mail import Mail

from .extensions import db,mail



def create_app(config_file='./config.py'):
    app = Flask(__name__)
    app.config.from_pyfile(config_file)
    db.init_app(app)
    mail.init_app(app)
    app.register_blueprint(main)
    return app


    

