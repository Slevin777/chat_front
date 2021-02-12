import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Header from './components/Header';
import Chat from './components/ChatBody/Chat';
import Login from './components/Login';
import Register from './components/Register';
import ProtectedRoute from './components/ProtectedRoute';
import { getCurerntUser } from './helpers';

function App() {
  const currentUser = getCurerntUser();

  return (
    <div className='App'>
      <Router>
        <Header user={currentUser} />
        <Route path='/login' component={Login} />
        <Route path='/register' component={Register} />
        <ProtectedRoute path='/' component={Chat} currentUser={currentUser} />
      </Router>
    </div>
  );
}

export default App;
