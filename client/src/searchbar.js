import React from 'react';
import ReactDOM from 'react-dom';
import {Container, Col, Row,
    Navbar,
    Button,
    Input,
    Form,
    InputGroup,
    InputGroupAddon
    } from 'reactstrap';


class SearchBar extends React.Component {
    render() {
        return (
            <Navbar>
            <Form>
                <InputGroup>
                    <img className="logo" src="images/logo.jpg" alt="logo"/>
                    <Input name="query" className="search-box" placeholder="Search for a paper" />
                    <Button className="search-button" color="primary" formAction="/">Search</Button>
                </InputGroup>
            </Form>
            </Navbar>
        );
    }
}

// Must export!
export default SearchBar;
