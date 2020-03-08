from flask import Flask, Blueprint, render_template, request, jsonify, redirect, url_for 
from flask_mail import Message,Mail

import random
from datetime import datetime
from random import seed
seed(datetime.now())

import requests
import datetime
import jwt
import hashlib


from src.model import UserLogin,UserInfo,LoginActivity
from src.extensions import db,mail
# from src import app




main = Blueprint('main', __name__)
email_code = dict()


mail_app = Flask(__name__)
mail_app.config.update(
    DEBUG=True,
    #EMAIL SETTINGS
    MAIL_SERVER='smtp.gmail.com',
    MAIL_PORT=587,
    MAIL_USE_TLS=True,
    MAIL_USERNAME = 'noreplyimagebank@gmail.com',
    MAIL_PASSWORD = 'kwndwsdvocglyzeq'
    )
mail_app.run(host='0.0.0.0', port=4000)

def get_jwt(username):
    try:
        payload = {
            'exp': datetime.datetime.utcnow() + datetime.timedelta(days=0, minutes=15),
            'sub': username
        }
        return jwt.encode(payload, 'adithya', algorithm='HS256')
    except Exception as e:
        return e

def decode_jwt(token):
    try:
        payload = jwt.decode(token, 'adithya',algorithm='HS256')
        return payload['sub']
    except jwt.ExpiredSignatureError:
        return 'Signature expired. Please log in again.'
    except jwt.InvalidTokenError:
        return 'Invalid token.'
    
def hash_pass(pass_word):
    salt='adnSATTS'
    pass_word = pass_word + salt
    hashPassword = hashlib.md5(pass_word.encode())
    hashPassword = hashPassword.hexdigest()
    return hashPassword

  
def sendemail(email):

    code = random.randrange(1000, 9999)
    with mail_app.app_context():
        mail = Mail(mail_app)
        msg = Message("Password Recovery",sender="noreplyimagebank@gmail.com",recipients=[email])
        msg.html = "<h1>Your Recovery Code is: </h1><p>"+str(code)+"</p>"
        mail.send(msg)

    return code
    
@main.route('/')
def index():
    return render_template('home.html')

@main.route('/login', methods=['POST'])
def login():
    values = request.get_json()
    hashPass = hash_pass(values['password'])
    result = UserLogin.query.filter(UserLogin.user_name == values['username'],UserLogin.password == hashPass).first()
    if result == None:
        response = {'message': 'UserNotFound'}
        return jsonify(response), 201
    else:
        encode_token = get_jwt(values['username'])
        cookie = {'jwtToken':encode_token.decode("utf-8")}
        response_headers = [('Content-type', 'text/plain')]
        response_headers.append(('Set-Cookie',cookie))
        return jsonify(response_headers),201


@main.route('/dashBoard')
def dash():
    return render_template('dashboard.html')

@main.route('/verifytoken',methods=['POST'])
def token_verification():
    values = request.get_json()
    decoded_token = decode_jwt(values['token'].encode('utf-8'))
    response = {'message': decoded_token}
    return jsonify(response),201

@main.route('/reg',methods=['POST'])
def handle_reg():
    values = request.get_json()
    result = UserLogin.query.filter(UserLogin.user_name == values['username']).first()
    if result == None:
        hashPass = hash_pass(values['password'])
        new_user = UserLogin(user_name = values['username'],password = hashPass)
        new_user_info = UserInfo(user_name = values['username'], user_email = values['email'], user_lang = 'en')
        db.session.add(new_user)
        db.session.commit()
        db.session.add(new_user_info)
        db.session.commit()
        response = {'message': 'registered'}
        return jsonify(response),201
    else:
        response = {'message': 'exist'}
        return jsonify(response),201


@main.route('/verifyUserExist',methods=['POST'])
def handle_username_verification():
    values = request.get_json()
    result = UserLogin.query.filter(UserLogin.user_name == values['username']).first()
    if result == None:
        response = {'message': 'NotFound'}
        return jsonify(response),201
    else:
        response = {'message': values['username']}
        return jsonify(response),201


   
@main.route('/sendCode',methods=['POST'])
def send_code():
    values = request.get_json()
    result = UserInfo.query.filter(UserInfo.user_name == values['username']).first()
    email = result.user_email
    recovery = sendemail(email)
    email_code[values['username']] = recovery
    response = {'message': 'Sent'}
    return jsonify(response),201

@main.route('/verifyCode',methods=['POST'])
def verify_code():
    values = request.get_json()
    expected_code = email_code[values['username']]
    received_code = int(values['code'])

    if expected_code == received_code:
        del email_code[values['username']]
        response = {'message': 'verified'}
        return jsonify(response),201
    else:
        print('verified')
        response = {'message': 'not_verfied'}
        return jsonify(response),201

@main.route('/updatePass',methods=['POST'])
def update_password():
    values = request.get_json()
    hashPass = hash_pass(values['password'])
    result = UserLogin.query.filter(UserLogin.user_name == values['username']).first()
    result.password = hashPass
    db.session.commit()
    response = {'message': 'Changed'}
    return jsonify(response),201
