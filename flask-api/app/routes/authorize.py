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


"""@app.route('/api/authorize', methods=['POST'])
def authorize():
    try:
        auth_token = request.json['auth_token']
        feature = request.json['feature']
    except KeyError:
        print('a')
        return jsonify({'success': False})

    try: 
        data = jwt.decode(auth_token, SECRET_KEY)
    except:
        print('b')
        return jsonify({'success': False})

    conn = mysql.connector.connect(
        host=LOGIN_API_HOST,
        user=LOGIN_API_USERNAME,
        password=LOGIN_API_PASSWORD,
        database=DATABASE
    )
    cursor = conn.cursor()

    login_query = "SELECT group_id FROM {} WHERE username = %s;".format(
        USERS_TABLE,
    )
    print(data)

    query_params = (data['username'],)

    cursor.execute(login_query, query_params)

    response = cursor.fetchall()
    if len(response) != 1:
        print('c')
        return jsonify({'success': False})
    else:   
        group_id = response[0][0]
        if group_id <= TOKEN_REQUIREMENTS[feature]:
            return jsonify({
                'success': True,
                'authorized': True
                })
        else:
            return jsonify({
                'success': True,
                'authorized': False
            })"""