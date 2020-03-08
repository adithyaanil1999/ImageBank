import os
basedir = os.path.abspath(os.path.dirname(__file__))



SQLALCHEMY_TRACK_MODIFICATIONS = False
SECRET_KEY = os.environ.get('SECRET_KEY')
SQLALCHEMY_DATABASE_URI = os.environ['DATABASE_URL']


MAIL_DEBUG = False
MAIL_SERVER='smtp.gmail.com'
MAIL_PORT=587
MAIL_USE_TLS=True
MAIL_USERNAME : 'noreplyimagebank@gmail.com'
MAIL_PASSWORD : 'kwndwsdvocglyzeq'