import { useEffect, useState } from "react";
import API from "../services/api";
import "../styles/messages.css";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);

  const fetchMessages = async () => {
    try {
      const res = await API.get("/messages");
      setMessages(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const loadMessages = async () => {
      await fetchMessages();

      try {
        await API.put("/messages/read-all");
      } catch (error) {
        console.log(error);
      }

      fetchMessages();
    };

    loadMessages();
  }, []);

  const handleSelect = async (message) => {
    try {
      if (selectedMessage?._id === message._id) {
        setSelectedMessage(null);
        return;
      }

      setSelectedMessage(message);

      if (!message.isRead) {
        await API.put(`/messages/read/${message._id}`);

        fetchMessages();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this message?")) return;

    try {
      await API.delete(`/messages/${id}`);

      fetchMessages();

      if (selectedMessage?._id === id) {
        setSelectedMessage(null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const unreadCount = messages.filter((msg) => !msg.isRead).length;

  return (
    <div className="messages-page">
      <div className="messages-header">
        <div>
          <h1>
            Inbox
            <span className="count-badge">{messages.length}</span>
          </h1>

          <p>Manage visitor inquiries</p>
        </div>

        <div className="messages-stats">
          <div className="stat-card">
            <h2>{messages.length}</h2>
            <span>Total</span>
          </div>

          <div className="stat-card">
            <h2>{unreadCount}</h2>
            <span>Unread</span>
          </div>
        </div>
      </div>

      <div className="messages-layout">
        {messages.length === 0 ? (
          <div className="empty-state">No messages yet</div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg._id}
              className={`message-card ${
                selectedMessage?._id === msg._id ? "expanded" : ""
              }`}
              onClick={() => handleSelect(msg)}
            >
              <div className="message-preview">
                <div className="message-info">
                  <h3>{msg.name}</h3>

                  <p>{msg.email}</p>

                  <small>{new Date(msg.createdAt).toLocaleString()}</small>
                </div>

                {!msg.isRead && <span className="unread-dot"></span>}
              </div>

              {selectedMessage?._id === msg._id && (
                <div className="message-body">
                  <div className="message-text">{msg.message}</div>

                  <button
                    className="delete-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(msg._id);
                    }}
                  >
                    Delete Message
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Messages;
