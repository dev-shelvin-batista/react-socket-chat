import './MessagesChat.css';
import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import { useNavigate } from 'react-router-dom';

const MessagesChat = ({ messages, socket, userSelected, setUserSelected, lastMessageRef }) => {
    const navigate = useNavigate();
    const [typingStatus, setTypingStatus] = useState('');

    /**
     * Method for logging out and exiting the chat
     */
    const LogOut = () => {
        socket.emit('disconnectUser', { userName: localStorage.getItem("userNameReact"), socketID: localStorage.getItem("userNameReact") });
        localStorage.removeItem('userNameReact');
        navigate('/chat/login');
    }

    useEffect( () => {
        // Socket event to show that a user is typing
        socket.on('typingResponse', (data) => {
            if(localStorage.getItem("userSelectedReact") == data.user){
                setTypingStatus(data.text);
            }
            setTimeout(() => {
                setTypingStatus("");
            }, 1000);
        });
    }, []);

    /**
     * 
     * Render chat message design with a user
     * @returns Chat design
     */
    const renderMessages = () => {        
        if(userSelected != ""){
            return (
            <>
            {messages.map((item, index) =>
          item.sender === localStorage.getItem('userNameReact') ? (
                <div className="message__chats text-sm-end" key={index}>
                    <p className='p-0 m-0'><Badge bg="light" text="dark">You</Badge></p>
                    <div className="message__sender">
                        <p className='p-0 m-0 text-start'>{ item.text }</p>
                        <p className='p-0 m-0 text-end'><Badge bg="light" text="dark">{ item.date }</Badge></p>
                    </div>
                </div>               
                ) : (

                <div className="message__chats" key={index}>
                    <p className='p-0 m-0'><Badge bg="light" text="dark">{ item.sender }</Badge></p>
                    <div className="message__recipient text-sm-end">
                        <p className='p-0 m-0 text-start'>{ item.text }</p>
                        <p className='p-0 m-0 text-end'><Badge bg="light" text="dark">{ item.date }</Badge></p>
                    </div>
                </div>
                )
                )}
                <div className="message__status">
                    <p><Badge bg="light" text="dark">{typingStatus}</Badge></p>
                </div>
                
            </>)
        }        
    }

    return (
        <>
            <header className="chat__mainHeader text-end m-0 p-1">
                <Button variant="danger" onClick={(event) => LogOut()}>Exit</Button>
            </header>
            <div className="message__container">
                {renderMessages()}
                
                <div ref={lastMessageRef} />   
            </div>
            
            
        </>
    )
};
export default MessagesChat;