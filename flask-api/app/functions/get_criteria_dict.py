from app.config import CRITERIA_TABLE

def get_criteria_dict(conn):

    cursor = conn.cursor()
    select_topics_query = "SELECT DISTINCT topic FROM {0};".format(CRITERIA_TABLE)
    cursor.execute(select_topics_query)
    select_topics_response = cursor.fetchall()
    topics = [topic[0] for topic in select_topics_response]

    criteria = {}
    for topic in topics:
        select_statement_query = "SELECT statement, setting FROM {} WHERE topic = %s;".format(CRITERIA_TABLE)
        cursor.execute(select_statement_query, (topic,))
        select_statement_response = cursor.fetchall()
        statements = {statement[0]: {'value': None, 'type':statement[1]} for statement in select_statement_response}
        criteria[topic] = statements

    cursor.close()
    return criteria