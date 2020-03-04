import os
basedir = os.path.abspath(os.path.dirname(__file__))


DEBUG = False
TESTING = False
SQLALCHEMY_TRACK_MODIFICATIONS = False
SECRET_KEY = os.environ.get('SECRET_KEY')
SQLALCHEMY_DATABASE_URI = os.environ['DATABASE_URL']


