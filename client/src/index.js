import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Route} from 'react-router-dom'

import SearchPage from './search.js'
import DocumentPage from './document.js'
import SectionalPage from './sectional.js'


class ResearchExchange extends React.Component {
    render() {
        return (
            <Router>
                <Route exact={true} path="/" component={SearchPage} />
                <Route exact={true} path="/document" component={DocumentPage} />
                <Route exact={true} path="/sectional" component={SectionalPage} />
            </Router>
        );
    }
}

// ========================================

ReactDOM.render(<ResearchExchange/>, document.getElementById('root'));