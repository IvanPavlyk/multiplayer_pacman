import React, { useState } from 'react';
import { useColyseus } from 'components/ColyseusClient';
import { useHistory } from 'react-router-dom';
import Button from 'react-bootstrap/Button';

const Room = () => {
  const [id, setValue] = useState('');
  const client = useColyseus();
  const history = useHistory();

  const createAndJoinRoom = async () => {
    const room = window.room = await client.createNewRoom();
    joinRoom(room.id);
  };

  const joinRoom = (id) => {
    console.log(id);
    history.push(`/room/${id}`);
  };

  const redirectLogin = () => {
    history.push('/login');
  };

  return (
    <div>
      <Button className='.btn-yellow' onClick={redirectLogin}>Login</Button>

      <br />
      <Button onClick={createAndJoinRoom}>Create room</Button>
      <br />

      <input
        type='text'
        value={id}
        onChange={(e) => setValue(e.target.value)}
      />
      <Button onClick={() => joinRoom(id)}>Join by id</Button>
    </div>
  );
};

export default Room;
