from app.functions import get_criteria_dict
import copy

def check_criteria_match(conn, criteria_inputs):
    
    criteria = get_criteria_dict(conn)
    blank_criteria_inputs = copy.deepcopy(criteria_inputs)

    for topic in criteria:
        for statement in criteria[topic]:
            criteria[topic][statement] = None

    for topic in blank_criteria_inputs:
        for statement in blank_criteria_inputs[topic]:
            blank_criteria_inputs[topic][statement] = None

    match = criteria == blank_criteria_inputs
    return match