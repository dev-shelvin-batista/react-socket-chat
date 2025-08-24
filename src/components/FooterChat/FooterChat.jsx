import './FooterChat.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import React, { useState } from 'react';

const FooterChat = ({ setMessages, messages, socket, usuarioSeleccionado, setUsuarioSeleccionado}) => {
    const [inputMessage, setInputMessage] = useState('');

    /**
     * Metodo para notificar a los demas cuando un usuario esta escribirnso
     */
    const handleTyping = () => {
        socket.emit('typing', {
            user: localStorage.getItem('userName'),
            text: `Typing...`
        });
    };

    /**
     * Metodo para notificar un nuevo mensaje
     * 
     * @param e Evento del formulario
     */
    const enviarMensaje = (e) => {
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

            let listado_usuarios = localStorage.getItem("listado_usuarios") || "[]";
            listado_usuarios = JSON.parse(listado_usuarios);
            const user = listado_usuarios.find((user) => user.socketID === usuarioSeleccionado);

            obj_message = {
                text: inputMessage,
                date: currentDate,
                sender: localStorage.getItem('userName'),
                to: usuarioSeleccionado
            }

            user.messages.push(obj_message)
            localStorage.setItem('listado_usuarios', JSON.stringify(listado_usuarios)); 

            
            messages.push(obj_message)
            setMessages([...messages])

            socket.emit('message', obj_message);
            setInputMessage('');
        }
        
    }

    /**
     * Metodo para generar los mensajes de chat de un usuario seleccionado
     */
    const renderFormulario = () => {
        if(usuarioSeleccionado != "") {
            return (
                <form className="form" onSubmit={enviarMensaje}>
                   
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
                {renderFormulario()}
            </div>
        </>
    )
};
export default FooterChat;