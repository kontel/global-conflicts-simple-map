import { useState, useCallback } from 'react';
import SplashScreen from './components/SplashScreen';
import ConflictMap from './components/ConflictMap';
import './App.css';

function App() {
  const [loaded, setLoaded] = useState(false);

  const handleSplashComplete = useCallback(() => setLoaded(true), []);

  return (
    <div className="app">
      {!loaded ? (
        <SplashScreen onComplete={handleSplashComplete} />
      ) : (
        <ConflictMap />
      )}
    </div>
  );
}

export default App;
