from flask import Blueprint, render_template, request, jsonify, redirect, url_for 
import requests
import datetime
import jwt
import hashlib

from src.model import UserLogin,UserInfo,LoginActivity
from src.extensions import db


main = Blueprint('main', __name__)


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
    hashPassword = hashPassword.hexdigest();
    return hashPassword
    


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
        encode_token = get_jwt(values['username']);
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



   
