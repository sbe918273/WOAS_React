from app import app
from flask import request, jsonify
import bcrypt
import mysql.connector

from app.decorators import token_required
from app.config import REGISTER_API_USERNAME, REGISTER_API_PASSWORD, REGISTER_API_HOST
from app.config import DATABASE, USERS_TABLE
from app.functions import do_select_query

@app.route('/api/register', methods=['POST'])
@token_required(required_group_id=0)
def register(token_data):

    # If all of the user to-be-registered's username, password and group id are provided, as well as
    # the provided username not already belonging to another user, add the user to the users table,
    # hashing their password with 8 rounds of bcrypt.

    request_json = request.json

    try:

        username = request_json['username']
        password = request_json['password']
        group_id = request_json['group_id']

    except KeyError:

        return jsonify({'success': False, 'error': 'Insufficient information provided.'})

    conn = mysql.connector.connect(
        host=REGISTER_API_HOST,
        user=REGISTER_API_USERNAME,
        password=REGISTER_API_PASSWORD,
        database=DATABASE
    )

    if do_select_query(
        conn, 
        USERS_TABLE, 
        ['1'],
        valid_max_rows=0,
        criteria={'username': username}
        ) is None:
        return jsonify({'success': False, 'error': 'User Already Exists!'}), 400

    register_query = """INSERT INTO {} (
        username, 
        bcrypt_hash, 
        group_id) VALUES (%s, %s, %s)""".format(USERS_TABLE)

    bcrypt_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt(rounds=8))

    query_params = (
        username,
        bcrypt_hash,
        group_id
    )

    cursor = conn.cursor()
    cursor.execute(register_query, query_params)
    cursor.close()

    conn.commit()
    conn.close()

    return jsonify({'success': True})