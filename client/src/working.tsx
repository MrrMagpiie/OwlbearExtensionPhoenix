import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import OBR from '@owlbear-rodeo/sdk'

function App() {
  const [count, setCount,] = useState(0)
  const [game, setGame] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(
    () => 
    // When the Owlbear room is ready
    OBR.onReady(() => {
    // Initiate Phoenix Game
    const initGame = async () => {
      // get room metadata
      const fetchRoomMetadata = async () => {
        try {
          const metadata = await OBR.room.getMetadata();
          //if there is no gameid in the room metadata then create a new game and add the id to room metadata
          if (!metadata?.phoenixId) {
            const createRes = await fetch('/api/games', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({}),
            });
            if (createRes.ok) {
              const newGame = await createRes.json();
              OBR.room.setMetadata(phoenixId)
              setGame(newGame);
            } else {
              console.error("Failed to create game");
            }
          }
        
        } catch (err) {
        setError("Failed to fetch room metadata.");
        console.error(err);
      }
    };

    fetchRoomMetadata();
      try {
        // 1. Check if a game exists for this room ID
        const res = await fetch(`/api/games/${roomId}`);
        if (res.ok) {
          const existingGame = await res.json();
          setGame(existingGame);
        } else if (res.status === 404) {
          // 2. Create game if not found
  }
      } catch (err) {
        console.error("Error initializing game:", err);
      }
    };

    initGame();
  }), []);

        } else {
          console.error("Unexpected response", res.status);
      
  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <pre>{metadata ? JSON.stringify(metadata, null, 2) : "Loading..."}</pre>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
