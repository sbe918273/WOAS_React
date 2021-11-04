from app import app
from flask import request, jsonify
import mysql.connector
import datetime
from app.decorators import token_required
from app.config import ADD_PATIENT_API_USERNAME, ADD_PATIENT_API_PASSWORD, ADD_PATIENT_API_HOST
from app.config import DATABASE, PATIENTS_TABLE
from app.functions import do_select_query

@app.route('/api/add_patient', methods=['POST'])
@token_required(required_group_id=0)
def add_patient(token_data):

    request_json = request.get_json()

    conn = mysql.connector.connect(
        host=ADD_PATIENT_API_HOST,
        user=ADD_PATIENT_API_USERNAME,
        password=ADD_PATIENT_API_PASSWORD,
        database=DATABASE
    )

    # Check if the rio was provided, completely numeric, 9 digits long, and where it already exists in the patients table.
    try: 

        rio = request_json['rio']
        int(rio)
        if len(rio) != 9:
            raise ValueError

        if do_select_query(conn, 
            PATIENTS_TABLE, 
            ["1"],
            valid_max_rows=0, 
            criteria={'rio': rio}):
            raise ValueError
            
    except (KeyError, ValueError) as error:

        return jsonify({'success': False, 'error': 'Invalid RiO!'}), 400

    # Check if the admission date was provided and is in DD/MM/YYYY format.
    try:

        admission_date = datetime.datetime.strptime(request_json['admission_date'], '%d/%m/%Y').strftime("%Y-%m-%d")

    except (KeyError, ValueError) as error:

        return jsonify({'success': False, 'error': 'The admission date provided was invalid!'}), 400

    # For each name provided in the request, check if it exists (otherwise insert None into the patients table) and then if
    # it is completely alphabetic. If it is, add the capitalized version to the names dict to be inserted into the patients table. 

    names = {}
    try: 
        for name_type in ['first_name', 'middle_name', 'last_name']:
            if request_json[name_type] != '':
                if request_json[name_type].isalpha():
                    names[name_type] = request_json[name_type].capitalize()
                else:
                    return jsonify({'success': False, 'error': 'The patient\'s name must be completely alphabetic!'}), 400
            else:
                names[name_type] = None
    except:
        return jsonify({'success': False, 'error': 'All of the patient\'s names were not provided (leave as "" for blank)'}), 400

    # Inserts the patient's provided info into the patients table.
    insert_patient_query = """INSERT INTO {} (
        rio,
        admission_date,
        first_name,
        middle_name,
        last_name
    ) VALUES (%s, %s, %s, %s, %s);""".format(PATIENTS_TABLE)

    query_params = (
        rio,
        admission_date,
        names['first_name'],
        names['middle_name'],
        names['last_name']
    )

    cursor = conn.cursor()
    cursor.execute(insert_patient_query, query_params)
    cursor.close()

    conn.commit()
    conn.close()

    return jsonify({'success': True})