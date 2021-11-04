from flask import request, jsonify
import mysql.connector
from app import app
from app.decorators import token_required
from app.config import VIEW_PATIENT_API_HOST, VIEW_PATIENT_API_USERNAME, VIEW_PATIENT_API_PASSWORD
from app.config import DATABASE, ASSESSMENTS_TABLE, CRITERIA_TABLE, PATIENTS_TABLE
from app.functions import do_select_query

@app.route('/api/view_patient', methods=['POST'])
@token_required(required_group_id=0)
def view_patient(data):

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
        order=['assessment_date', 'ASC']
    )

    if assessments is None:
        return jsonify({
            'success': False, 
            'error': 'Patient with rio "{}" has no associated assessments!'.format(rio)
        }), 400

    topics_response = do_select_query(
        conn,
        ASSESSMENTS_TABLE,
        ['topic'],
        distinct=True
    )

    table_data = {}
    topics = []    
        
    overall_scores = []
    current_date = assessments[0][0]
    date_scores = {'Weighted Sum': None}

    for assessment_date, topic, statement, frequency in assessments:
        
        if assessment_date != current_date:
            overall_scores.append({'date': current_date, **date_scores})
            date_scores = {'Weighted Sum': None}
            current_date = assessment_date

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

        if assessment_date not in table_data.keys():
            table_data[assessment_date] = {}

        if topic not in table_data[assessment_date].keys():
            table_data[assessment_date][topic] = {}

        frequency_label = None

        if setting == 'freq': 
            if frequency == 0:
                frequency_label = 'Never'
            elif frequency == 1:
                frequency_label = 'Once'
            elif frequency == 2:
                frequency_label = 'Multiple'

        elif setting == 'bool':
            if frequency == 0:
                frequency_label = 'False'
            elif frequency == 1:
                frequency_label = 'True'

        table_data[assessment_date][topic][statement] = frequency_label if (frequency_label is not None) else 'Unknown'

        if None not in (statement_weight, topic_weight):

            if topic not in topics:
                topics.append(topic)

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

            if topic in date_scores.keys():
                date_scores[topic] += score
            else:
                date_scores[topic] = score

            if date_scores['Weighted Sum'] is None:
                date_scores['Weighted Sum'] = (topic_weight * score)
            else:
                date_scores['Weighted Sum'] += (topic_weight * score)

    overall_scores.append({'date': assessment_date, **date_scores})        
    return jsonify({
        'success': True, 
        'topics': topics + ['Weighted Sum'], 
        'scores': overall_scores, 
        'table_data': table_data
    }), 200
    

    



