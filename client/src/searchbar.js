import React from 'react';
import {
    Row, Col,
    Navbar,
    Button,
    Input,
    Form,
    InputGroup,
    } from 'reactstrap';


class SearchBar extends React.Component {
    render() {
        return (
            <Navbar>
            <Form>
                    <Row>
                        <Col md="3">
                            <img className="logo" src="images/logo.jpg" alt="logo"/>
                        </Col>
                        <Col md="9">
                            <InputGroup>
                            <Input name="query" className="search-box" placeholder="Search for a paper" />
                            <Button className="search-button" color="primary" formAction="/">Search</Button>
                            </InputGroup>
                        </Col>
                    </Row>
            </Form>
            </Navbar>
        );
    }
}

// Must export!
export default SearchBar;
