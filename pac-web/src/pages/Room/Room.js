import React, { useState, useEffect } from 'react';
import { useColyseus } from 'components/ColyseusClient';
import { useParams, useHistory } from 'react-router-dom';
import GameCanvas from 'components/GameCanvas';

const Room = () => {
  const { id } = useParams();
  const history = useHistory();
  const client = useColyseus();
  const [room, setRoom] = useState(null);
  const [state, setState] = useState({});

  useEffect(() => {
    (async () => {
      const room = (window.room) || await client.joinRoomById(id);
      if (room == null) return history.push('/');
      window.room = room;
      setRoom(room);
  
      room.onStateChange((newState) => {
        setState({
          ...state,
          ...newState
        });
      });
  
      room.send('PLAYER_READY', { ready: false });
    })();
  }, []);

  function ready() {
    room.send('PLAYER_READY');
  }

  return (
    <div>
      { (room != null) && <GameCanvas controller={room}/> }

      <p>Players in room ({ state?.players?.size })</p>
      <p>{ JSON.stringify(state?.players) }</p>

      <button onClick={ready}>Ready</button>
    </div>
  );
};

export default Room;