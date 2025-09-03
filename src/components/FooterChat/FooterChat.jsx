import './FooterChat.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import React, { useState } from 'react';

const FooterChat = ({ setMessages, messages, socket, userSelected, setUserSelected}) => {
    const [inputMessage, setInputMessage] = useState('');

    /**
     * Method for notifying others when a user is typing
     */
    const handleTyping = () => {
        socket.emit('typing', {
            user: localStorage.getItem('userNameReact'),
            text: `Typing...`
        });
    };

    /**
     * Method for notifying a new message
     * 
     * @param e Form event
     */
    const sendMessage = (e) => {
        e.preventDefault();
        if(inputMessage.trim() != ""){
            let obj_message = {};
            const date = new Date();
            let day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
            let month = (date.getMonth() + 1) < 10 ? `0${(date.getMonth() + 1)}` : (date.getMonth() + 1);
            let year = date.getFullYear();
            let hour = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
            let minute = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
            let currentDate = `${year}-${month}-${day} ${hour}:${minute}`;

            let list_users = localStorage.getItem("list_usersReact") || "[]";
            list_users = JSON.parse(list_users);
            const user = list_users.find((user) => user.socketID === userSelected);

            obj_message = {
                text: inputMessage,
                date: currentDate,
                sender: localStorage.getItem('userNameReact'),
                to: userSelected
            }

            user.messages.push(obj_message)
            localStorage.setItem('list_usersReact', JSON.stringify(list_users)); 

            
            messages.push(obj_message)
            setMessages([...messages])

            socket.emit('message', obj_message);
            setInputMessage('');
        }
        
    }

    /**
     * Method for generating chat messages for a selected user
     */
    const renderForm = () => {
        if(userSelected != "") {
            return (
                <form className="form" onSubmit={sendMessage}>
                   
                    <InputGroup className="message m-0">
                        <InputGroup.Text id="basic-addon1">*</InputGroup.Text>
                        <Form.Control
                            placeholder="Message..."
                            aria-label="Message..."
                            aria-describedby="basic-addon1" 
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyDown={handleTyping}
                        />
                    </InputGroup>
                    <Button variant="success" className='sendBtn' type='submit'>Send</Button>
                </form>
            )
        }
    }

    return (
        <>
            <div className="chat__footer p-0">
                {renderForm()}
            </div>
        </>
    )
};
export default FooterChat;