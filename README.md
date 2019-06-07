## Research Exchange

### Server Setup

1. Install Python3 with Flask (`pip install Flask`)
2. Copy the database (`cp server/annotations_backup.json server/annotations1.json`)
3. Run the following commands -
	* `cd server`
	* `export FLASK_APP=app.py`
	* `python -m flask run`

### Client Setup

1. Edit `client/src/url.js` with the correct server URL (which you will get after running `python -m flask run`)
2. Install necessary packages by typing the following -
	* `cd client`
	* `npm install`
3. Run the client using `npm start`
