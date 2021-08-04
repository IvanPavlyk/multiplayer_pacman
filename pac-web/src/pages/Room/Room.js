import React, { useState, useEffect } from 'react';
import { Container, Card, Badge } from 'react-bootstrap';
import { useColyseus } from 'components/ColyseusClient';
import { useParams, useHistory } from 'react-router-dom';
import GameCanvas from 'components/GameCanvas';

import './room.css';

const Room = () => {
  const { id } = useParams();
  const history = useHistory();
  const client = useColyseus();
  const [ready, setReady] = useState(false);
  const [room, setRoom] = useState(null);
  const [gameInstance, setGameInstance] = useState(null); 
  const [roomState, setRoomState] = useState({});

  useEffect(() => {
    (async () => {
      const room = (window.room) || await client.joinRoomById(id);
      if (room == null) return history.push('/');
      window.room = room;
      setRoom(room);
  
      room.onStateChange((newState) => {
        setRoomState({
          ...roomState,
          ...newState
        });
      });

      room.onMessage('GAME_START', () => {
        setGameInstance(<GameCanvas controller={room}/>);
      });

      room.send('PLAYER_READY', { ready });
    })();
  }, []);

  function isRoomAdmin(id) {
    id = id || room?.sessionId;
    return (roomState?.adminId === id);
  }

  function startGame() {
    room.send('START_GAME');
  }

  function readyUp() {
    setReady(!ready);
    room.send('PLAYER_READY', { ready: !ready });
  }

  return (
    <Container className='room'>
      {/* GAME */}
      {gameInstance}

      {/* LOBBY */}
      <div className='lobby'>
        <p>Players in room ({roomState?.players?.size})</p>
        {/* <p>{JSON.stringify(state?.players)}</p> */}

        <div className='player-list'>
          {Array.from(roomState?.players?.values?.() || []).map((player, i) => (
            <Card className='player-card' key={`player-${i}`}>
              <Card.Body>
                <Card.Title>Player {i+1}</Card.Title>

                {(isRoomAdmin(player.id)) ? 
                  <Badge>HOST</Badge> :
                  <Badge>{(player.ready) ? 'Ready!' : 'Not Ready'}</Badge>}
              </Card.Body>
            </Card>
          ))}
        </div>

        <div className='lobby__buttons'>
          {(isRoomAdmin()) ?
            <button onClick={startGame} disabled={!roomState?.gameCanStart}>Start Game</button> :
            <button onClick={readyUp}>{(!ready) ? 'Ready' : 'Cancel'}</button>}
        </div>
      </div>
    </Container>
  );
};

export default Room;
