1. cd `server`
2. `export FLASK_APP=app.py`
3. `python -m flask run`

### Documentation

1. GET Request = `http://127.0.0.1:5000/search?query=deep`, here `query` is the parameter and `deep` is the value. This API expects only a single parameter.
2. GET Request = `http://127.0.0.1:5000/get?id=0`, here `id` is the paper id that needs to be retrieved and `0` is the value. This API expects only a single parameter.