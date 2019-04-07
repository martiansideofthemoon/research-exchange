from flask import Flask
from flask import request
import json

app = Flask(__name__)

with open('paper_list.json', 'r') as f:
    paper_list = json.loads(f.read())['papers']


def simplify(str1):
    str1 = "".join([x if x.isalnum() else ' ' for x in str1])
    return str1.lower()


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

    papers_found = {
        "papers": [x['paper'] for x in retrieved_papers]
    }
    return json.dumps(papers_found)
