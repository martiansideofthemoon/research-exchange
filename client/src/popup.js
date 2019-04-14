import React from 'react';
import Popup from 'reactjs-popup';
import { Col, Row, Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';

class AddAnnotations extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            paperId: props.paperId,
            mode: props.mode,
            annotationType: 'comments',
            textArea: '',
            author: ''
        };

        this.handleType = this.handleType.bind(this);
        this.handleTextArea = this.handleTextArea.bind(this);
        this.handleAuthor = this.handleAuthor.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleType(event) {
        this.setState({annotationType: event.target.value});
    }

    handleTextArea(event) {
        this.setState({textArea: event.target.value});
    }

    handleAuthor(event) {
        this.setState({author: event.target.value});
    }

    handleSubmit() {
        var url = "http://127.0.0.1:5000/add_annotation";
        var flags = {
            method: 'POST',
            body: JSON.stringify({
                paper_id: this.state.paperId,
                mode: this.state.mode,
                annotationType: this.state.annotationType,
                content: this.state.textArea,
                author: this.state.author
            })
        };
        fetch(url, flags).then(res => res.json()).then((result) => {
            window.location.href = '/document?id=' + this.state.paperId;
        }, (error) => {
            console.log(error);
        })
    }

    render() {
      return (
           <Popup
            open={this.props.addAnnotationOpen}
            closeOnDocumentClick={true}
            onClose={this.props.closePopup}
            >
               <div>
                <a className="close" onClick={this.props.closePopup}>
                  &times;
                </a>
                <Form>
                    <FormGroup>
                        <Label>Type</Label>
                        <Input type="select" name="select" value={this.state.annotationType} onChange={this.handleType}>
                            <option value='comments'>Comments</option>
                            <option value='questions'>Questions</option>
                            <option value='supplementary'>Supplementary</option>
                        </Input>
                    </FormGroup>
                    <FormGroup>
                        <Label>Annotation</Label>
                        <Input type="textarea" name="text" id="exampleText" value={this.state.textArea} onChange={this.handleTextArea}/>
                    </FormGroup>
                    <FormGroup>
                        <Label>Author</Label>
                        <Input type="text" name="text" id="exampleText" value={this.state.author} onChange={this.handleAuthor}/>
                    </FormGroup>
                    <FormGroup>
                        <Button className="add-doc-annotation-button" color="secondary" onClick={this.handleSubmit}>Submit</Button>
                    </FormGroup>
                </Form>
              </div>
          </Popup>
      );
    }
}

export default AddAnnotations;