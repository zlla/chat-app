import { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { string } from "prop-types";

const Chat = (props) => {
  const { token } = props;
  const [connection, setConnection] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  //for send private message
  const [test, setTest] = useState("");

  const sendMessage = async () => {
    if (connection && message) {
      try {
        await connection.send("SendMessageToAll", message);
        setMessage("");
      } catch (error) {
        console.log("Error: ", error);
        alert("Failed to send message");
      }
    }
  };

  const sendPrivateMessage = async () => {
    if (connection && message) {
      try {
        await connection.send("SendPrivateMessage", test, message);
        setMessage("");
      } catch (error) {
        console.log("Error: ", error);
        alert("Failed to send message");
      }
    }
  };

  useEffect(() => {
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:5255/chat", {
        accessTokenFactory: () => {
          return token;
        },
      })
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);

    newConnection
      .start()
      .then(() => {
        newConnection.on("ReceiveMessage", (message) => {
          setMessages((prevMessages) => [...prevMessages, message]);
        });
      })
      .catch((error) => {
        console.log(error);
      });

    return () => {
      if (newConnection) {
        newConnection.off("ReceiveMessage");
        newConnection.stop();
      }
    };
  }, [token]);

  return (
    <div>
      <h2>SignalR Chat</h2>
      <div>
        <p>User Name: {localStorage.getItem("username")}</p>
      </div>
      <div>
        {messages.map((msg, index) => (
          <p key={index}>{msg}</p>
        ))}
      </div>
      <div>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>

      <div>
        <br />
        <label htmlFor="chat_id">Chat id</label>
        <br />
        <input
          id="chat_id"
          type="text"
          value={test}
          onChange={(e) => setTest(e.target.value)}
        />
        <button onClick={sendPrivateMessage}>Send Private Message</button>
      </div>
    </div>
  );
};

Chat.propTypes = {
  token: string,
};

export default Chat;
