import { useState, useRef, useEffect } from 'react';
import socket from '../../services/webSockets';
import Message from './Message';
import './Room.scss';

const Room = ({ room, currentUser, activeUser }) => {
  const [value, setValue] = useState('');
  const [messages, setMessages] = useState([]);

  const inputRef = useRef();
  const messagesRef = useRef();

  const handleChangeInput = (e) => {
    setValue(e.target.value);
  };

  useEffect(() => {
    setMessages(room.messages);

    socket.on('got_message', (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    });

    inputRef.current.focus();

    return () => {
      socket.off('got_message');
    };
  }, [room]);

  useEffect(() => {
    console.log(messagesRef.current.scrollHeight);
    console.log(messagesRef.current.clientHeight);
    messagesRef.current.scrollTop =
      messagesRef.current.scrollHeight - messagesRef.current.clientHeight;
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value) return;

    socket.emit('new_message', {
      roomId: room.id,
      userId: currentUser.id,
      message: {
        message: value,
      },
    });

    // setMessages([...messages, value]);
    setValue('');
    inputRef.current.focus();
  };

  return (
    <div className='room'>
      <div className='heading'>
        <div className='userTo'>
          <div className='logo'></div>
          <div className='name'>{activeUser.name}</div>
        </div>
        <p className='call'>call icon</p>
      </div>
      <div className='messages' ref={messagesRef}>
        {messages.map((message, i) => {
          return (
            <Message key={i} message={message} currentUser={currentUser} />
          );
        })}
      </div>
      <div className='inputBar'>
        <form onSubmit={handleSubmit}>
          <input
            value={value}
            onChange={handleChangeInput}
            ref={inputRef}
            placeholder='Write a message...'
          />
          <button>sumbit</button>
        </form>
      </div>
    </div>
  );
};

export default Room;
