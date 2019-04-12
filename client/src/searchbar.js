import React from 'react';
import ReactDOM from 'react-dom';
import {Container, Col, Row,
    Navbar,
    Button,
    InputGroup,
    InputGroupAddon
    } from 'reactstrap';


class SearchBar extends React.Component {
    render() {
        return (<form>
            <input type="text" name="query" className="search-box"/>
            <Button className="inline" color="secondary" >Search</Button>
        </form>);
        
    }
}

// Must export!
export default SearchBar;
