import React from 'react';
import ReactDOM from 'react-dom';
import {
    Badge,
    Container,
    Col,
    Row,
    Navbar,
    Button,
    Form,
    FormGroup,
    InputGroup,
    Input,
    Label,
    Card
} from 'reactstrap';
import SearchBar from './searchbar.js';

function compareAnnotations(a1, a2) {
    if ((a1.upvotes - a1.downvotes) - (a2.upvotes - a2.downvotes) === 0) {
        return a1.upvotes - a2.upvotes;
    } else {
        return (a1.upvotes - a1.downvotes) - (a2.upvotes - a2.downvotes);
    }
}

class PaperInfo extends React.Component {
    render() {
        return (
            <Card className="paper-metadata">
            <Row>
                <Col md={{size: 10}}>
                    <h5>{this.props.paper.title}</h5>
                    <p>
                        {this.props.paper.authors}<br/>
                        {this.props.paper.publisher}, {this.props.paper.year}
                    </p>
                </Col>
                <Col md={{size: 2}}>
                    <Form>
                        <input type="hidden" name="id" value={this.props.paper.id}/>
                        <Button color="secondary" formAction="/sectional">Section View</Button>
                    </Form>
                </Col>
            </Row>
            <Row>
                <Col>
                    <p><b>Abstract</b> = {this.props.paper.abstract}</p>
                </Col>
            </Row>
            </Card>
        );
    }
}

function IndAnn(props) {
    return (
        <Card className={"individual-annotation " + props.ann.type}>
        <Row>
            <Col>
                {props.ann.content}
            </Col>
        </Row>
        <hr/>
        <Row>
            <Col md={{size: 8}}>
                <i>{props.ann.author}</i>, {props.ann.timestamp}
            </Col>
            <Col md={{size: 2}}>
            </Col>
            <Col md={{size: 2}}>
                <Form>
                    <Label>{props.ann.upvotes}</Label>
                    <Button className={props.ann.type} onClick={props.upvote}>
                        <i className="fas fa-thumbs-up"></i>
                    </Button>
                    <Label>{props.ann.downvotes}</Label>
                    <Button className={props.ann.type} onClick={props.downvote}>
                        <i className="fas fa-thumbs-down"></i>
                    </Button>
                </Form>
            </Col>
        </Row>
        </Card>
    );
}

// class Annotations extends React.Component {
//     render() {
//         const ann_list = this.props.annotations.map(ann => {
//             return <IndAnn ann={ann}  key={ann.id} upvote={() => this.props.}/>
//         })
//         return (<div className="annotation-list"><center>{ann_list}</center></div>);
//     }
// }

class DocAnnotations extends React.Component {
    constructor(props) {
        super(props);
        var active_annotations = JSON.parse(JSON.stringify(props.paper.annotations));
        active_annotations.sort(compareAnnotations);
        active_annotations.reverse()

        this.state = {
            types: {
                'comments': true,
                'questions': true,
                'supplementary': true
            },
            paper: props.paper,
            active_annotations: active_annotations
        };
    }

    toggle(type) {
        var current_types = this.state.types;
        current_types[type] = !current_types[type];

        var all_annotations = JSON.parse(JSON.stringify(this.state.paper.annotations));
        var active_annotations = []
        for (var ann in all_annotations) {
            if(current_types[all_annotations[ann].type]) {
                active_annotations.push(all_annotations[ann]);
            }
        }

        active_annotations.sort(compareAnnotations)
        active_annotations.reverse()

        this.setState({
            types: current_types,
            active_annotations: active_annotations
        });
    }

    upvote(ann_id) {
        var url = "http://127.0.0.1:5000/upvote?ann_id=" + ann_id;
        fetch(url).then(res => res.json()).then((result) => {
            var paper = this.state.paper;
            var active_annotations = this.state.active_annotations;

            for (var ann in active_annotations) {
                if(active_annotations[ann].id === ann_id) {
                    active_annotations[ann].upvotes += 1;
                    break;
                }
            }
            console.log(active_annotations)
            console.log(paper.annotations)

            for (var ann in paper.annotations) {
                if(paper.annotations[ann].id === ann_id) {
                    paper.annotations[ann].upvotes += 1;
                    break;
                }
            }

            this.setState({
                paper: paper,
                active_annotations: active_annotations
            });
        }, (error) => {
            console.log(error);
        })
    }

    downvote(ann_id) {
        var url = "http://127.0.0.1:5000/downvote?ann_id=" + ann_id;
        fetch(url).then(res => res.json()).then((result) => {
            var paper = this.state.paper;
            var active_annotations = this.state.active_annotations;

            for (var ann in active_annotations) {
                if(active_annotations[ann].id === ann_id) {
                    active_annotations[ann].downvotes += 1;
                    break;
                }
            }

            for (var ann in paper.annotations) {
                if(paper.annotations[ann].id === ann_id) {
                    paper.annotations[ann].downvotes += 1;
                    break;
                }
            }

            this.setState({
                paper: paper,
                active_annotations: active_annotations
            });
        }, (error) => {
            console.log(error);
        })
    }

    render() {
        const ann_list = this.state.active_annotations.map(ann => {
            return <IndAnn ann={ann}  key={ann.id} upvote={() => this.upvote(ann.id)} downvote={() => this.downvote(ann.id)}/>
        })
        return (
            <Card className="doc-annotations">
                <Form className="annotation-type-form">
                <Row>
                    <Col md="1">
                    </Col>
                    <Col md="2">
                        <Input className="comments-check" type="checkbox" checked={this.state.types.comments} onChange={() => this.toggle('comments')}/>
                        <h4><Badge className="comments-check-label comments">Comments</Badge></h4>
                    </Col>
                    <Col md="2">
                        <Input className="questions-check" type="checkbox" checked={this.state.types.questions} onChange={() => this.toggle('questions')}/>
                        <h4><Badge className="questions-check-label questions">Questions</Badge></h4>
                    </Col>
                    <Col md="2">
                        <Input className="supplementary-check" type="checkbox" checked={this.state.types.supplementary} onChange={() => this.toggle('supplementary')}/>
                        <h4><Badge className="supplementary-check-label supplementary">Supplementary</Badge></h4>
                    </Col>
                    <Col md="2">
                    </Col>
                    <Col md="2">
                        <Button className="add-doc-annotation-button" color="secondary" formAction="/">Add Annotation</Button>
                    </Col>
                </Row>
                </Form>
                <hr/>
                <div className="annotation-list"><center>{ann_list}</center></div>
            </Card>
        );
    }
}

class DocumentPage extends React.Component {
    constructor(props) {
        super(props);
        const urlParams = new URLSearchParams(window.location.search);
        const paperId = urlParams.get('id');
        this.state = {
            paperId: paperId,
            paper: null
        };
    }

    componentDidMount() {
        if (this.state.paperId) {
            var url = "http://127.0.0.1:5000/get?id=" + this.state.paperId
            fetch(url).then(res => res.json()).then((result) => {
                this.setState({paper: result.paper});
            }, (error) => {
                console.log(error)
            })
        }
    }

    render() {
        var paper_loaded = false;
        if (this.state.paper != null) {
            paper_loaded = true;
        }
        return (<Container id="document-page">
            <Row>
                <Col xs="1">
                </Col>
                <Col xs="10">
                    <SearchBar/>
                    {paper_loaded && <PaperInfo paper={this.state.paper}/>}
                    {paper_loaded && <DocAnnotations paper={this.state.paper}/>}
                </Col>
                <Col xs="1">
                </Col>
            </Row>
        </Container>);
    }
}

export default DocumentPage;
