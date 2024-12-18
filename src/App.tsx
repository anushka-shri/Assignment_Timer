import React from 'react';
import { TimerProvider } from './context/TimerContext';
import Home from './Home';

function App() {
  return (
    <TimerProvider>
      <Home />
    </TimerProvider>
  );
}

export default App;
