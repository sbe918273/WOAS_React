from flask import request, jsonify
import mysql.connector
from app import app
from app.decorators import token_required
from app.config import SUBMIT_ASSESSMENT_API_HOST, SUBMIT_ASSESSMENT_API_USERNAME, SUBMIT_ASSESSMENT_API_PASSWORD
from app.config import DATABASE, USERS_TABLE, PATIENTS_TABLE, ASSESSMENTS_TABLE
from app.functions import check_criteria_match, insert_assessment, do_select_query
import datetime

@app.route('/api/submit_assessment', methods=['POST'])
@token_required(required_group_id=1)
def submit_assessment(data):

    conn = mysql.connector.connect(
        host=SUBMIT_ASSESSMENT_API_HOST,
        user=SUBMIT_ASSESSMENT_API_USERNAME,
        password=SUBMIT_ASSESSMENT_API_PASSWORD,
        database=DATABASE
    )

    request_json = request.get_json()

    # Check if the assessor was provided and whether it exists in the users database.
    try:

        assessor = data['username']
        if not do_select_query(conn, 
            USERS_TABLE, 
            ["1"],
            valid_min_rows=1,
            valid_max_rows=1, 
            criteria={'username': assessor}):
            raise KeyError

    except KeyError:

        return jsonify({'success': False, 'error': 'Invalid account!'}), 400

    # Check if the rio was provided, completely numeric, 9 digits long, and that it exists in the patients table.
    try: 

        rio = request_json['rio']
        int(rio)
        if len(rio) != 9:
            raise ValueError

        if not do_select_query(conn, 
            PATIENTS_TABLE, 
            ["1"],
            valid_min_rows=1,
            valid_max_rows=1, 
            criteria={'rio': rio}):
            raise ValueError
            
    except (KeyError, ValueError) as error:

        return jsonify({'success': False, 'error': 'Invalid RiO!'}), 400

    # Check if the assessment date was provided, is in DD/MM/YYYY format and that the patient does not already have an entry on that date.
    try:

        assessment_date = datetime.datetime.strptime(request_json['assessment_date'], '%d/%m/%Y').strftime("%Y-%m-%d")
        print(do_select_query(conn,
            ASSESSMENTS_TABLE,
            ["1"],
            valid_max_rows=0,
            criteria={'assessment_date': assessment_date, 'rio': rio}))
        if do_select_query(conn,
            ASSESSMENTS_TABLE,
            ["1"],
            valid_max_rows=0,
            criteria={'assessment_date': assessment_date, 'rio': rio}) != []:
            raise ValueError

    except (KeyError, ValueError) as error:

        return jsonify({'success': False, 'error': 'The assessment date provided was invalid!'}), 400

    
    # Checks if the criteria inputs are provided and that they are valid according to the criteria table.
    try: 

        criteria_inputs = request_json['criteria']
        if not check_criteria_match(conn, criteria_inputs):
            return jsonify({'success': False, 'error': 'Exactly one box must be checked for each statement!'}), 400

    except KeyError:

        return jsonify({'success': False, 'error': 'No assessment form inputs provided!'}), 400

    # Insert each statement for each topic assessment into the assessments table.
    for topic in criteria_inputs:
        for statement in criteria_inputs[topic]:
            response = insert_assessment(
                conn, 
                assessment_date, 
                rio, 
                assessor, 
                topic, 
                statement, 
                criteria_inputs[topic][statement]
            )
            if not response['success']:
                return jsonify(response), 400

    conn.commit()
    conn.close()
    
    return jsonify({'success': True}), 200

