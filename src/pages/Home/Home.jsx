import './Home.css';
import React, { useEffect, useState, useRef } from 'react';
import FooterChat from '../../components/FooterChat/FooterChat';
import { useNavigate } from 'react-router-dom';
import UsersOnline from '../../components/UsersOnline/UsersOnline';
import MessagesChat from '../../components/MessagesChat/MessagesChat';

export const Home = ({ socket }) => {
  const navigate = useNavigate();
  const [userSelected, setUserSelected] = useState('');
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const lastMessageRef = useRef(null);

  /**
   * Method to modify the selected user variable and thus display the chat
   * 
   * @param user User to be updated
   */
  const onChangeUser = (user) => {
    setUserSelected(user);
  };

  /**
   * Method for generating messages for the selected user
   */
  const generateMessages = () => {    
    let list_users = localStorage.getItem("list_usersReact") || "[]";
    list_users = JSON.parse(list_users);
    
    list_users.map((item) => {
      if (item.socketID == localStorage.getItem("userNameReact")) {        
        setMessages([...item.messages])
      }
    });
  }

  useEffect(() => {
    // 👇️ scroll to bottom every time messages change
    lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  useEffect(() => { 
    localStorage.setItem('userSelectedReact', "");

    validateUser();
    generateMessages();

    // Socket event to receive messages from other users
    socket.on(`messageResponse-${localStorage.getItem("userNameReact")}`, (data) => {
      let list_users = localStorage.getItem("list_usersReact") || "[]";
      list_users = JSON.parse(list_users);
      
      const user = list_users.find((user) => user.socketID === data.sender);

      if(localStorage.getItem("userSelectedReact") === ""){
        user.new_messages += 1
      }

      user.messages.push({
        text: data.text,
        date: data.date,
        sender: data.sender,
        to: data.to
      });
      setMessages([...user.messages])
      
      localStorage.setItem('list_usersReact', JSON.stringify(list_users));   
      setUsers(list_users);
    });
  }, [socket]);

  /**
   * Method to validate whether a user does not have an active session
   */
  const validateUser = () => {
    if(!localStorage.getItem("userNameReact")) {
      navigate('/chat/login');
    }
  }

  return (
    <>
      <div className="chat">
        <UsersOnline users={users} setUsers={setUsers} setMessages={setMessages} messages={messages} socket={socket} userSelected={userSelected} setUserSelected={onChangeUser} />

        <div className="chat__main">
          <MessagesChat messages={messages} socket={socket} userSelected={userSelected} setUserSelected={onChangeUser} lastMessageRef={lastMessageRef} />
          <FooterChat setMessages={setMessages} messages={messages} socket={socket} userSelected={userSelected} setUserSelected={onChangeUser} />
        </div>        
      </div>
      
    </>
  );
}

