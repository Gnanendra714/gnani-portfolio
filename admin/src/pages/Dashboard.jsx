import { useEffect, useState } from "react";

import API from "../services/api";

import "../styles/dashboard.css";

const Dashboard = () => {
  const [messages, setMessages] = useState([]);

  // FETCH LATEST UNREAD MESSAGES

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await API.get("/messages");

        const unread = res.data.filter((msg) => !msg.isRead);

        setMessages(unread);
      } catch (error) {
        console.log(error);
      }
    };

    fetchMessages();
  }, []);

  return (
    <div className="dashboard-page">
      {/* HEADER */}

      <div className="dashboard-hero">
        <div>
          <h1>Welcome Back, Gnani 👋</h1>

          <p>Your portfolio CMS is running smoothly.</p>
        </div>
      </div>

      {/* STATS */}

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Projects</h3>

          <p>Manage Portfolio Work</p>
        </div>

        <div className="stat-card">
          <h3>Skills</h3>

          <p>Update Technologies</p>
        </div>

        <div className="stat-card">
          <h3>Inbox</h3>

          <p>{messages.length} New Messages</p>
        </div>
      </div>

      {/* RECENT MESSAGES */}

      <div className="notification-center">
        {messages.length === 0 ? (
          <div className="empty-notification">No new messages</div>
        ) : (
          messages.slice(0, 5).map((message) => (
            <div className="notification-item" key={message._id}>
              <div className="notification-left">
                <div className="notification-dot"></div>

                <div>
                  <h4>{message.name}</h4>

                  <p>sent you a message</p>
                </div>
              </div>

              <span>{new Date(message.createdAt).toLocaleString()}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
