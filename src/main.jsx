import React from 'react';
import ReactDOM from 'react-dom/client';
import WesternSteelSopQuiz from './WesternSteelSopQuiz.jsx';
import ScoreboardPage from './ScoreboardPage.jsx';
import './index.css';

function App() {
  const path = window.location.pathname.replace(/\/+$/, '');
  if (path === '/scoreboard') {
    return <ScoreboardPage />;
  }
  return <WesternSteelSopQuiz />;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
