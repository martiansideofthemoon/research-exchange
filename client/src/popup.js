import React from 'react';
import Popup from 'reactjs-popup';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';

function AddAnnotations(props) {
    return (
        <Popup
            open={props.addAnnotationOpen}
            closeOnDocumentClick={true}
            onClose={props.closePopup}
        >
           <div>
            <a className="close" onClick={props.closePopup}>
              &times;
            </a>
            <Form>
                <FormGroup>
                    <Label>Type</Label>
                    <Input type="select" name="select" id={props.mode + "-selectType"}>
                        <option value='comments'>Comments</option>
                        <option value='questions'>Questions</option>
                        <option value='supplementary'>Supplementary</option>
                    </Input>
                </FormGroup>
                <FormGroup>
                    <Label>Annotation</Label>
                    <Input type="textarea" name="text" id={props.mode + "-textArea"} />
                </FormGroup>
                <FormGroup>
                    <Label>Author</Label>
                    <Input type="text" name="text" id={props.mode + "-authorText"} />
                </FormGroup>
                <FormGroup>
                    <Button className="add-doc-annotation-button" color="secondary" onClick={props.handleSubmit}>Submit</Button>
                </FormGroup>
            </Form>
            </div>
        </Popup>
      );
}

export default AddAnnotations;