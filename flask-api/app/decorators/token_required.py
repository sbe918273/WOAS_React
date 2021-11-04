from flask import request, jsonify
from functools import wraps, partial
import mysql.connector
import jwt

from app.config import LOGIN_API_USERNAME, LOGIN_API_PASSWORD, LOGIN_API_HOST
from app.config import DATABASE, USERS_TABLE, SECRET_KEY

def token_required(required_group_id=0):

    def partial_token_required(f, required_group_id):
        @wraps(f)
        def decorated(*args, **kwargs):
            try:
                token = request.cookies['auth_token']
            except KeyError:
                return jsonify({'success': False, 'error': 'Authorization token not provided'}), 401

            try:        
                token_data = jwt.decode(token, SECRET_KEY)
            except:
                return jsonify({'success': False, 'error': 'Authorization token signature is not valid'}), 401

            conn = mysql.connector.connect(
                host=LOGIN_API_HOST,
                user=LOGIN_API_USERNAME,
                password=LOGIN_API_PASSWORD,
                database=DATABASE
            )

            select_group_query = """SELECT group_id FROM {} 
                WHERE username = %s;""".format(USERS_TABLE)
            query_params = (token_data['username'],)

            cursor = conn.cursor()
            cursor.execute(select_group_query, query_params)
            response = cursor.fetchall()
            num_rows = cursor.rowcount
        
            if num_rows != 1:
                return jsonify({'success': False, 'error': 'Authorization token user is not valid'}), 400
            else:   
                group_id = response[0][0]

            if group_id <= required_group_id:
                return f(token_data, *args, **kwargs)
            else:
                return jsonify({'success': False, 'error': 'Authorization token user is not authorized'}), 403

        return decorated

    return partial(partial_token_required, required_group_id=required_group_id)

        