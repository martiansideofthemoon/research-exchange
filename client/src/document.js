import React from 'react';
import ReactDOM from 'react-dom';
import {
    Container,
    Col,
    Row,
    Navbar,
    Button,
    Form,
    FormGroup,
    Input,
    Label,
    Card
} from 'reactstrap';
import SearchBar from './searchbar.js';

class PaperInfo extends React.Component {
    render() {
        return (
            <Card className="paper-metadata">
            <Row>
                <Col md={{size: 10}}>
                    <h5>{this.props.paper.title}</h5>
                    <p>
                        {this.props.paper.authors}<br/>
                        {this.props.paper.publisher} {this.props.paper.year}
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

class IndAnn extends React.Component {
    /*the number of votes and whether to show +Answer should be done dynamically*/
    render() {
        return (<div>
            <p>{/*author name*/}</p>
            <p>{/*content*/}</p>
            <div className="votes">
                <Button>+ Answer</Button>
                <Button>Upvote 10</Button>
                <Button>Downvote 0</Button>
            </div>
        </div>
    );
    }
}

class Annotations extends React.Component {
    render() {
        return (<div>{/* a group of annotations <IndAnn/> */}</div>);
    }
}

class AnnotationTypes extends React.Component {
    render() {
        return (
            <Form></Form>
        //     <Form inline="inline">
        //     <FormGroup check="check">
        //         <Label check="check">
        //             <Input type="checkbox" id="checkbox1"/>{' '}
        //             Supplementary Materials
        //         </Label>
        //     </FormGroup>
        //     <FormGroup check="check">
        //         <Label check="check">
        //             <Input type="checkbox" id="checkbox1"/>{' '}
        //             Comments
        //         </Label>
        //     </FormGroup>
        //     <FormGroup check="check">
        //         <Label check="check">
        //             <Input type="checkbox" id="checkbox1"/>{' '}
        //             Queries
        //         </Label>
        //     </FormGroup>
        //     <Button>Add Annotations</Button>
        //     </Form>
        );
    }
}

class DocAnnotations extends React.Component {
    render() {
        return (
            <Card className="doc-annotations">
                <Row>
                    <Col>
                        <AnnotationTypes/>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Annotations/>
                    </Col>
                </Row>
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
