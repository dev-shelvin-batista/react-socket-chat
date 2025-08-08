import './Home.css';
import React, { useEffect, useState, useRef } from 'react';
import UsuariosConectados from '../../components/UsuariosConectados/UsuariosConectados';
import MensajesChat from '../../components/MensajesChat/MensajesChat';
import FooterChat from '../../components/FooterChat/FooterChat';
import { useNavigate } from 'react-router-dom';

export const Home = ({ socket }) => {
  const navigate = useNavigate();
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState('');
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const lastMessageRef = useRef(null);

  /**
   * metodo para modificar la variable del usuario seleccionado y asi mostrar el chat
   * 
   * @param usuario usuario a actualizar 
   */
  const onChangeUsuario = (usuario) => {
    setUsuarioSeleccionado(usuario);
  };

  /**
   * Metodo para generar los mensajes del usuario seleccionado
   */
  const generarmensajes = () => {    
    let listado_usuarios = localStorage.getItem("listado_usuarios") || "[]";
    listado_usuarios = JSON.parse(listado_usuarios);
    
    listado_usuarios.map((item) => {
      if (item.socketID == localStorage.getItem("userName")) {        
        setMessages([...item.messages])
      }
    });
  }
  useEffect(() => {
    // 👇️ scroll to bottom every time messages change
    lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  useEffect(() => { 
    localStorage.setItem('usuarioSeleccionado', "");

    validarUsuario();
    generarmensajes();

    socket.on(`messageResponse-${localStorage.getItem("userName")}`, (data) => {
      let listado_usuarios = localStorage.getItem("listado_usuarios") || "[]";
      listado_usuarios = JSON.parse(listado_usuarios);
      
      const user = listado_usuarios.find((user) => user.socketID === data.sender);

      if(localStorage.getItem("usuarioSeleccionado") === ""){
        user.nuevos_mensajes += 1
      }

      user.messages.push({
        text: data.text,
        date: data.date,
        sender: data.sender,
        to: data.to
      });
      setMessages([...user.messages])
      
      localStorage.setItem('listado_usuarios', JSON.stringify(listado_usuarios));   
      setUsers(listado_usuarios);
    });
  }, [socket]);

  /**
   * Metodo para validar si un usuario no tiene una sesion activa
   */
  const validarUsuario = () => {
    if(!localStorage.getItem("userName")) {
      navigate('/chat/login');
    }
  }

  return (
    <>
      <div className="chat">
        <UsuariosConectados users={users} setUsers={setUsers} setMessages={setMessages} messages={messages} socket={socket} usuarioSeleccionado={usuarioSeleccionado} setUsuarioSeleccionado={onChangeUsuario} />

        <div className="chat__main">
          <MensajesChat messages={messages} socket={socket} usuarioSeleccionado={usuarioSeleccionado} setUsuarioSeleccionado={onChangeUsuario} lastMessageRef={lastMessageRef} />
          <FooterChat setMessages={setMessages} messages={messages} socket={socket} usuarioSeleccionado={usuarioSeleccionado} setUsuarioSeleccionado={onChangeUsuario} />
        </div>        
      </div>
      
    </>
  );
}

