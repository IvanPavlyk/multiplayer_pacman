import React, { useState, useEffect } from "react";
import { useColyseus } from 'components/ColyseusClient';
import { useParams, useHistory } from "react-router-dom";
import GameCanvas from "components/GameCanvas";

const Room = (props) => {
  const { id } = useParams();
  const history = useHistory();
  const client = useColyseus();
  const [room, setRoom] = useState();
  const [state, setState] = useState({});

  useEffect(async () => {
    const room = (window.room) || await client.joinRoomById(id);
    if (room == null) return history.push('/');
    setRoom(room);

    room.onStateChange((newState) => {
      console.log(newState)
      setState({
        ...state,
        ...newState
      })
    });

    room.send('PLAYER_READY', { ready: false });
  }, []);

  function ready() {
    room.send('PLAYER_READY');
  }

  return (
    <div>
      <p>This is the lobby</p>      
      <GameCanvas/>

      <p>Players in room ({ state?.players?.size })</p>
      <p>{ JSON.stringify(state?.players) }</p>

      <button onClick={ready}>Ready</button>
    </div>
  );
};

export default Room;