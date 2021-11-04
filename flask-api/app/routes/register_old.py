import bcrypt
import mysql.connector

from app.config import REGISTER_API_USERNAME, REGISTER_API_PASSWORD, REGISTER_API_HOST
from app.config import DATABASE, USERS_TABLE

def register_backend(username, password, group_id):

    conn = mysql.connector.connect(
        host=REGISTER_API_HOST,
        user=REGISTER_API_USERNAME,
        password=REGISTER_API_PASSWORD,
        database=DATABASE
    )

    bcrypt_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt(rounds=8))

    register_query = "INSERT INTO {} (username, bcrypt_hash, group_id) VALUES (%s, %s, %s)".format(
        USERS_TABLE
    )

    query_params = (
        username,
        bcrypt_hash,
        group_id
    )

    cursor = conn.cursor()
    cursor.execute(register_query, query_params)

    conn.commit()
    conn.close()


if __name__ == 'main':
    
    username = input('Username: ')
    password = input('Password: ')
    group_id = input('Group ID: ')

    register_backend(username, password, group_id)

else: 

    from flask import request
    from app import app
    @app.route('/api/register', methods=['POST'])
    @token_required(0)
    def register():
        credentials = request.json
        try:
            username = credentials['username']
            password = credentials['password']
            group_id = credentials['group_id']
        except KeyError:
            return jsonify({'success': False})

        register_backend(username, password, group_id)
        return jsonify({'success': True})
