import { useState } from 'react';
import { Link } from "react-router-dom";
import { useRoom } from "hooks/use-room";
import { useHistory } from "react-router-dom";

const Room = () => {
  const [id, setValue] = useState('');
  const [createRoom] = useRoom();
	const history = useHistory();

  return (
    <div>
      <Link to="/login">To Login</Link>

      <br/>
      <button onClick={async () => { 
        const room = await createRoom();
        history.push(`/room/${room.id}`);
      }}>Create room</button>
      <br/>

      <input type='text' value={id} onChange={(e) => setValue(e.target.value)}/>

      <button onClick={() => { 
        history.push(`/room/${id}`); 
        }}>Join by id</button>
    </div>
  );
};

export default Room;
