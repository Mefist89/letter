import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import NightLetterApp from './App';
import LoadingPage from './LoadingPage';

// Simple hash-based routing
const App = () => {
  const [route, setRoute] = React.useState(window.location.hash.substring(1) || '/');
  
  React.useEffect(() => {
    const handleHashChange = () => {
      setRoute(window.location.hash.substring(1) || '/');
    };
    
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);
  
  if (route === '/app') {
    return <NightLetterApp />;
  } else {
    return <LoadingPage />;
  }
};

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
