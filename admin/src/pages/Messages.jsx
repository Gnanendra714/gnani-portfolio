import { useEffect, useState } from "react";

import API from "../services/api";

import "../styles/messages.css";

const Messages = () => {
  const [messages, setMessages] = useState([]);

  const [selectedMessage, setSelectedMessage] = useState(null);

  // FETCH

  const fetchMessages = async () => {
    try {
      const res = await API.get("/messages");

      setMessages(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // OPEN MESSAGE

  const openMessage = async (message) => {
    setSelectedMessage(message);

    // AUTO MARK READ

    if (!message.isRead) {
      try {
        await API.put(`/messages/${message._id}/read`);

        fetchMessages();
      } catch (error) {
        console.log(error);
      }
    }
  };

  // DELETE

  const deleteMessage = async (id) => {
    try {
      await API.delete(`/messages/${id}`);

      fetchMessages();

      setSelectedMessage(null);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="messages-page">
      <div className="messages-sidebar">
        <h1>Inbox</h1>

        <div className="messages-list">
          {messages.map((message) => (
            <div
              key={message._id}
              className={`message-preview ${!message.isRead ? "unread" : ""}`}
              onClick={() => openMessage(message)}
            >
              <h3>{message.name}</h3>

              <p>{message.email}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="message-viewer">
        {selectedMessage ? (
          <div className="viewer-card">
            <h2>{selectedMessage.name}</h2>

            <p>{selectedMessage.email}</p>

            <div className="viewer-message">{selectedMessage.message}</div>

            <button
              className="delete-btn"
              onClick={() => deleteMessage(selectedMessage._id)}
            >
              Delete Message
            </button>
          </div>
        ) : (
          <div className="empty-view">Select a message</div>
        )}
      </div>
    </div>
  );
};

export default Messages;
