from flask import jsonify
from app.config import ASSESSMENTS_TABLE, PATIENTS_TABLE, USERS_TABLE, CRITERIA_TABLE
from app.functions import check_frequency, check_criteria_match, do_select_query

def insert_assessment(conn, assessment_date, rio, assessor, topic, statement, frequency):

    # Check if frequency is valid, and if it is, insert the assessment into the assessments table.
    valid_frequency = check_frequency(conn, topic, statement, frequency)

    if valid_frequency:

        insert_asssessment_query = """INSERT INTO {} (
            assessment_date,
            rio,
            assessor,
            topic,
            statement,
            frequency) 
            VALUES (%s, %s, %s, %s, %s, %s);""".format(ASSESSMENTS_TABLE)

        cursor = conn.cursor()
        query_params = (assessment_date, rio, assessor, topic, statement, frequency,)
        cursor.execute(insert_asssessment_query, query_params)
        cursor.close()

        query_params = (assessment_date, rio, assessor, topic, statement, str(frequency),)
        query_params_string = "({})".format(', '.join(query_params))
        print("Added Assessment {}.".format(query_params_string))

        return {'success': True}

    elif not valid_frequency:
        return {'success': False, 'error': 'Invalid frequency "{0}" for statement "{1}"!'.format(frequency, statement)}
