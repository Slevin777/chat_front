import socketIOClient from 'socket.io-client';

export default socketIOClient(process.env.REACT_APP_API_URL, { secure: true, reconnect: true, rejectUnauthorized: false });
