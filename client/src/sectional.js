import React from 'react';
import {
    Badge,
    Col,
    Row,
    Form,
    Input,
    Card,
    ListGroup, ListGroupItem,
    Button,
} from 'reactstrap';
import SearchBar from './searchbar.js';
import AddAnnotations from './popup.js';
import SectionalIndAnn from './section_individual_annotation.js';
import compareAnnotations from './compare_annotations.js';
import SERVER_URL from './url.js';

function PaperInfo(props) {
    return (
        <Card className="paper-metadata">
        <Row>
            <Col md={{size: 9}}>
                <h5>{props.paper.title}</h5>
                <p>
                    {props.paper.authors}<br/>
                    {props.paper.publisher}, {props.paper.year}
                </p>
            </Col>
            <Col md={{size: 3}}>
                <Form>
                    <input type="hidden" name="id" value={props.paper.id}/>
                    <Button color="secondary" formAction="/document">Document View</Button>
                </Form>
            </Col>
        </Row>
        </Card>
    );
}

function SectionContent(props) {
    return (
        <Card className="section-content">
            <h4>{props.paper.section.section_number + ". " + props.paper.section.name}</h4>
            <hr/>
            <div
                id="sectionText"
                dangerouslySetInnerHTML={{ __html: props.final_content}}
                onMouseUp={props.findHighlight}
            />
        </Card>
    );
}


function SectionList(props) {
    const section_list = props.paper.all_sections.map(sec => {
        return <ListGroupItem
                    key={sec.section_id}
                    disabled={sec.section_id === props.paper.section.section_id}
                    tag="a"
                    href={"/sectional?paper_id=" + props.paper.id + "&section_id=" + sec.section_id}
                >
                    {sec.section_number + ". " + sec.name + " (" + sec.number_annotations + ")"}
                </ListGroupItem>
    })
    return (
        <Card>
            <ListGroup>
                {section_list}
            </ListGroup>
        </Card>
    );
}


class SectionalPage extends React.Component {
    constructor(props) {
        super(props);
        const urlParams = new URLSearchParams(window.location.search);
        const paperId = urlParams.get('paper_id');
        const sectionId = urlParams.get('section_id');
        this.state = {
            paperId: paperId,
            sectionId: sectionId,
            paper: null,
            types: {
                'comments': true,
                'questions': true,
                'supplementary': true,
                'highlights': true
            },
            addAnnotationOpen: false,
            isTextHighlighted: false,
            highlightedText: ''
        };
    }

    componentDidMount() {
        if (this.state.paperId) {
            var url = SERVER_URL + "/get_sectional?paper_id=" + this.state.paperId + "&section_id=" + this.state.sectionId;
            fetch(url).then(res => res.json()).then((result) => {
                this.setState({paper: result.paper});
            }, (error) => {
                // this.setState({
                //     error
                // });
            })
        }
    }

    toggle(type) {
        var current_types = this.state.types;
        current_types[type] = !current_types[type];

        this.setState({
            types: current_types
        });
    }

    handleSubmit() {
        var url = SERVER_URL + "/add_annotation";
        var flags = {
            method: 'POST',
            body: JSON.stringify({
                paper_id: this.state.paperId,
                section_id: this.state.sectionId,
                highlighted_text: this.state.highlightedText,
                mode: "sectional",
                annotation_type: document.getElementById('sectional-selectType').value,
                content: document.getElementById('sectional-textArea').value,
                author: document.getElementById('sectional-authorText').value
            })
        };
        fetch(url, flags).then(res => res.json()).then((result) => {
            window.location.href = '/sectional?paper_id=' + this.state.paperId + '&section_id=' + this.state.sectionId;
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
        var highlightedText = window.getSelection().toString();
        console.log("Text = " + highlightedText)
        this.setState({
            addAnnotationOpen: false,
            highlightedText: highlightedText,
            isTextHighlighted: highlightedText.length > 0
        });
    }

    upvote(ann_id) {
        var url = SERVER_URL + "/upvote?ann_id=" + ann_id;
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
        var url = SERVER_URL + "/downvote?ann_id=" + ann_id;
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

    render_annotation_box(ann_list) {
        return (
            <Card className="doc-annotations">
                <Form className="annotation-type-form">
                    <Row>
                        <Col md="1">
                        </Col>
                        <Col md="7">
                            <p className="comments-check-label">Highlight some text to add new annotations</p> <br/>
                            <Input className="comments-check" type="checkbox" checked={this.state.types.highlights} onChange={() => this.toggle('highlights')}/>
                            <p className="comments-check-label">Toggle Highlights</p>
                            <Input className="comments-check" type="checkbox" checked={this.state.types.comments} onChange={() => this.toggle('comments')}/>
                            <h4><Badge className="comments-check-label comments">Comments</Badge></h4>
                            <Input className="questions-check" type="checkbox" checked={this.state.types.questions} onChange={() => this.toggle('questions')}/>
                            <h4><Badge className="questions-check-label questions">Questions</Badge></h4>
                            <Input className="supplementary-check" type="checkbox" checked={this.state.types.supplementary} onChange={() => this.toggle('supplementary')}/>
                            <h4><Badge className="supplementary-check-label supplementary">Supplementary</Badge></h4>
                        </Col>
                        <Col md="4">
                            {this.state.isTextHighlighted && <Button className="add-doc-annotation-button" color="secondary" onClick={() => this.openPopup()}>Add Annotation</Button>}
                        </Col>
                    </Row>
                </Form>
                <hr/>
                <div className="annotation-list"><center>{ann_list}</center></div>
            </Card>
        );
    }

    findHighlight() {
        var highlightedText = window.getSelection().toString();
        console.log("Text = " + highlightedText)
        this.setState({
            highlightedText: highlightedText,
            isTextHighlighted: highlightedText.length > 0
        });

    }

    render() {
        var paper_loaded = false;

        var annotation_box = <Card></Card>

        if (this.state.paper != null) {
            paper_loaded = true;
            var active_annotations = []
            for (var ann in this.state.paper.annotations) {
                if(this.state.types[this.state.paper.annotations[ann].type]) {
                    active_annotations.push(this.state.paper.annotations[ann]);
                }
            }

            active_annotations.sort(compareAnnotations)
            active_annotations.reverse()

            const ann_list = active_annotations.map(ann => {
                return <SectionalIndAnn ann={ann}  key={ann.id} upvote={() => this.upvote(ann.id)} downvote={() => this.downvote(ann.id)}/>
            });

            annotation_box = this.render_annotation_box(ann_list);
        }

        return (
            <div id="sectional-page" className="container-fluid">
            {
                paper_loaded &&
                <AddAnnotations
                    addAnnotationOpen={this.state.addAnnotationOpen}
                    closePopup={() => this.closePopup()}
                    annotationType={this.state.annotationType}
                    author={this.state.author}
                    textArea={this.state.textArea}
                    mode="sectional"
                    handleSubmit={() => this.handleSubmit()}
                />
            }
            <Row>
                <Col xs="2">
                </Col>
                <Col xs="6">
                    <SearchBar/>
                </Col>
                <Col xs="4">
                </Col>
            </Row>

            <Row>
                <Col xs="2">
                     {paper_loaded && <SectionList paper={this.state.paper}/>}
                </Col>
                <Col xs="6">
                    {paper_loaded && <PaperInfo paper={this.state.paper}/>}
                                      {
                        paper_loaded &&
                        <SectionContent
                            paper={this.state.paper}
                            final_content={this.state.types.highlights ? this.state.paper.section.annotated_content : this.state.paper.section.content}
                            findHighlight={() => this.findHighlight()}
                        />
                    }
                </Col>
                <Col xs="4">
                    {annotation_box}
                </Col>
            </Row>
        </div>
    );
    }
}

export default SectionalPage;
