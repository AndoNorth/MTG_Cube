import React,{Component} from 'react';
import {Button, ButtonToolbar, Table} from 'react-bootstrap';

import {AddModal} from './AddModal';

export class Home extends Component{
    login = () => fetch(import.meta.env.VITE_BACKEND_API+'login', { 
        method: "POST",
        credentials: 'include',
    });
    test = () => fetch(import.meta.env.VITE_BACKEND_API+'test',{credentials: 'include'});
    // video end points
    constructor(props){
        super(props);
        this.state={Videos:[], addModalShow:false}
    }
    getVideos(){
        fetch(import.meta.env.VITE_BACKEND_API+'cube', {
            method: "GET",
        })
        .then(response=>response.json())
        .then(data=>{
            this.setState({Videos:data});
        },(error)=>{
            alert(error);
        })
    }
    listVideos(){
        fetch(import.meta.env.VITE_BACKEND_API+'list', {
            method: "GET",
        })
        .then(response=>response.json())
        .then(data=>{
            this.setState({Videos:data});
        },(error)=>{
            alert(error);
        })
    }
    deleteVideo(id){
        if(window.confirm('Are you sure?')){
            fetch(import.meta.env.VITE_BACKEND_API+'videos/'+id,{
                method:'DELETE',
                headers:{
                    'Accept':'application/json',
                    'Content-Type':'application/json'
                }
            })
        }
    }
    render(){
        const {Videos}=this.state
        let addModalClose=()=>this.setState({addModalShow:false});
        return(
            <div>
            <ButtonToolbar className="mt-2">
                <Button variant='primary'
                onClick={()=>this.setState({addModalShow:true})}>
                Add Video
                </Button>
                <Button variant='success'
                onClick={()=>this.getVideos()}>
                Get Videos
                </Button>
                <Button variant='success'
                onClick={()=>this.listVideos()}>
                List Videos
                </Button>
                <AddModal show={this.state.addModalShow}
                onHide={addModalClose}/>
            </ButtonToolbar>
            <Table className="mt-2" striped bordered hover size="sm">
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Name</th>
                        <th>Likes</th>
                        <th>Views</th>
                        <th>Options</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        Videos.map(video=>
                            <tr key={video.id}>
                                <td>{video.id}</td>
                                <td>{video.name}</td>
                                <td>{video.likes}</td>
                                <td>{video.views}</td>
                                <td>
                                    <ButtonToolbar>
                                        <Button className="mr-2" variant="danger"
                                        onClick={()=>this.deleteVideo(video.id)}>
                                            Delete
                                        </Button>
                                    </ButtonToolbar>
                                </td>
                            </tr>
                        )
                    }
                </tbody>
            </Table>
            </div>
        );
    }
}