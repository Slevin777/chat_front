import { useState, useRef, useEffect } from 'react';
import { ReactComponent as CameraIcon } from '../../icons/video-camera.svg';
import socket from '../../services/webSockets';
import Message from './Message';
import './Room.scss';

const { RTCPeerConnection, RTCSessionDescription } = window;
const peerConnection = new RTCPeerConnection({
  iceServers: [
    {
      urls: ['stun:stun.l.google.com:19302'],
    },
  ],
});
const peerConnectionAnsw = new RTCPeerConnection({
  iceServers: [
    {
      urls: ['stun:stun.l.google.com:19302'],
    },
  ],
});

const getMedia = async (mediaConstraints) => {
  try {
    return await navigator.mediaDevices.getUserMedia(mediaConstraints);
  } catch (error) {
    console.warn(error.message);
  }
};

const Room = ({ room, currentUser, activeUser }) => {
  const [value, setValue] = useState('');
  const [messages, setMessages] = useState([]);

  const videoRef = useRef();
  const remoteVideoRef = useRef();

  const inputRef = useRef();
  const messagesRef = useRef();

  const handleChangeInput = (e) => {
    setValue(e.target.value);
  };

  /*   useEffect(() => {
  }, [peerConnectionAnsw]); */
  peerConnectionAnsw.ontrack = (e) => {
    remoteVideoRef.current.srcObject = e.streams[0];
  };

  peerConnection.ontrack = (e) => {
    remoteVideoRef.current.srcObject = e.streams[0];
  };

  const handleVideoCall = async () => {
    try {
      const stream = await getMedia({
        audio: true,
        video: true,
      });
      videoRef.current.srcObject = stream;
      stream
        .getTracks()
        .forEach((track) => peerConnection.addTrack(track, stream));

      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);

      socket.emit('call-user', {
        offer: peerConnection.localDescription,
        to: room.id,
      });
      console.log('make a call');
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    setMessages(room.messages);

    socket.on('got_message', (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    });

    socket.on('call-made', async (data) => {
      await peerConnectionAnsw.setRemoteDescription(
        new RTCSessionDescription(data.offer)
      );

      const stream = await getMedia({
        audio: true,
        video: true,
      });

      videoRef.current.srcObject = stream;
      stream
        .getTracks()
        .forEach((track) => peerConnectionAnsw.addTrack(track, stream));

      peerConnectionAnsw.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit('ice-candidate', {
            to: room.id,
            candidate: event.candidate,
          });
          // console.log('candidate', event.candidate);
        }
      };

      const answer = await peerConnectionAnsw.createAnswer();
      await peerConnectionAnsw.setLocalDescription(answer);

      socket.emit('make-answer', {
        answer: peerConnectionAnsw.localDescription,
        to: room.id,
      });
      console.log('call made');
      console.log('make answer');
    });

    socket.on('answer-made', async (data) => {
      await peerConnection.setRemoteDescription(
        new RTCSessionDescription(data.answer)
      );
      console.log('answer made');
    });

    socket.on('ice-candidate', (candidate) => {
      peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    });

    inputRef.current.focus();

    return () => {
      socket.off('got_message');
    };
  }, [room]);

  useEffect(() => {
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
        <CameraIcon onClick={handleVideoCall} />
      </div>
      <div className='messages' ref={messagesRef}>
        {messages.map((message, i) => {
          return (
            <Message key={i} message={message} currentUser={currentUser} />
          );
        })}
      </div>

      <video className='local-video' ref={videoRef} autoPlay></video>
      <video className='remote-video' ref={remoteVideoRef} autoPlay></video>

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
