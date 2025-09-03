import './Login.css';
import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { useNavigate } from 'react-router-dom';

export const Login = ({ socket }) => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');

  useEffect(() => { 
    validateUser();    
  }, [socket]);

  /**
   * Method to validate whether a user has an active session
   */
  const validateUser = () => {
    if(localStorage.getItem("userNameReact")) {
      navigate('/chat/home');
    }
  }

  /**
   * Method for logging in and notifying other users who are logged in
   */
  const login = (e) => {
    e.preventDefault();
    if(userName.trim() !== ""){
      localStorage.setItem('userNameReact', userName);
      
      socket.emit('newUserLogin', { userName, socketID: userName, online: true}); 
      navigate('/chat/home');
    }
    
  }

  return (
    <>
      <div className="container mt-5">
        <div className="row">
          <div className="col-2"></div>
          <div className="col-">
            <form className="form" onSubmit={login}>
              <Card style={{ width: '100%' }}>
                <Card.Body>
                  <Card.Header>
                    <Card.Title>Enter the chat</Card.Title>
                  </Card.Header>
                  
                  <Card.Body>
                    <InputGroup className="mb-3 mt-4">
                      <InputGroup.Text id="basic-addon1">*</InputGroup.Text>
                      <Form.Control
                        placeholder="Enter a username"
                        aria-label="User"
                        aria-describedby="basic-addon1"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                      />
                    </InputGroup>
          
                    </Card.Body>
                  <Card.Footer className="text-end">
                    <Button variant="primary" type='submit'>Enter</Button>
                  </Card.Footer>
                  
                </Card.Body>
              </Card>
            </form>
          </div>
          <div className="col-"></div>
        </div>
        
      </div>     
      
    </>
  );
}

