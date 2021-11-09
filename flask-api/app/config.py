REGISTER_API_USERNAME = 'register_api'
REGISTER_API_PASSWORD = ''
REGISTER_API_HOST = 'localhost'

LOGIN_API_USERNAME = 'login_api'
LOGIN_API_PASSWORD = ''
LOGIN_API_HOST = 'localhost'

CRITERIA_API_HOST = 'localhost'
CRITERIA_API_USERNAME = 'criteria_api'
CRITERIA_API_PASSWORD = ''

SUBMIT_ASSESSMENT_API_HOST = 'localhost'
SUBMIT_ASSESSMENT_API_USERNAME = 'submit_assessment_api'
SUBMIT_ASSESSMENT_API_PASSWORD = ''

ADD_PATIENT_API_HOST = 'localhost'
ADD_PATIENT_API_USERNAME = 'add_patient_api'
ADD_PATIENT_API_PASSWORD = '

VIEW_PATIENT_API_HOST = 'localhost'
VIEW_PATIENT_API_USERNAME = 'view_patient_api'
VIEW_PATIENT_API_PASSWORD = ''

USERS_TABLE = 'users'
CRITERIA_TABLE = 'criteria'
ASSESSMENTS_TABLE = 'assessments'
PATIENTS_TABLE = 'patients'

DATABASE = 'VisualMOAS'
SECRET_KEY = ''

TOKEN_REQUIREMENTS = {
    '/register': 0,
    '/admin': 0,
    '/assessment': 1,
    '/login': 2,
    '/add-patient': 0,
    '/view-patient': 0
}