import { Link, NavLink, useHistory } from 'react-router-dom';
// import './Header.css';
import styles from './Header.module.scss';

const Header = ({ user }) => {
  const handleLogout = () => {
    localStorage.removeItem('auth');
    window.location.replace('/login');
  };

  return (
    <header className={styles.header}>
      <div>
        {/* <img src="./img/doge.png" alt="doge logo" className="logo-img" /> */}
        <Link to='/'>
          <h1>
            Simple<span>chat</span>
          </h1>
        </Link>

        <div className={styles.userInfo}>
          {user && <p>{user.name}</p>}

          <div>
            {user && (
              <p className='logout' onClick={handleLogout}>
                LogOut
              </p>
            )}
            {!user && (
              <>
                <NavLink to='/login'>Sign in</NavLink>
                <NavLink to='/register'>Sign up</NavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
