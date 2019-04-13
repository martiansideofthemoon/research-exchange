import flask
from flask import Flask
from flask import request
import json
import datetime

app = Flask(__name__)

with open('paper_list.json', 'r') as f:
    paper_list = json.loads(f.read())['papers']

with open('annotations.json', 'r') as a:
    ann_list = json.loads(a.read())['annotations']


def simplify(str1):
    str1 = "".join([x if x.isalnum() else ' ' for x in str1])
    return str1.lower()


def refresh_ann(paper_id, ann_type):
    response_list = []
    for annotations in ann_list:
        if annotations['id'] == paper_id:
            for ann in annotations[ann_type]:
                response_list.append(ann)
    response = flask.jsonify({"annotations": response_list})
    return response


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


@app.route('/get', methods=['GET'])
def get():
    paper_id = int(request.args['id'])
    # Fetch abstract of the paper
    with open('paper_%d.json' % paper_id, 'r') as f:
        paper_abstract = json.loads(f.read())['sections'][0]
        assert paper_abstract['name'] == 'Abstract'

    for paper in paper_list:
        if paper['id'] == paper_id:
            paper['abstract'] = paper_abstract['content']
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


@app.route('/doc-ann', methods=['GET', 'POST'])
def process_doc_annotations():
    paper_id = int(request.args['id'])
    for annotations in ann_list:
        if annotations['id'] == paper_id:
            if request.method == 'GET':
                response = refresh_ann(paper_id, "document")
                response.headers.add('Access-Control-Allow-Origin', '*')
                return response
            if request.method == 'POST':
                id = paper["document"].length
                author = request.args['author']
                type = request.args['type']
                content = request.args['content']
                upvote = 0
                downvote = 0
                timestamp = datetime.datetime

                paper["document"].append({"id": id, "author": author, "type": type, "content": content,
                                          "upvote": upvote, "downvote": downvote, "timestamp": timestamp, "answer": []})
    response = refresh_ann(paper_id, "document")
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


@app.route('/doc-ann-vote', methods=['POST'])
def vote():
    paper_id = int(request.args['id'])
    for annotations in ann_list:
        if annotations['id'] == paper_id:
            ann_type = request.args['ann_type']
            ann_id = int(request.args['ann_id'])
            vote_type = request.args['vote_type']
            for doc_ann in annotations[ann_type]:
                if doc_ann['id'] == ann_id:
                    doc_ann[vote_type] += 1
    response = refresh_ann(paper_id, ann_type)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response
