import { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";
import axios from "axios";

const Chat = () => {
  const [connection, setConnection] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  // const [connectionId, setConnectionId] = useState("");
  const [token, setToken] = useState("");
  const [refreshTokenInterval, setRefreshTokenInterval] = useState(null);
  const [userName, setUserName] = useState("");

  const [test, setTest] = useState("");

  useEffect(() => {
    const initialToken = localStorage.getItem("accessToken");
    setToken(initialToken);

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
          // setConnectionId(newConnection.connectionId);
        });

        const intervalId = setInterval(refreshToken, 30000);
        setRefreshTokenInterval(intervalId);
      })
      .catch((error) => {
        console.log(error);
      });

    fetchUserInfo();

    return () => {
      if (newConnection) {
        newConnection.off("ReceiveMessage");
        newConnection.stop();
      }

      if (refreshTokenInterval) {
        clearInterval(refreshTokenInterval);
      }
    };
  }, [token]);

  const refreshToken = async () => {
    try {
      const newToken = await fetchNewToken();
      setToken(newToken);
    } catch (error) {
      console.log("Error refreshing token: ", error);
    }
  };

  const fetchNewToken = async () => {
    const aT = localStorage.getItem("accessToken");
    const rT = localStorage.getItem("refreshToken");
    const apiUrl = "http://localhost:5255";

    const axiosInstance = axios.create({
      baseURL: apiUrl,
      headers: {
        Authorization: `Bearer ${aT}`,
        refreshToken: rT,
      },
    });

    axiosInstance
      .post(`${apiUrl}/api/auth/refresh-token`)
      .then((response) => {
        let aT = response.data.accessToken;
        localStorage.setItem("accessToken", aT);
        localStorage.setItem("refreshToken", response.data.refreshToken);
        return aT;
      })
      .catch((error) => {
        console.error(error);
      });
  };

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

  const fetchUserInfo = async () => {
    const aT = localStorage.getItem("accessToken");
    const apiUrl = "http://localhost:5255";

    const axiosInstance = axios.create({
      baseURL: apiUrl,
      headers: {
        Authorization: `Bearer ${aT}`,
      },
    });

    axiosInstance
      .get(`${apiUrl}/api/GetUserInformation`)
      .then((response) => {
        setUserName(response.data.username);
      })
      .catch((error) => {
        console.log(error);
        // navigate("/auth/login");
      });
  };

  return (
    <div>
      <h2>SignalR Chat</h2>
      <div>
        <p>User Name: {userName}</p>
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

export default Chat;
