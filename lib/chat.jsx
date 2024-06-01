import React, { useState, useEffect, useRef } from 'react';

export default function Chat( { userId }) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState([]);
  const ws = useRef(null);
  const user = userId; // Hardcoded user ID for this example

  useEffect(() => {
    ws.current = new WebSocket('ws://localhost:8080');

    ws.current.onopen = () => {
      console.log('WebSocket connection opened');
    };

    ws.current.onmessage = (message) => {
      const parsedMessage = JSON.parse(message.data);
      setMessages((prevMessages) => [...prevMessages, parsedMessage]);

      if (!isChatOpen) {
        setUnreadCount((count) => count + 1);
      }
    };

    ws.current.onclose = () => {
      console.log('WebSocket connection closed');
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      ws.current.close();
    };
  }, [isChatOpen]);


  function openChatClick() {
    setIsChatOpen(!isChatOpen);
    setUnreadCount(0);
  }

  function closeChatClick() {
    setIsChatOpen(!isChatOpen);
  }

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      const message = {
        userId: userId,
        text: inputValue,
      };
      ws.current.send(JSON.stringify(message));
      setMessages((prevMessages) => [...prevMessages, message]);
      setInputValue('');
    }
  };


  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <>
    <div className="open-chat" onClick={openChatClick}>
        {unreadCount > 0 && (
          <div className="chat-unread-badge">{unreadCount}</div>
                )}        
        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-chat-text-fill" viewBox="0 0 16 16">
          <path d="M16 8c0 3.866-3.582 7-8 7a9 9 0 0 1-2.347-.306c-.584.296-1.925.864-4.181 1.234-.2.032-.352-.176-.273-.362.354-.836.674-1.95.77-2.966C.744 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7M4.5 5a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1zm0 2.5a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1zm0 2.5a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1z"/>
        </svg>
      </div>
      <div className={isChatOpen ? "chat-container chat-container--visible" : "chat-container"}>
        <div className="chat-title-bar">
          <h4>Staff Team Chat</h4>
          <svg onClick={closeChatClick} xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-x-square-fill" viewBox="0 0 16 16">
            <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm3.354 4.646L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 1 1 .708-.708"/>
          </svg>
        </div>
        <div className="chat-log"> 
          {messages.map((msg, index) => (
             <div className={`${msg.userId == user ? 'chat-message chat-message--self' : 'chat-message'}`}>
              <div
                key={index}
                className="chat-message-inner">
                {msg.text}
              </div>
            </div>
          ))} 
        </div>
        <form onSubmit={handleSendMessage}>
          <input 
                className="chat-input"
                type="text" 
                autoComplete="off" 
                placeholder="your message here" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}  />
          <button className="chat-send-btn" onClick={handleSendMessage}>Send</button>
        </form>
      </div>
    </>
  );
}