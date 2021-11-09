from flask import Flask

app = Flask(__name__)

from app.routes import login, authorize, get_criteria, register, submit_assessment, add_patient, view_patient