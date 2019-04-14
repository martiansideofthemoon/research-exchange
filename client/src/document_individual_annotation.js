import React from 'react';
import {
    Col,
    Row,
    Button,
    Form,
    Label,
    Card
} from 'reactstrap';

function DocumentIndAnn(props) {
    return (
        <Card className={"individual-annotation " + props.ann.type}>
        <Row>
            <Col>
                {props.ann.content}
            </Col>
        </Row>
        <hr/>
        <Row>
            <Col md={{size: 8}}>
                <i>{props.ann.author}</i>, {props.ann.timestamp}
            </Col>
            <Col md={{size: 2}}>
            </Col>
            <Col md={{size: 2}}>
                <Form>
                    <Label>{props.ann.upvotes}</Label>
                    <Button className={props.ann.type} onClick={props.upvote}>
                        <i className="fas fa-thumbs-up"></i>
                    </Button>
                    <Label>{props.ann.downvotes}</Label>
                    <Button className={props.ann.type} onClick={props.downvote}>
                        <i className="fas fa-thumbs-down"></i>
                    </Button>
                </Form>
            </Col>
        </Row>
        </Card>
    );
}

// Must export!
export default DocumentIndAnn;
