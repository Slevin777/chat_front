import jwtDecode from 'jwt-decode';

export const getCurerntUser = () => {
  const token = localStorage.getItem('auth');

  if (!token) return;

  return jwtDecode(token);
};
