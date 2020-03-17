from flask import Flask, Blueprint, render_template, request, jsonify   

import requests
import json
import boto3
import os
basedir = os.path.abspath(os.path.dirname(__file__))
from src.model import UserLogin,UserInfo,LoginActivity,ImgInfo
from src.extensions import db,mail
from src.routes.main import get_jwt,decode_jwt


img = Blueprint('img', __name__)

@img.route('/getSig', methods=['POST'])
def get_sig():
    values = request.get_json()
    decoded_token = decode_jwt(values['token'].encode('utf-8'))


    # S3_BUCKET = os.environ.get('S3_BUCKET')
    S3_BUCKET = "flask-imagebank"
    file_name = values['fileName']
    file_type = values['fileType']

    aws_id = os.environ['AWS_ID']
    aws_key = os.environ['AWS_KEY']
    print(aws_id)

    s3 = boto3.client('s3',aws_access_key_id=aws_id,aws_secret_access_key=aws_key)

    presigned_post = s3.generate_presigned_post(
        Bucket = S3_BUCKET,
        Key = file_name,
        Fields = {"acl": "public-read", "Content-Type": file_type},
        Conditions = [
        {"acl": "public-read"},
        {"Content-Type": file_type}
        ],
        ExpiresIn = 3600
    )

    return json.dumps({
        'data': presigned_post,
        'url': 'https://%s.s3.amazonaws.com/%s' % (S3_BUCKET, file_name)
    })



@img.route('/updateFileDb', methods=['POST'])
def file_update_db():
    values = request.get_json()
    username = decode_jwt(values['token'].encode('utf-8'))
    url = values['url']
    new_img = ImgInfo(user_name = username,img_link = url)
    db.session.add(new_img)
    db.session.commit()
    response = {'message': 'ImageUpdated'}
    return jsonify(response), 201

@img.route('/getUserImages', methods=['POST'])
def get_user_images():
    values = request.get_json()
    username = decode_jwt(values['token'].encode('utf-8'))
    result = ImgInfo.query.order_by(ImgInfo.img_id.desc()).filter(ImgInfo.user_name == username).filter(ImgInfo.img_delete_time == None).all()
    ret_list = []
    for i in result:
        ret_list.append(i.serialize())
    response = {'message': ret_list}
    return jsonify(response), 201
