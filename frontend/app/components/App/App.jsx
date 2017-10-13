import React from 'react';
import { Route, Link } from 'react-router-dom';
import Home from './Home';
import Ping from './Ping';

const App = () => (
  <div>
    <header>
      <Link to="/">Home</Link>
      {' | '}
      <Link to="/ping">Ping API</Link>
    </header>

    <main>
      <Route exact path="/" component={Home} />
      <Route exact path="/ping" component={Ping} />
    </main>
  </div>
);

export default App;
