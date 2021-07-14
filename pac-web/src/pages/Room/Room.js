import React, { useState, useEffect } from "react";
import { useRoom } from 'hooks/use-room';
import { useParams, useHistory } from "react-router-dom";
import GameCanvas from "components/GameCanvas";

const Room = (props) => {
  const { id } = useParams();
  const history = useHistory();
  const [roomState, setRoomState] = useState(null);
  const [_, joinRoomById] = useRoom();

  useEffect(async () => {
    let room = window.room || await joinRoomById(id);
    if (room.id !== id) room = await joinRoomById(id);

    if (!room) {
      alert('room does not exists');
      return history.push('/');
    }

    room.onStateChange((state) => {
      setRoomState({
        ...roomState, 
        ...state
      });
    })
  }, []);

  const readyUp = () => {
    window.room.send('PLAYER_READY', { data: 'yo' });
  };

  return (
    <div>
      <p>This is the lobby</p>      
      <GameCanvas/>

      <p>Players in room ({ roomState?.players?.size })</p>
      <p>{ JSON.stringify(roomState?.players) }</p>

      <button onClick={readyUp}>Ready</button>
    </div>
  );
};

export default Room;
