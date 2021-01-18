import './Chat.css';
import SideMenu from './SideMenu';
import { useEffect, useState } from 'react';
import Room from './Room';
// import httpService from '../../services/httpService';
import socket from '../../services/webSockets';
// import { useHistory } from 'react-router-dom';

const Chat = ({ currentUser }) => {
  // const history = useHistory();

  const [users, setUsers] = useState([]);
  const [activeUser, setActiveUser] = useState('');
  const [room, setRoom] = useState(null);

  useEffect(() => {
    socket.on('all_users', (users) => {
      const filtered = users.filter((user) => user.id !== currentUser.id);
      setUsers(filtered);
    });

    socket.on('room_joined', (room) => {
      setRoom(room);
    });
  }, []);

  const handleSelectUser = (user) => {
    setActiveUser(user);
    socket.emit('join_room', { from: currentUser.id, to: user.id });
    // history.push(`/chatTo?${user.name}`);
  };

  return (
    <div className='content-container'>
      <SideMenu
        users={users}
        onSelectUser={handleSelectUser}
        activeUser={activeUser}
      />
      <div className='video-chat-container'>
        {!room ? (
          <h2 className='talk-info' id='talking-with-info'>
            Select active user on the left menu.
          </h2>
        ) : (
          <Room room={room} currentUser={currentUser} />
        )}
        <div className='video-container'>
          {/* <video autoplay class='remote-video' id='remote-video'></video> */}
          {/* <video autoplay muted class='local-video' id='local-video'></video> */}
        </div>
      </div>
    </div>
  );
};

export default Chat;
