import React, { useState } from 'react';
import axios from 'axios';
import './ChatWidget.css';

function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const toggleChat = () => setIsOpen(!isOpen);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { text: input, from: 'user' };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    try {
      const response = await axios.post(
        'https://railway-up-production-aca8.up.railway.app/api/chat',
        { message: input }
      );

      const botReply = response.data.reply || 'No response from server.';
      setMessages((prev) => [...prev, { text: botReply, from: 'bot' }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => [
        ...prev,
        { text: '⚠️ Error reaching chatbot server.', from: 'bot' },
      ]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <div className="chat-widget-container">
      {isOpen && (
        <div className="chat-box">
          <div className="chat-header">Chat with KCAA</div>
          <div className="chat-body">
            {messages.map((msg, index) => (
              <div key={index} className={`chat-message ${msg.from}`}>
                {msg.text}
              </div>
            ))}
          </div>
          <div className="chat-footer">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
            />
            <button onClick={sendMessage}>📤</button>
          </div>
        </div>
      )}
      <button className="chat-toggle-btn" onClick={toggleChat}>
        {isOpen ? '✖️' : '💬'}
      </button>
    </div>
  );
}

export default ChatWidget;
