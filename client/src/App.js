import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import "./App.css";

const CONNECTION_URL = "localhost:3002/";

function App() {

  const [userId,setUserId] = useState();

  const [joined,setJoined] = useState(false);
  const [username,setUsername] = useState("");
  const [room, setRoom] = useState("");
  
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [punches,setPunches] = useState(0);


  const socket = useRef();


  useEffect(() => {
    socket.current = io(CONNECTION_URL);
  }, []);


  useEffect(() => {

    socket.current.on("get_id", id => {
      setUserId(id);
    })

  }, []);


  useEffect(() => {

    socket.current.on("receive_message",messageContent => {
      setMessages((oldMessages) => [...oldMessages, messageContent]);
    })

  },[])


  useEffect(() => {

    socket.current.on("receive_private_emoji", () => {
     setPunches((oldPunches) => oldPunches + 1);
    })

  }, [])


  function renderMessageList() {
    
    const messageList = messages.map((message,index) => {
      
      return <div key={message + index} className="message" onClick={() => sendEmoji(message.userId)}>
          <p><b>{message.username}</b></p>
          <p>{message.message}</p>
        </div>;

    })

    return <div className="message-list">
      {messageList}
    </div>

  }


  async function sendEmoji(userId) {

    console.log(userId);

    await socket.current.emit("send_private_emoji", userId);
  }


  async function sendMessage() {

    let messageContent = {
      room: room,
      content: {
        userId:userId,
        username: username,
        message: message,
      },
    };

    await socket.current.emit("send_message", messageContent);
    setMessages((oldMessages) => [...oldMessages, messageContent.content]);
    setMessage('');
  } 


  function joinRoom() {
    
    if (room.length == 0 || username.lenght == 0 || userId == null){
      return
    }

    const data = {
      room:room,
      username:username,
    }

    socket.current.emit("join_room", data);
    setJoined(true);
  }
  

  function renderLogin() {

    if(joined === true || userId == null){
      return;
    }

    return <div className="login">

      <p><b>CHAT APP LOGIN</b></p>

      <input
        value={username}
        placeholder="username..."
        onChange={(e) => { setUsername(e.target.value) }} />

      <input
        value={room}
        placeholder="room..."
        onChange={(e) => { setRoom(e.target.value) }} />

      <button onClick={joinRoom}>Join</button>

    </div>

  }


  function renderChat() {

    if (joined === false) {
      return;
    }

    return <div>

      <header>

        <p><b>{username}</b></p>
        <p>🥊 received : {punches}</p>

        <h1>{room}</h1>

        <div>
          <input
            value={message}
            onChange={(e) => { setMessage(e.target.value) }} />
          <button onClick={sendMessage}>Send</button>
        </div>
      </header>

      { renderMessageList() }

    </div>;

  }

  return (
    <div className="App">

      {renderLogin()}
      {renderChat()}

    </div>
  );
}

export default App;
