from flask import Flask, Blueprint, render_template, request, jsonify

import random
import json
from random import seed

import requests
import datetime
import jwt
import hashlib


from src.model import UserLogin,UserInfo,LoginActivity
from src.extensions import db,mail




seed(datetime.datetime.now())

main = Blueprint('main', __name__)
email_code = dict()




def get_jwt(username):
    try:
        payload = {
            'exp': datetime.datetime.utcnow() + datetime.timedelta(seconds=360),
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
        # print(datetime.datetime.utcnow() + datetime.timedelta(days=0, seconds=5))
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
    json_data = {
    "code": str(code),
    "email": str(email),
    "secret": "adithya is too cool"
    }


    headers = {'content-type': 'application/json'}
    r = requests.post(
        'https://flask-emailer.herokuapp.com/send', headers=headers, data=json.dumps(json_data)
    )

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
        new_user = LoginActivity(user_name = values['username'])
        db.session.add(new_user)
        db.session.commit()
        cookie = {'jwtToken':encode_token.decode("utf-8")}
        response_headers = [('Content-type', 'text/plain')]
        response_headers.append(('Set-Cookie',cookie))
        return jsonify(response_headers),201

@main.route('/logout', methods=['POST'])
def logout():
    values = request.get_json()
    decoded_token = decode_jwt(values['token'].encode('utf-8'))
    result = LoginActivity.query.order_by(LoginActivity.login_id.desc()).filter(LoginActivity.user_name == decoded_token).first()
    result.logout_time = datetime.datetime.utcnow()
    db.session.commit()
    response = {'message': 'LoggedOut'}
    return jsonify(response), 201

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
    encode_token = get_jwt(values['username'])
    response = {'message': 'Sent','token':encode_token.decode("utf-8")}
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
        response = {'message': 'not_verfied'}
        return jsonify(response),201

@main.route('/updatePass',methods=['POST'])
def update_password():
    values = request.get_json()
    hashPass = hash_pass(values['password'])
    username = decode_jwt(values['token'].encode('utf-8'))
    result = UserLogin.query.filter(UserLogin.user_name == username).first()
    result.password = hashPass
    db.session.commit()
    response = {'message': 'Changed'}
    return jsonify(response),201


@main.route('/updateToken', methods=['POST'])
def update_token():
    values = request.get_json()
    decoded_token = decode_jwt(values['token'].encode('utf-8'))
    encode_token = get_jwt(decoded_token)
    cookie = {'jwtToken':encode_token.decode("utf-8")}
    response_headers = [('Content-type', 'text/plain')]
    response_headers.append(('Set-Cookie',cookie))
    return jsonify(response_headers),201

@main.route('/verifyOldPass',methods=['POST'])
def verify_password():
    values = request.get_json()
    hashPass = hash_pass(values['password'])
    username = decode_jwt(values['token'].encode('utf-8'))
    result = UserLogin.query.filter(UserLogin.user_name == username).first()
    if result.password == hashPass:
        response = {'message': 'PassMatch'}
    else:
        response = {'message': 'PassDontMatch'}
    return jsonify(response),201

@main.route('/getLang',methods=['POST'])
def ret_lang():
    values = request.get_json()
    username = decode_jwt(values['token'].encode('utf-8'))
    result = UserInfo.query.filter(UserInfo.user_name == username).first()
    response = {'message': result.user_lang}
    return jsonify(response),201

@main.route('/updateLang',methods=['POST'])
def update_lang():
    values = request.get_json()
    username = decode_jwt(values['token'].encode('utf-8'))
    lang = values['lang']
    result = UserInfo.query.filter(UserInfo.user_name == username).first()
    result.user_lang = lang 
    db.session.commit()
    response = {'message': 'LangChanged'}
    return jsonify(response),201

@main.route('/deleteAccount',methods=['POST'])
def delete_acc():
    values = request.get_json()
    username = decode_jwt(values['token'].encode('utf-8'))
    result = UserLogin.query.filter(UserLogin.user_name == username).first()
    db.session.delete(result)
    db.session.commit()
    response = {'message': 'AccountDeleted'}
    return jsonify(response),201

    