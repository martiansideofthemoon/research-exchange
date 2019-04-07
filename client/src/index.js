import React from 'react';
import ReactDOM from 'react-dom';
import {Container, Col, Row,
    Navbar,
    Button
    } from 'reactstrap';

class PaperListItem extends React.Component{
    render(){
        return(
            <div className="paper-list-item">
                <h2>{/* paper title */}</h2>
                <p>{/* authors */}</p>
                <p>{/* conference/journal */}</p>
            </div>
        );
    }
}

class PaperList extends React.Component {
    render() {
        return (<div className="paper-list">
            {/* list of <PaperListItem/>*/}
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
                    console.log(this.state)
                },
                (error) => {
                    // this.setState({
                    //     error
                    // });
                })
        }
    }

    render() {
        return (<Container>
            <Row>
                <Col xm="2"></Col>
                <Col xs="8">
                    <Navbar className="navbar">
                        <img className="logo" src="images/logo.jpg" alt="logo"/>
                        <SearchBar/>
                    </Navbar>
                    <PaperList/>
                </Col>
                <Col xm="2"></Col>
            </Row>
        </Container>);
    }
}

// ========================================

ReactDOM.render(<SearchPage/>, document.getElementById('root'));
