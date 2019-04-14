import React from 'react';
import {
    Badge,
    Container,
    Col,
    Row,
    Button,
    Form,
    Input,
    Card
} from 'reactstrap';
import SearchBar from './searchbar.js';
import AddAnnotations from './popup.js';
import DocumentIndAnn from './document_individual_annotation.js';
import compareAnnotations from './compare_annotations.js';

function PaperInfo(props) {
    return (
        <Card className="paper-metadata">
        <Row>
            <Col md={{size: 10}}>
                <h5>{props.paper.title}</h5>
                <p>
                    {props.paper.authors}<br/>
                    {props.paper.publisher}, {props.paper.year}
                </p>
            </Col>
            <Col md={{size: 2}}>
                <Form>
                    <input type="hidden" name="paper_id" value={props.paper.id}/>
                    <input type="hidden" name="section_id" value="0"/>
                    <Button color="secondary" formAction="/sectional">Section View</Button>
                </Form>
            </Col>
        </Row>
        <Row>
            <Col>
                <p><b>Abstract</b> = {props.paper.abstract}</p>
            </Col>
        </Row>
        </Card>
    );
}


class DocAnnotations extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            types: {
                'comments': true,
                'questions': true,
                'supplementary': true
            },
            paper: props.paper,
            addAnnotationOpen: false
        };
    }

    toggle(type) {
        var current_types = this.state.types;
        current_types[type] = !current_types[type];

        this.setState({
            types: current_types
        });
    }

    upvote(ann_id) {
        var url = "http://127.0.0.1:5000/upvote?ann_id=" + ann_id;
        fetch(url).then(res => res.json()).then((result) => {
            var paper = this.state.paper;

            for (var ann in paper.annotations) {
                if(paper.annotations[ann].id === ann_id) {
                    paper.annotations[ann].upvotes += 1;
                    break;
                }
            }

            this.setState({
                paper: paper
            });
        }, (error) => {
            console.log(error);
        })
    }

    downvote(ann_id) {
        var url = "http://127.0.0.1:5000/downvote?ann_id=" + ann_id;
        fetch(url).then(res => res.json()).then((result) => {
            var paper = this.state.paper;

            for (var ann in paper.annotations) {
                if(paper.annotations[ann].id === ann_id) {
                    paper.annotations[ann].downvotes += 1;
                    break;
                }
            }

            this.setState({
                paper: paper
            });
        }, (error) => {
            console.log(error);
        })
    }

    openPopup() {
        this.setState({
            addAnnotationOpen: true
        });
    }

    closePopup() {
        this.setState({
            addAnnotationOpen: false
        });
    }

    render() {

        var active_annotations = []
        for (var ann in this.state.paper.annotations) {
            if(this.state.types[this.state.paper.annotations[ann].type]) {
                active_annotations.push(this.state.paper.annotations[ann]);
            }
        }

        active_annotations.sort(compareAnnotations)
        active_annotations.reverse()

        const ann_list = active_annotations.map(ann => {
            return <DocumentIndAnn ann={ann}  key={ann.id} upvote={() => this.upvote(ann.id)} downvote={() => this.downvote(ann.id)}/>
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
                        <Button className="add-doc-annotation-button" color="secondary" onClick={() => this.openPopup()}>Add Annotation</Button>
                    </Col>
                </Row>
                </Form>
                <hr/>
                <div className="annotation-list"><center>{ann_list}</center></div>
                <AddAnnotations paperId={this.state.paper.id} mode="document" addAnnotationOpen={this.state.addAnnotationOpen} closePopup={() => this.closePopup()}/>
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
            var url = "http://127.0.0.1:5000/get_document?id=" + this.state.paperId
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
