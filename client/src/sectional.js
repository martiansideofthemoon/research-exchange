import React from 'react';
import ReactDOM from 'react-dom';
import {
    Container,
    Col,
    Row,
    Nav, NavItem, NavLink, Navbar,
    Form,
    FormGroup,Input,
    Label,Button,
} from 'reactstrap';
import SearchBar from './searchbar.js';
// npm install react-highlightable --save
// https://github.com/mitchellvanw/react-highlightable
// import Highlightable from 'react-highlightable';
// npm install react-lineto --save
// https://github.com/kdeloach/react-lineto
import LineTo from 'react-lineto';


class Sections extends React.Component{
    render() {
        return (
            <NavItem>
                <NavLink>{/*this.props.sections.name*/}</NavLink>
            </NavItem>
        );
    }
}


class DisplayOptions extends React.Component{
    render() {
        return (
            <Form>
                <FormGroup check="check">
                    <Label check="check">
                        <Input type="checkbox" id="checkbox1"/>{' '}
                        Highlight Only
                    </Label>
                </FormGroup>
                <FormGroup check="check">
                    <Label check="check">
                        <Input type="checkbox" id="checkbox2"/>{' '}
                        Show Annotations
                    </Label>
                </FormGroup>
            </Form>
        );
    }
}


class Annotation extends React.Component{
    render() {
        return (<div>
            <div className="sec-ann B">
                <p>{/*author name*/}</p>
                <p>{/*content*/}</p>
                <div className="votes">
                    <Button>+ Answer</Button>
                    <Button>Upvote 10</Button>
                    <Button>Downvote 0</Button>
                </div>
            </div>
            <LineTo from="A" to="B" />
      </div>);
    }
}


class LeftSide extends React.Component {
    render() {
        return (<div>
            <h2>Sections</h2>
            <Nav vertical>
                {/* a list of <Sections/>*/}
            </Nav>
            <hr />
            <DisplayOptions/>
            <Button>Document View</Button>
      </div>);
    }
}


class RightSide extends React.Component {
    render() {
        return (<div>
            <Form>
                <FormGroup check="check">
                    <Label check="check">
                        <Input type="checkbox" id="checkbox3"/>{' '}
                        Supplementary Materials
                    </Label>
                </FormGroup>
                <FormGroup check="check">
                    <Label check="check">
                        <Input type="checkbox" id="checkbox4"/>{' '}
                        Comments
                    </Label>
                </FormGroup>
                <FormGroup check="check">
                    <Label check="check">
                        <Input type="checkbox" id="checkbox4"/>{' '}
                        Queries
                    </Label>
                </FormGroup>
            </Form>
            <div className="section-annotations">
                {/*list of <Annotation/>*/}
            </div>
            <Button>+ Add Annotation</Button>
      </div>);
    }
}


class SectionalPage extends React.Component {
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
                <Col xm="1">
                    <LeftSide/>
                </Col>
                <Col xs="9">
                    <Navbar className="search-section">
                        <img className="logo" src="images/logo.jpg" alt="logo"/>
                        <SearchBar/>
                    </Navbar>
                </Col>
                <Col xm="2">
                    <RightSide/>
                </Col>
            </Row>
        </Container>);
    }
}

export default SectionalPage;
