import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

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
    constructor(props) {
        super(props);
        this.state = {
            papers: [],
        };
    }
    render() {
        return (<div className="paper-list">
            {/* list of <PaperListItem/>*/}
        </div>);
    }
}

class SearchBar extends React.Component {
    render() {
        return (<div className="search-bar">
            <input type="text" name="searchterm"/>
            <button className="search-button">Search</button>
        </div>);
    }
}

class SearchPage extends React.Component {
    render() {
        return (<div>
            <div className="navbar">
                <img className="logo" src="images/logo.jpg" alt="logo"/>
                <SearchBar/>
            </div>
            <PaperList/>
        </div>);
    }
}

// ========================================

ReactDOM.render(<SearchPage/>, document.getElementById('root'));
