from flask import request, jsonify
import mysql.connector
from app import app
from app.decorators import token_required
from app.config import VIEW_PATIENT_API_HOST, VIEW_PATIENT_API_USERNAME, VIEW_PATIENT_API_PASSWORD
from app.config import DATABASE, ASSESSMENTS_TABLE, CRITERIA_TABLE, PATIENTS_TABLE
from app.functions import do_select_query

@app.route('/api/view_patient_nivo', methods=['POST'])
@token_required(required_group_id=1)
def view_patient_nivo(data):

    conn = mysql.connector.connect(
        host=VIEW_PATIENT_API_HOST,
        user=VIEW_PATIENT_API_USERNAME,
        password=VIEW_PATIENT_API_PASSWORD,
        database=DATABASE
    )

    request_json = request.get_json()

    try:
        rio = request_json['rio']
    except KeyError:
        return jsonify({'success': False, 'error': 'No rio provided!'}), 400

    patient_response = do_select_query(
        conn, 
        PATIENTS_TABLE,
        ['1'],
        criteria={'rio': rio},
        valid_min_rows=1,
        valid_max_rows=1 
    )

    if patient_response is None:
        return jsonify({'success': False, 'error': 'Rio provided is not valid!'}), 400

    assessments = do_select_query(
        conn,
        ASSESSMENTS_TABLE,
        ['assessment_date', 'topic', 'statement', 'frequency'],
        criteria={'rio': rio},
        valid_min_rows=1,
        order=['topic', 'ASC']
    )

    if assessments is None:
        return jsonify({
            'success': False, 
            'error': 'Patient with rio "{}" has no associated assessments!'.format(rio)
        }), 400

    overall_scores = {**{row[1]: {} for row in assessments}, 'Weighted Sum': {}}

    for assessment_date, topic, statement, frequency in assessments:

        select_statement_response = do_select_query(
            conn,
            CRITERIA_TABLE,
            [
                'topic_weight',
                'statement_weight',
                'setting',
                'statement_label',
                'never_score',
                'single_score',
                'multiple_score',
                'true_score',
                'false_score'
            ],
            criteria={'topic': topic, 'statement': statement},
            valid_min_rows=1,
            valid_max_rows=1
        )

        if select_statement_response is None:
            return jsonify({
                'success': False, 
                'error': 'None, or more than one, rows recieved for statement "{0}" in topic "{1}"!'.format(
                    statement, topic
                )
            }), 400

        (
            topic_weight,
            statement_weight,
            setting,
            statement_label,
            never_score,
            single_score,
            multiple_score,
            true_score,
            false_score
        ) = select_statement_response[0]

        if None not in (statement_weight, topic_weight):

            if setting == "freq":
                if frequency == 0:
                    score = never_score

                elif frequency == 1:
                    score = single_score
                    
                elif frequency == 2:
                    score = multiple_score

            elif setting == "bool":
                if frequency == 0:
                    score = false_score
                elif frequency == 1:
                    score = true_score

            score *= statement_weight

            if assessment_date in overall_scores[topic].keys():
                overall_scores[topic][assessment_date] += score
            else:
                overall_scores[topic][assessment_date] = score

            if assessment_date in overall_scores['Weighted Sum'].keys():
                overall_scores['Weighted Sum'][assessment_date] += (topic_weight * score)
            else:
                overall_scores['Weighted Sum'][assessment_date] = (topic_weight * score)

    nivo_scores = []

    for topic in overall_scores:
        nivo_scores.append({'id': topic, 'data': [{'x': date, 'y': score} for date, score in overall_scores[topic].items()]})

    return jsonify({'success': True, 'scores': nivo_scores}), 200
    

    



