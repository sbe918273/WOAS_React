from flask import request, jsonify
import mysql.connector
from app import app
from app.decorators import token_required
from app.config import CRITERIA_API_HOST, CRITERIA_API_USERNAME, CRITERIA_API_PASSWORD
from app.config import DATABASE
from app.functions import get_criteria_dict

@app.route('/api/get_criteria', methods=['POST'])
@token_required(required_group_id=1)
def get_criteria(data):

    conn = mysql.connector.connect(
        host=CRITERIA_API_HOST,
        user=CRITERIA_API_USERNAME,
        password=CRITERIA_API_PASSWORD,
        database=DATABASE
    )

    criteria = get_criteria_dict(conn)
    return jsonify({'success': True, 'criteria': criteria}), 200
