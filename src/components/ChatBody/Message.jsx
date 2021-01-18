const normalizeTime = (date) => {
  const init = new Date(date);
  return (date =
    (init.getHours() < 10 ? '0' : '') +
    init.getHours() +
    ':' +
    (init.getMinutes() < 10 ? '0' : '') +
    init.getMinutes());
};

const Message = ({ message, currentUser }) => {
  return (
    <div className={`message${currentUser.id === message.userId ? ' my' : ''}`}>
      <p>{message.message}</p>
      <p className='time'>{normalizeTime(message.createdAt)}</p>
    </div>
  );
};

export default Message;
