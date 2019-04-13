import React from 'react';
import ReactDOM from 'react-dom';
import {Container, Col, Row,
    Navbar,
    Button
    } from 'reactstrap';

import SearchBar from './searchbar.js'

class PaperListItem extends React.Component{
    render(){
        return(
            <form>
            <input type="hidden" name="id" value={this.props.paper.id}/>
                <Button className="paper-list-item" formAction="/document">
                    <h2>{this.props.paper.title}</h2>
                    <p>{this.props.paper.authors}</p>
                    <p>{this.props.paper.publisher + " " + this.props.paper.year}</p>
                </Button>
            </form>
        );
    }
}

class PaperList extends React.Component {
    render() {
        const paper_list = this.props.papers.map(paper => {
            return <li key={paper.id}><PaperListItem paper={paper}/></li>
        })
        return (<div className="paper-list">
            <ul>{paper_list}</ul>
        </div>);
    }
}

class SearchPage extends React.Component {
    constructor(props) {
        super(props);
        const urlParams = new URLSearchParams(window.location.search);
        const queryString = urlParams.get('query');
        this.state = {
            papers: [],
            queryString: queryString
        };
    }

    componentDidMount() {
        if (this.state.queryString) {
            var url = "http://127.0.0.1:5000/search?query=" + this.state.queryString
            fetch(url)
                .then(res => res.json())
                .then(
                (result) => {
                    this.setState({
                        papers: result.papers
                    });
                },
                (error) => {
                    console.log(error)
                })
        }
    }

    render() {
        var list_visible = false;
        if (this.state.papers.length > 0) {
            list_visible = true;
        }
        return (
            <Container id="search-page">
                <Row>
                    <Col xs="1"></Col>
                    <Col xs="10">
                        <SearchBar/>
                        {list_visible && <PaperList papers={this.state.papers}/>}
                    </Col>
                    <Col xs="1"></Col>
                </Row>
            </Container>
        );
    }
}

// Must export!
export default SearchPage;
