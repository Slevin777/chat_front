import './SideMenu.scss';

const SideMenu = ({ activeUser, onSelectUser, users }) => {
  return (
    <div className='active-users-panel' id='active-user-container'>
      <h3 className='panel-title'>Users:</h3>
      <ul>
        {users.map((user) => (
          <li
            key={user.id}
            onClick={() => onSelectUser(user)}
            className={`${activeUser.id === user.id ? 'active' : ''}`}
          >
            {user.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SideMenu;
