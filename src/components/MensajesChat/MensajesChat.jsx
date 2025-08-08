import './MensajesChat.css';
import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import { useNavigate } from 'react-router-dom';

const MensajesChat = ({ messages, socket, usuarioSeleccionado, setUsuarioSeleccionado, lastMessageRef }) => {
    const navigate = useNavigate();
    const [typingStatus, setTypingStatus] = useState('');

    const salirChat = () => {
        socket.emit('disconnectUser', { userName: localStorage.getItem("userName"), socketID: localStorage.getItem("userName") });
        localStorage.removeItem('userName');
        navigate('/chat/login');
    }

    useEffect( () => {        
        socket.on('typingResponse', (data) => {
            if(localStorage.getItem("usuarioSeleccionado") == data.user){
                setTypingStatus(data.text);
            }
            setTimeout(() => {
                setTypingStatus("");
            }, 1000);
        });
    }, []);

    const renderMensajes = () => {
        
        if(usuarioSeleccionado != ""){
            return (
            <>
            {messages.map((item, index) =>
          item.sender === localStorage.getItem('userName') ? (
                <div className="message__chats text-sm-end" key={index}>
                    <p className='p-0 m-0'><Badge bg="light" text="dark">Usted</Badge></p>
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
                <Button variant="danger" onClick={(event) => salirChat()}>Salir</Button>
            </header>
            <div className="message__container">
                {renderMensajes()}
                
                <div ref={lastMessageRef} />   
            </div>
            
            
        </>
    )
};
export default MensajesChat;