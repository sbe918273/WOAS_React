from app import app
from flask import request, jsonify, make_response
import jwt
from datetime import datetime, timedelta
import bcrypt
import mysql.connector

from app.config import LOGIN_API_USERNAME, LOGIN_API_PASSWORD, LOGIN_API_HOST
from app.config import DATABASE, USERS_TABLE, SECRET_KEY
from app.functions import do_select_query

MYSQL_TIMESTAMP_FORMAT = '%Y-%m-%d %H:%M:%S'

@app.route('/api/login', methods=['POST'])
def login():

    credentials = request.json
    try:
        username = credentials['username']
        password = credentials['password']
    except KeyError:
        return jsonify({'success': False})

    conn = mysql.connector.connect(
        host=LOGIN_API_HOST,
        user=LOGIN_API_USERNAME,
        password=LOGIN_API_PASSWORD,
        database=DATABASE
    )

    login_response = do_select_query(
        conn,
        USERS_TABLE,
        ['bcrypt_hash', 'login_attempts', 'last_login'],
        criteria={'username': username},
        valid_min_rows=1,
        valid_max_rows=1
    )

    if login_response is None:
        return jsonify({'success': False, 'error': 'Invalid username or password!'}), 400

    hash, login_attempts, last_login = login_response[0]

    if datetime.utcnow() < last_login + timedelta(minutes=1) \
        and \
        login_attempts > 3:
        return jsonify({'success': False, 'error': 'Account locked!'}), 400

    password_match = bcrypt.checkpw(password.encode('utf-8'), hash.encode('utf-8'))

    if password_match:

        auth_token = jwt.encode({
            'username': username,
            'exp': datetime.utcnow() + timedelta(minutes=60)
        }, SECRET_KEY)

        reset_logins_query = """
            UPDATE {} 
            SET 
            login_attempts=0,
            last_login=%s
            WHERE
            username=%s
        """.format(USERS_TABLE)

        reset_logins_params = (
            datetime.utcnow().strftime(MYSQL_TIMESTAMP_FORMAT),
            username,
        )

        cursor = conn.cursor()
        cursor.execute(reset_logins_query, reset_logins_params)
        cursor.close()

        conn.commit()

        auth_response = make_response(jsonify({
            'success': True,                                     
            'auth_token': auth_token.decode('utf-8')
        }))

        auth_response.set_cookie('auth_token', auth_token)

        return auth_response

    else:

        increment_logins_query = """
            UPDATE {} 
            SET 
            login_attempts=%s,
            last_login=%s
            WHERE
            username=%s
        """.format(USERS_TABLE)

        increment_logins_params = (
            login_attempts+1,
            datetime.utcnow(),
            username,
        )

        cursor = conn.cursor()
        cursor.execute(increment_logins_query, increment_logins_params)
        cursor.close()

        conn.commit()

        return jsonify({'success': False, 'error': 'Invalid username or password!'})

    conn.close()