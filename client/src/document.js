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

class PaperBasic extends React.Component {
    render() {
        return (<div>
            <Row>
                <Col lg="12">
                    <h1>{/* title */}</h1>
                    <Button>Section Level View</Button>
                </Col>
                <Col lg="3">
                    
                </Col>
            </Row>
            <p>{/* abstract */}</p>
        </div>);
    }
}

class Metadata extends React.Component {
    render() {
        return (<p>{/* metadata */}</p>);
    }
}

class PaperInfo extends React.Component {
    render() {
        return (<Row>
            <Col xm="9">
                <PaperBasic/>
            </Col>
            <Col xm="3">
                <Metadata/>
            </Col>
        </Row>);
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
        return (<Form inline="inline">
            <FormGroup check="check">
                <Label check="check">
                    <Input type="checkbox" id="checkbox1"/>{' '}
                    Supplementary Materials
                </Label>
            </FormGroup>
            <FormGroup check="check">
                <Label check="check">
                    <Input type="checkbox" id="checkbox1"/>{' '}
                    Comments
                </Label>
            </FormGroup>
            <FormGroup check="check">
                <Label check="check">
                    <Input type="checkbox" id="checkbox1"/>{' '}
                    Queries
                </Label>
            </FormGroup>
            <Button>Add Annotations</Button>
        </Form>);
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
                // this.setState({
                //     error
                // });
            })
        }
    }

    render() {
        return (<Container id="search-page">
            <Row>
                <Col xs="9">
                    <Navbar className="search-section">
                        <img className="logo" src="images/logo.jpg" alt="logo"/>
                        <SearchBar/>
                    </Navbar>
                </Col>
            </Row>
            <br></br>
            <Card style={{width:"75%", height:"100%"}}> 
            <Row>
                <Col xm="11" md={{ size: 10 }}>
                    The paper descriptions, Abstract and Metadata goes here
                    Dummy Content Over Here
                </Col>
                <Col xm="1" md={{size: 2}}>
                    <Button color="secondary">Section View</Button>{' '}
                </Col>
            </Row>
            </Card>
            <br></br>
            <Card style={{width:"75%", height:"100%"}}>
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
        </Container>);
    }
}

export default DocumentPage;
