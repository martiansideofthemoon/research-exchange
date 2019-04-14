import flask
from flask import Flask
from flask import request
import json
import datetime

app = Flask(__name__)

with open('paper_list.json', 'r') as f:
    paper_list = json.loads(f.read())['papers']

with open('annotations1.json', 'r') as a:
    ann_list = json.loads(a.read())['annotations']


def simplify(str1):
    str1 = "".join([x if x.isalnum() else ' ' for x in str1])
    return str1.lower()


def refresh_annotations(ann):
    global ann_list
    new_ann = {
        'annotations': ann
    }
    with open('annotations1.json', 'w') as f:
        f.write(json.dumps(new_ann, indent=4))
    with open('annotations1.json', 'r') as a:
        ann_list = json.loads(a.read())['annotations']


@app.route('/search', methods=['GET'])
def search():
    query_tokens = simplify(request.args['query']).split()
    retrieved_papers = []
    for paper in paper_list:
        title = simplify(paper['title'])
        authors = simplify(paper['authors'])
        score = 0
        for qt in query_tokens:
            if qt in title:
                score += 1
            elif qt in authors:
                score += 1
        if score > 0:
            retrieved_papers.append({
                'score': score,
                'paper': paper
            })

    retrieved_papers.sort(key=lambda x: x['score'], reverse=True)

    response = flask.jsonify({
        "papers": [x['paper'] for x in retrieved_papers]
    })
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


@app.route('/get_document', methods=['GET'])
def get_document():
    paper_id = int(request.args['id'])
    # Fetch abstract of the paper
    with open('paper_%d.json' % paper_id, 'r') as f:
        paper_abstract = json.loads(f.read())['sections'][0]
        assert paper_abstract['name'] == 'Abstract'
    # fetch corresponding annotations
    current_annotation = None
    for annotation in ann_list:
        if annotation['paper_id'] == paper_id:
            current_annotation = annotation
    annotations = current_annotation['document']

    for paper in paper_list:
        if paper['id'] == paper_id:
            paper['abstract'] = paper_abstract['content']
            paper['annotations'] = annotations
            response = flask.jsonify({
                "paper": paper
            })
            response.headers.add('Access-Control-Allow-Origin', '*')
            return response
    response = flask.jsonify({
        "paper": None
    })
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


@app.route('/get_sectional', methods=['GET'])
def get_sectional():
    paper_id = int(request.args['paper_id'])
    section_id = int(request.args['section_id'])
    # Fetch abstract of the paper
    with open('paper_%d.json' % paper_id, 'r') as f:
        paper_sections = json.loads(f.read())['sections']

    current_section = None
    for section in paper_sections:
        if section['section_id'] == section_id:
            current_section = section

    # fetch corresponding annotations
    current_annotation = None
    for annotation in ann_list:
        if annotation['paper_id'] == paper_id:
            current_annotation = annotation
    annotations = current_annotation['sectional']

    current_section_annotations = [ann for ann in annotations if ann['section_id'] == section_id]

    all_sections = []

    for section in paper_sections:
        all_sections.append({
            'section_number': section['section_number'],
            'section_id': section['section_id'],
            'name': section['name'],
            'number_annotations': sum([1 for x in annotations if x['section_id'] == section['section_id']])
        })

    for paper in paper_list:
        if paper['id'] == paper_id:
            paper['section'] = current_section
            paper['all_sections'] = all_sections
            paper['annotations'] = current_section_annotations
            response = flask.jsonify({
                "paper": paper
            })
            response.headers.add('Access-Control-Allow-Origin', '*')
            return response
    response = flask.jsonify({
        "paper": None
    })
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


@app.route('/upvote', methods=['GET'])
def upvote():
    ann_id = int(request.args['ann_id'])
    for paper in ann_list:
        for type1 in ["document", "sectional"]:
            for annotation in paper[type1]:
                if annotation['id'] == ann_id:
                    annotation['upvotes'] += 1

    refresh_annotations(ann_list)
    response = flask.jsonify({
        "success": "success"
    })
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


@app.route('/downvote', methods=['GET'])
def downvote():
    ann_id = int(request.args['ann_id'])
    for paper in ann_list:
        for type1 in ["document", "sectional"]:
            for annotation in paper[type1]:
                if annotation['id'] == ann_id:
                    annotation['downvotes'] += 1

    refresh_annotations(ann_list)
    response = flask.jsonify({
        "success": "success"
    })
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


@app.route('/add_annotation', methods=['POST'])
def add_annotation():
    form_data = json.loads(request.data.decode('utf-8'))
    ann_id = -1
    for paper in ann_list:
        for type1 in ["document", "sectional"]:
            for annotation in paper[type1]:
                if annotation['id'] > ann_id:
                    ann_id = annotation['id']
    ann_id += 1

    annotation_obj = {
        "upvotes": 0,
        "author": form_data['author'],
        "answer": [],
        "type": form_data['annotation_type'],
        "id": ann_id,
        "downvotes": 0,
        "timestamp": datetime.datetime.now().strftime("%H:%M, %d %B, %Y"),
        "content": form_data['content']
    }

    paper_id = int(form_data['paper_id'])
    mode = form_data['mode']

    if mode == 'sectional':
        with open('paper_%d.json' % paper_id, 'r') as f:
            paper_sections = json.loads(f.read())['sections']

        current_section = None
        for section in paper_sections:
            if section['section_id'] == int(form_data['section_id']):
                current_section = section

        print(current_section)
        start_index = current_section['content'].index(form_data['highlighted_text'])
        annotation_obj['section_id'] = int(form_data['section_id'])
        annotation_obj['location'] = "%d:%d" % (start_index, start_index + len(form_data['highlighted_text']))

    current_annotation = None
    for annotation in ann_list:
        if annotation['paper_id'] == paper_id:
            current_annotation = annotation
            break

    current_annotation[mode].append(annotation_obj)

    refresh_annotations(ann_list)
    response = flask.jsonify({
        "success": "success"
    })
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response
