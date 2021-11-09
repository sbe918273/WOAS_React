from flask import request, jsonify
from app import app
from app.config import TOKEN_REQUIREMENTS, SECRET_KEY
import mysql.connector
import jwt

from app.config import LOGIN_API_USERNAME, LOGIN_API_PASSWORD, LOGIN_API_HOST
from app.config import DATABASE, USERS_TABLE, SECRET_KEY
from app.decorators import token_required

@app.route('/api/authorize', methods=['POST'])
def authorize():

    try:
        path = request.json['path']
    except KeyError:
        return jsonify({'success': False, 'error': 'Path not provided!'}), 400

    try:
        required_group_id = TOKEN_REQUIREMENTS[path]
    except KeyError:
        return jsonify({'success': False, 'error': "Path \"{}\" does not exist!".format(path)}), 400

    @token_required(required_group_id=required_group_id)
    def success_if_auth(token_data):
        return jsonify({'success': True}), 200

    return success_if_auth()