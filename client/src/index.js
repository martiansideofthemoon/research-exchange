import React from 'react';
import ReactDOM from 'react-dom';
import {Container, Col, Row,
    Navbar,
    Button
    } from 'reactstrap';

class PaperListItem extends React.Component{
    render(){
        console.log(this.props.paper)
        return(
            <Button className="paper-list-item">
                <h2>{this.props.paper.title}</h2>
                <p>{this.props.paper.authors}</p>
                <p>{this.props.paper.publisher + " " + this.props.paper.year}</p>
            </Button>
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

class SearchBar extends React.Component {
    render() {
        return (<form>
            <input type="text" name="query" className="search-box"/>
            <Button className="search-button">Search</Button>
        </form>);
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
                    // this.setState({
                    //     error
                    // });
                })
        }
    }

    render() {
        return (<Container id="search-page">
            <Row>
                <Col xm="2"></Col>
                <Col xs="8">
                    <Navbar className="search-section">
                        <img className="logo" src="images/logo.jpg" alt="logo"/>
                        <SearchBar/>
                    </Navbar>
                    <PaperList
                        papers={this.state.papers}
                    />
                </Col>
                <Col xm="2"></Col>
            </Row>
        </Container>);
    }
}

// ========================================

ReactDOM.render(<SearchPage/>, document.getElementById('root'));
