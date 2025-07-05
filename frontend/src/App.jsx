import { useState, useEffect, useRef } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import Page1 from './page1';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Page1 />
    </>
  );
}

export default App;
