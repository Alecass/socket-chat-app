import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import "./App.css";

const CONNECTION_URL = "localhost:3002/";

function App() {

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const socket = useRef();


  useEffect(() => {
    socket.current = io(CONNECTION_URL);
  }, []);


  useEffect(() => {

    socket.current.on("receive_message",message => {
      setMessages((oldMessages) => [...oldMessages, message]);
    })

  },[])


  function renderMessageList() {
    
    const messageList = messages.map((message) => {
      return <div className="message">
          <p>{message}</p>
        </div>;
    })

    return <div className="message-list">
      {messageList}
    </div>

  }


  async function sendMessage() {

    await socket.current.emit("send_message", message);
    setMessages((oldMessages) => [...oldMessages, message]);
    setMessage('');
  } 

  return (
    <div className="App">

    <header>
      <h1>Socket Chat app</h1>
      <div>
        <input 
          value={message} 
          onChange={(e) => {setMessage(e.target.value)}}/>
        <button onClick={sendMessage}>Send</button>
      </div>
    </header>

    {renderMessageList()}

    </div>
  );
}

export default App;
