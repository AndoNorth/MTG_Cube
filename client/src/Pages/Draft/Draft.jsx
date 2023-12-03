import React,{Component} from 'react';
import {Form, Button, ButtonToolbar, Table} from 'react-bootstrap';
import io from 'socket.io-client';

export class Draft extends Component{
  constructor(props){
    super(props);
    this.state={sessionId:localStorage.getItem('sessionId') || '',
    playerName: localStorage.getItem('playerName') || '', players:[],
      socket: null,
    };
    this.handleJoinSession=this.handleJoinSession.bind(this);
  }

  initSocket = (event) => {
    event.preventDefault();
    const socket = io(import.meta.env.VITE_BACKEND_API);

    socket.on('playerJoined', (updatedPlayers) => {
      this.setState({players:updatedPlayers});
    });
  
    socket.on('sessionError', (error) => {
      console.error('Session error:', error);
    });

    this.setState({socket: socket});
  }

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleCreateSession = (event) => {
    event.preventDefault();
    const response = fetch(import.meta.env.VITE_BACKEND_API+'createSession', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(response=>response.json())
    .then(data=>{
      const { sessionId } = data;
      this.setState({sessionId:sessionId});
  
      const { socket, playerName } = this.state;
      socket.emit('joinSession', sessionId, playerName)
    },(error)=>{
      alert(error);
    });
  };

  handleJoinSession(event){
      event.preventDefault();
      const {socket, playerName}=this.state;
      const sessionId = event.target.sessionId.value;
      this.setState({sessionId:sessionId});
      socket.emit('joinSession', sessionId, playerName);
  };
  
  render(){
    const {sessionId, players, socket}=this.state

    return(
    <div>
      {socket == null &&
          <Form onSubmit={this.initSocket}>
            <Form.Group>
              <Form.Control type="text" name="playerName" required onChange={this.handleInputChange} placeholder="Enter your name"/>
            </Form.Group>
            <Form.Group>
              <ButtonToolbar className="justify-content-center">
                <Button className="mr-2" variant="primary" type="submit">Connect to Server</Button>
              </ButtonToolbar>
            </Form.Group>
          </Form>
      }
      {socket != null && (
        <div>
        <h2>Draft Session</h2>
        {!sessionId &&
          <div>
          <Form onSubmit={this.handleJoinSession}>
            <Form.Group>
              <Form.Control type="text" name="sessionId" placeholder="Enter session id"/>
            </Form.Group> <br/>
            <Form.Group>
              <ButtonToolbar>
                <Button className="mr-2" variant="primary" type="submit">Join Session</Button>
                <Button className="mr-2" variant="danger" onClick={this.handleCreateSession}>Create Session</Button>
              </ButtonToolbar>
            </Form.Group>
          </Form>
          </div>
        }
        {sessionId && (
          <div>
          <p>Session ID: {sessionId}</p>
          {players.length > 0 && (
            <div>
            <Table className="mt-2" striped bordered hover size="sm">
              <thead>
                <tr>
                  <th>Players</th>
                  <th>Options</th>
                </tr>
              </thead>
              <tbody>
                {players.map((player) => (
                <tr key={player.id}>
                  <td>{player.name}</td>
                  <td>
                    <ButtonToolbar>
                      <Button className="mr-2" variant="danger"
                      onClick={()=>this.deleteTransaction(trans.id)}>
                        Ready
                      </Button>
                      <Button className="mr-2" variant="danger"
                      onClick={()=>this.deleteTransaction(trans.id)}>
                        Leave session
                      </Button>
                    </ButtonToolbar>
                  </td>
                </tr>
                ))}
              </tbody>
            </Table>
            <ul>
            </ul>
            </div>
            )}
          </div>
        )}
        </div>
      )}
    </div>
    );
  }
}