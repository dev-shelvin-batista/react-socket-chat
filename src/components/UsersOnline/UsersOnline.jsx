import './UsersOnline.css';
import ListGroup from 'react-bootstrap/ListGroup';
import Badge from 'react-bootstrap/Badge';
import React, { useState, useEffect } from 'react';

const UsersOnline = ({ users, setUsers, setMessages, messages, socket, userSelected, setUserSelected }) => {

    useEffect( () => {
        generateUsers();

        // Socket event to update the list of users when a new or already registered user connects
        socket.on('newUserResponse', (data) => {
            let list_users = localStorage.getItem("list_usersReact") || "[]";
            list_users = JSON.parse(list_users);
            data.list.map((item) => {
                const exist = list_users.find((user) => user.socketID === item.userName);
                if(!exist){
                    list_users.push({
                        userName: item.userName, socketID: item.socketID, new_messages: 0, online: item.online, messages: []
                    })
                } else {
                    exist.online = item.online;
                }
            })
            const user = list_users.find((user) => user.socketID === data.user.userName);
            if(user){
                user.online = data.user.online
            }else{
                list_users.push({
                    userName: data.user.userName, socketID: data.user.socketID, new_messages: 0, online: data.user.online, messages: []
                })
            }
            setUsers(list_users);
            localStorage.setItem('list_usersReact', JSON.stringify(list_users));  
        });
    }, []);
        
    /**
     * Method for selecting a user and displaying their chat messages
     * @param event 
     * @param row Object with selected user data
     */
    const selectUser = (event, row) => {
        userSelected = row.socketID;
        setUserSelected(row.socketID);

        row.new_messages = 0;
        
        localStorage.setItem('userSelectedReact', userSelected);

        let list_users = localStorage.getItem("list_usersReact") || "[]";
        list_users = JSON.parse(list_users);

        list_users.map((item) => {
            if(item.socketID == userSelected) {
                item.new_messages = 0;
                messages = [...item.messages]
            }
        })
      
        localStorage.setItem('list_usersReact', JSON.stringify(list_users));   
        setUsers(list_users);
        
        setMessages([...messages]);
    }

    /**
     * Method for loading the list of users saved in localStorage
     */
    const generateUsers = () => {
        let list_users = localStorage.getItem("list_usersReact") || "[]";
        list_users = JSON.parse(list_users);
        setUsers(list_users);        
    }

    /**
     * Method for generating a new message label next to the user nickname in the list
     * 
     * @param new_messages Number of new messages
     * 
     */
    const generatePathBadgeNewMessage = (new_messages) => {
        if(new_messages > 0) {
            return (<Badge bg="primary">{new_messages}</Badge>)
        }
    }

    /**
     *  Method for generating the list of users on the left side of the page, but each user generated must be different from the user who logged in.
     *  
     * @param row Object with user data
     */
    const conditionalRender = (row) => {
        if(row.socketID != localStorage.getItem('userNameReact')) {
            return <ListGroup.Item key={row.socketID} className="d-flex justify-content-between align-items-start" onClick={ (event) => selectUser(event, row)}>
                <Badge bg={row.online ? "success" : "danger"}>{row.userName}</Badge>
                
                {generatePathBadgeNewMessage(row.new_messages)}
                
            </ListGroup.Item>;
        }
    }
    return (
        <div className="chat__sidebar">
            <h3 className='m-2'>Chat Example</h3>

            <ListGroup>
                {users.map((row, index) => (
                    conditionalRender(row)                
                ))}
            </ListGroup>
        </div>
    )
};
export default UsersOnline;