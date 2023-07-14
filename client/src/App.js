import React, { useEffect, useState } from "react";
import "./App.css";
import io from "socket.io-client";

const socket = io.connect("http://localhost:3001");

function App() {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        message: currentMessage,
        isSent: true,
      };

      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  };

  useEffect(() => {
    const receiveMessage = (data) => {
      const receivedMessage = {
        ...data,
        isSent: false,
      };
      setMessageList((list) => [...list, receivedMessage]);
    };

    socket.on("receive_message", receiveMessage);

    return () => {
      socket.off("receive_message", receiveMessage);
    };
  }, []);

  return (
    <main className="flex flex-col items-center mt-10">
      <h1 className="font-bold text-4xl text-transparent bg-clip-text bg-gradient-to-r from-slate-500 to-blue-400 mb-5">
        Socket.io-Chat
      </h1>
      <div className="bg-white border-2 border-black h-96 p-2 flex flex-col justify-between rounded-lg shadow-xl  ">
        <div className="flex flex-col overflow-y-auto no-scrollbar p-2">
          {messageList.map((messageContent, index) => (
            <div
              key={index}
              className={`flex ${
                messageContent.isSent ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-3 py-1 my-1 rounded-lg font-serif  ${
                  messageContent.isSent
                    ? "bg-blue-500 text-white self-end"
                    : "bg-green-300 text-black self-start"
                }`}
              >
                <p className="text-lg">{messageContent.message}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center p-1">
          <input
            type="text"
            placeholder="Message..."
            className="border-2 rounded-xl px-4 py-2 focus:outline-none  focus:border-blue-300 flex-grow"
            value={currentMessage}
            onChange={(event) => setCurrentMessage(event.target.value)}
            onKeyPress={(event) => {
              event.key === "Enter" && sendMessage();
            }}
          />
          <button
            onClick={sendMessage}
            className="bg-blue-500 text-white rounded-xl px-2 py-2 ml-2 hover:bg-blue-600 focus:outline-none"
          >
            Send Message
          </button>
        </div>
      </div>
    </main>
  );
}

export default App;
