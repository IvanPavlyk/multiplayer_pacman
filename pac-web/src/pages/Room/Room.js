import React, { useState, useEffect } from 'react';
import { Container, Tooltip } from 'react-bootstrap';
import { useColyseus } from 'components/ColyseusClient';
import { useParams, useHistory } from 'react-router-dom';
import GameCanvas from 'components/GameCanvas';

import player_pacman from 'assets/images/player-pacman.png';
import player_select_title from 'assets/images/player-select-title.png';
import icon_crown from 'assets/images/icon-crown.png';

import './room.scss';

const Room = () => {
  const { id } = useParams();
  const history = useHistory();
  const client = useColyseus();
  const [ready, setReady] = useState(false);
  const [room, setRoom] = useState(null);
  const [gameInstance, setGameInstance] = useState(null);
  const [roomState, setRoomState] = useState({});

  const [chatMessage, setChatMessage] = useState('');

  useEffect(() => {
    (async () => {
      const room = window.room || (await client.joinRoomById(id));
      if (room == null) return history.push('/');
      window.room = room;
      setRoom(room);

      room.onStateChange((newState) => {
        setRoomState(Object.assign({}, newState));
      });

      room.onMessage('GAME_START', () => {
        setGameInstance(<GameCanvas controller={room} />);
      });

      room.send('PLAYER_READY', { ready });
    })();
  }, []);

  function isRoomAdmin(id) {
    id = id || room?.sessionId;
    return roomState?.adminId === id;
  }

  function startGame() {
    room.send('START_GAME');
  }

  function readyUp() {
    setReady(!ready);
    room.send('PLAYER_READY', {
      ready: !ready,
    });
  }

  function sendChatMessage(message) {
    message = message.trim();
    if (!message) return;
    room.send('SEND_CHAT_MESSAGE', {
      message: message,
    });
    setChatMessage('');
  }
  function changeColor() {
    room.send('CHANGE_COLOR');
  }

  // get list of players
  const players = Array.from(roomState?.players?.values?.() || []);
  const length = players.length;
  for (let i = 0; i < 4 - length; i++) {
    players.push(null);
  }

  const tint = {
    16776960: 'pacman-yellow',
    0xff0000: 'pacman-red',
    0x00ff00: 'pacman-green',
    0x0000ff: 'pacman-blue',
  };
  console.log(players);

  return (
    <Container className='room'>
      {/* GAME */}
      <div className={`game ${(!roomState?.gameStarted) && 'hidden'}`}>
        <div className='game__alert'>
          {roomState?.gameAlertMessage}
        </div>

        {gameInstance}

        <div className='game__player-list'>
          <div className='player-card player-card--mini'>
            <img width='20' src={player_pacman} />
            <p>UberHaxor69</p>
          </div>
          <div className='player-card player-card--mini'>
            <img width='20' src={player_pacman} />
            <p>UberHaxor69</p>
          </div>
          <div className='player-card player-card--mini'>
            <img width='20' src={player_pacman} />
            <p>UberHaxor69</p>
          </div>
          <div className='player-card player-card--mini'>
            <img width='20' src={player_pacman} />
            <p>UberHaxor69</p>
          </div>
        </div>
      </div>

      {/* LOBBY */}
      <div className={`lobby ${(roomState?.gameStarted) && 'hidden'}`}>
        <div className='lobby__header'>
          <div className='room-id-desc'>
            <p>
              Room ID:
              <br />
              {room?.id}
            </p>
          </div>

          <img style={{ width: '70%' }} src={player_select_title} />

          <div className='invite-url-desc'>
            <p>Invite URL</p>
            <input type='text' value={window.location} onClick={(e) => e.target.select()} />
          </div>
        </div>

        <div className='lobby__player-list'>
          {players.map((player, i) => {
            if (player == null) {
              return (
                <div className='player-card player-card--inactive' key={`p-${i}`}>
                  <p>Open Slot</p>
                  <p className='player-card__subtitle'>Invite Players!</p>
                </div>
              );
            } else {
              const chatMessage = roomState?.chatMessages?.get?.(player.id);

              return (
                <div
                  className={`player-card ${player.id === room?.sessionId && 'player-card--is-player'}`}
                  key={`p-${i}`}
                  onClick={player.id === room?.sessionId ? changeColor : null}
                >
                  <img style={{ margin: '1.4rem 0 0.6rem' }} src={player_pacman} className={tint[player.tint]} />

                  <div style={{ position: 'relative' }}>
                    {chatMessage && <Tooltip placement='top'>{chatMessage}</Tooltip>}
                    <p>UberHaxor69</p>
                  </div>

                  <p>
                    {isRoomAdmin(player.id) ? (
                      <span>
                        <img style={{ margin: '0 0.3rem 2.5px 0' }} src={icon_crown} />
                        Host
                      </span>
                    ) : (
                      <span>{player.ready ? 'ready!' : 'not ready'}</span>
                    )}
                  </p>
                </div>
              );
            }
          })}
        </div>

        <div className='lobby__buttons'>
          {isRoomAdmin() ? (
            <button className='ready-button' onClick={startGame} disabled={!roomState?.gameCanStart}>
              Start&thinsp;&thinsp;Game
            </button>
          ) : (
            <button className='ready-button' onClick={readyUp}>
              {!ready ? 'Ready' : 'Cancel'}
            </button>
          )}

          <div className='chat-box'>
            <input
              type='text'
              value={chatMessage}
              placeholder='Send a message to other players...'
              onChange={(e) => setChatMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key !== 'Enter') return;
                sendChatMessage(chatMessage);
              }}
              maxLength='40'
            />

            <button onClick={() => sendChatMessage(chatMessage)}>Send</button>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Room;
