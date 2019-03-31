from flask import Flask
from flask import request
import json

app = Flask(__name__)


@app.route('/hello', methods=['GET', 'POST'])
def hello():
    return json.dumps({"hey": "there"})
