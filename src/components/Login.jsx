import { useState } from 'react';
import httpService from '../services/httpService';

import './auth.scss';

const Login = ({ history }) => {
  const [user, setUser] = useState({
    email: '',
    password: '',
  });

  const onChangeValue = (e) => {
    const { name, value } = e.target;

    setUser({
      ...user,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data } = await httpService.post('/login', user);
    localStorage.setItem('auth', data);
    window.location.replace('/chat');
  };
  return (
    <form onSubmit={handleSubmit} className='auth'>
      <input
        type='text'
        placeholder='email'
        name='email'
        value={user.email}
        onChange={onChangeValue}
      />
      <input
        type='password'
        placeholder='password'
        name='password'
        value={user.password}
        onChange={onChangeValue}
      />
      <button>Login</button>
    </form>
  );
};

export default Login;
