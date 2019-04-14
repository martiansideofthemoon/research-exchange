import React from 'react';
import ReactDOM from 'react-dom';
import {
    Container,
    Col,
    Row,
    Nav, NavItem, NavLink, Navbar,
    Form,
    FormGroup,Input,
    Card,
    ListGroup, ListGroupItem,
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
            {props.paper.section.content}
        </Card>
    );
}


function SectionList(props) {
    const section_list = props.paper.all_sections.map(sec => {
        return <ListGroupItem
                    disabled={sec.section_id == props.paper.section.section_id}
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
            paper: null
        };
    }

    componentDidMount() {
        if (this.state.paperId) {
            var url = "http://127.0.0.1:5000/get_sectional?paper_id=" + this.state.paperId + "&section_id=" + this.state.sectionId;
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
        var paper_loaded = false;
        if (this.state.paper != null) {
            paper_loaded = true;
        }
        return (
            <div id="sectional-page" className="container-fluid">
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
                </Col>
                <Col xs="6">
                    {paper_loaded && <PaperInfo paper={this.state.paper}/>}
                </Col>
                <Col xs="4">
                </Col>
            </Row>

            <Row>
                <Col xs="2">
                    {paper_loaded && <SectionList paper={this.state.paper}/>}
                </Col>
                <Col xs="6">
                    {paper_loaded && <SectionContent paper={this.state.paper}/>}
                </Col>
                <Col xs="4">
                    <RightSide/>
                    <Card>
                        List of Annotations upvoted
                    </Card>
                </Col>
            </Row>

        </div>
    );
    }
}

export default SectionalPage;
