import React, { useState, useEffect } from "react";
import { useRoom } from "hooks/use-room";
import { useParams, useHistory } from "react-router-dom";
import GameCanvas from "components/GameCanvas";

const Room = (props) => {
  const { id } = useParams();
  const history = useHistory();
  const [roomState, setRoomState] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [_, joinRoomById] = useRoom();

  useEffect(() => {
    async function init() {
      let room =
        window.room && window.room.id === id
          ? window.room
          : await joinRoomById(id);
      if (typeof room === "undefined") {
        alert("room does not exists");
        history.push("/");
        return history.go();
      }
      room.onStateChange((state) => {
        state?.players?.forEach((value, key) => {
          console.log("key =>", key);
          console.log("value =>", value.ready);
        });
        setRoomState({
          ...roomState,
          ...state,
        });
      });
    }
    init();
  }, [history, id, joinRoomById, roomState]);

  const readyUp = () => {
    window.room.send("PLAYER_READY", { data: "yo" });
  };

  return (
    <div>
      <p>This is the lobby</p>
      <GameCanvas />

      <p>Players in room ({roomState?.players?.size})</p>
      <p>{JSON.stringify(roomState?.players)}</p>

      <button onClick={readyUp}>Ready</button>
    </div>
  );
};

export default Room;
