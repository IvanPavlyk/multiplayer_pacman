import { useState } from 'react';
import { Link } from "react-router-dom";
import { useColyseus } from "components/ColyseusClient";
import { useHistory } from "react-router-dom";

const Room = () => {
  const [id, setValue] = useState('');
  const client = useColyseus();
	const history = useHistory();

  const createAndJoinRoom = async () => {
    const room = window.room = await client.createNewRoom();
    history.push(`/room/${room.id}`);
  }

  return (
    <div>
      <Link to="/login">To Login</Link>

      <br/>
      <button onClick={createAndJoinRoom}>Create room</button>
      <br/>
{/* 
      <input type='text' value={id} onChange={(e) => setValue(e.target.value)}/>

      <button onClick={() => { 
        history.push(`/room/${id}`); 
        }}>Join by id</button> */}
    </div>
  );
};

export default Room;
