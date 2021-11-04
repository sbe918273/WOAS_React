from app.functions import do_select_query
from app.config import CRITERIA_TABLE

def check_frequency(conn, topic, statement, frequency):

    select_setting_response = do_select_query(
        conn, 
        CRITERIA_TABLE, 
        ['setting'], 
        criteria={'topic': topic, 'statement': statement}, 
        valid_max_rows=1
    )

    if select_setting_response is not None:
        statement_setting = select_setting_response[0][0]
        if statement_setting == 'freq':
            valid = frequency in range(0, 3)
        elif statement_setting == 'bool':
            valid = frequency in range(0, 2)
        else:
            valid = False
    else:
        valid = False

    return valid