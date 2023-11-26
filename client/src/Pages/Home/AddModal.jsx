import React, { Component } from 'react';
import {Modal, Button, Row, Col, Form} from 'react-bootstrap';

export class AddModal extends Component{
    constructor(props) {
        super(props);
        this.handleSubmit=this.handleSubmit.bind(this);
    }

    handleSubmit(event){
        event.preventDefault();
        fetch(import.meta.env.VITE_BACKEND_API+'videos/'+event.target.Id.value,{
            method:'POST',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                "name":event.target.Name.value,
                "likes":Number(event.target.Likes.value),
                "views":Number(event.target.Views.value),
            })
        })
        .then(response=>response.json())
        .then((result)=>{
            alert(result);
        },
        (error)=>{
            alert(error);
        })
    }

    render(){
        return (
            <div className="container">
                <Modal {...this.props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                >
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                            Add Video
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Col sm={6}>
                                <Form onSubmit={this.handleSubmit}>
                                    <Form.Group controlId="Transaction">
                                        <Form.Label>VideoId</Form.Label>
                                        <Form.Control type="number" name="Id" required placeholder="5" step="1"/>
                                        <Form.Label>Name</Form.Label>
                                        <Form.Control type="text" name="Name" required placeholder="Video Name" as="textarea" rows={2} />
                                        <Form.Label>Likes</Form.Label>
                                        <Form.Control type="number" name="Likes" required placeholder="10" step="1"/>
                                        <Form.Label>Views</Form.Label>
                                        <Form.Control type="number" name="Views" required placeholder="10" step="1"/>
                                    </Form.Group> <br/>
                                    <Form.Group>
                                        <Button variant="primary" type="submit">
                                            Add Video
                                        </Button>
                                    </Form.Group>
                                </Form>
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="danger" onClick={this.props.onHide}>Close</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}