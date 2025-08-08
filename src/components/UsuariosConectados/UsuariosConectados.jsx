import './UsuariosConectados.css';
import ListGroup from 'react-bootstrap/ListGroup';
import Badge from 'react-bootstrap/Badge';
import React, { useState, useEffect } from 'react';

const UsuariosConectados = ({ users, setUsers, setMessages, messages, socket, usuarioSeleccionado, setUsuarioSeleccionado }) => {

    useEffect( () => {
        generarUsuarios();
        socket.on('newUserResponse', (data) => {
            let listado_usuarios = localStorage.getItem("listado_usuarios") || "[]";
            listado_usuarios = JSON.parse(listado_usuarios);
            data.list.map((item) => {
                const exist = listado_usuarios.find((user) => user.socketID === item.userName);
                if(!exist){
                    listado_usuarios.push({
                        userName: item.userName, socketID: item.socketID, nuevos_mensajes: 0, online: item.online, messages: []
                    })
                } else {
                    exist.online = item.online;
                }
            })
            const user = listado_usuarios.find((user) => user.socketID === data.user.userName);
            if(user){
                user.online = data.user.online
            }else{
                listado_usuarios.push({
                    userName: data.user.userName, socketID: data.user.socketID, nuevos_mensajes: 0, online: data.user.online, messages: []
                })
            }
            setUsers(listado_usuarios);
            localStorage.setItem('listado_usuarios', JSON.stringify(listado_usuarios));  
        });
    }, []);
        
    /**
     * Metodo para seleccionar un usuario y asi mostrar sus mensajes del chat
     * @param event 
     * @param row Objeto con los datos del usuario seleccionado
     */
    const seleccionarUsuario = (event, row) => {
        usuarioSeleccionado = row.socketID;
        setUsuarioSeleccionado(row.socketID);

        row.nuevos_mensajes = 0;
        
        localStorage.setItem('usuarioSeleccionado', usuarioSeleccionado);

        let listado_usuarios = localStorage.getItem("listado_usuarios") || "[]";
        listado_usuarios = JSON.parse(listado_usuarios);

        listado_usuarios.map((item) => {
            if(item.socketID == usuarioSeleccionado) {
                item.nuevos_mensajes = 0;
                messages = [...item.messages]
            }
        })
      
        localStorage.setItem('listado_usuarios', JSON.stringify(listado_usuarios));   
        setUsers(listado_usuarios);
        
        setMessages([...messages]);
    }

    /**
     * Metodo para cargar el listado de usuarios guardado en el localStorage
     */
    const generarUsuarios = () => {
        let listado_usuarios = localStorage.getItem("listado_usuarios") || "[]";
        listado_usuarios = JSON.parse(listado_usuarios);
        setUsers(listado_usuarios);        
    }

    /**
     * Metodo para generar el label de mensaje nuevo al lado del nick de usuario en el listado
     * 
     * @param numero_mensajes Número de mensajes nuevo     * 
     */
    const generatePathBadgeNuevosMensaje = (numero_mensajes) => {
        if(numero_mensajes > 0) {
            return (<Badge bg="primary">{numero_mensajes}</Badge>)
        }
    }

    /**
     *  Metodo para generar el listado de usuarios a la izquierda de la pagina, 
     * pero cada usuario generado debe ser diferente al usuario que inicio sesion
     *  
     * @param row Objeto con los datos del usuario
     */
    const conditionalRender = (row) => {
        if(row.socketID != localStorage.getItem('userName')) {
            return <ListGroup.Item key={row.socketID} className="d-flex justify-content-between align-items-start" onClick={ (event) => seleccionarUsuario(event, row)}>
                <Badge bg={row.online ? "success" : "danger"}>{row.userName}</Badge>
                
                {generatePathBadgeNuevosMensaje(row.nuevos_mensajes)}
                
            </ListGroup.Item>;
        }
    }
    return (
        <div className="chat__sidebar">
            <h3 className='m-2'>Chat</h3>

            <ListGroup>
                {users.map((row, index) => (
                    conditionalRender(row)                
                ))}
            </ListGroup>
        </div>
    )
};
export default UsuariosConectados;