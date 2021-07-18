import React, { useState, useEffect } from "react";
import { useColyseus } from "components/ColyseusClient";
import { useParams, useHistory } from "react-router-dom";
import GameCanvas from "components/GameCanvas";

const Room = (props) => {
  const { id } = useParams();
  const history = useHistory();
  const client = useColyseus();
  const [room, setRoom] = useState(null);
  const [state, setState] = useState({});

  useEffect(() => {
    async function init() {
      let room =
        window.room && window.room.id === id
          ? window.room
          : await client.joinRoomById(id);
      if (typeof room === "undefined") {
        alert("room does not exists");
        history.push("/");
        return history.go();
      }
      window.room = room;
      setRoom(room);

      room.onStateChange((newState) => {
        state?.players?.forEach((value, key) => {
          console.log("key =>", key);
          console.log("value =>", value.ready);
        });
        setState({
          ...state,
          ...newState,
        });
      });

      room.send("PLAYER_READY", { ready: false });
    }
    init();
  }, [client, history, id, state]);

  function ready() {
    room.send("PLAYER_READY");
  }

  return (
    <div>
      {room != null && <GameCanvas controller={room} />}

      <p>Players in room ({state?.players?.size})</p>
      <p>{JSON.stringify(state?.players)}</p>

      <button onClick={ready}>Ready</button>
    </div>
  );
};

export default Room;
