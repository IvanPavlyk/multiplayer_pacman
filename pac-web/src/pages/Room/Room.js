import React, { useState, useEffect } from 'react';
import { Container, Tooltip } from 'react-bootstrap';
import { useColyseus } from 'components/ColyseusClient';
import { useParams, useHistory } from 'react-router-dom';
import PacmanIcon from 'components/PacmanIcon';
import GameCanvas from 'components/GameCanvas';

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
    let room = null;
    (async () => {
      room = window.room || (await client.joinRoomById(id));
      if (room == null) return history.push('/home');

      window.room = room;
      setRoom(room);

      room.onStateChange((newState) => {
        setRoomState(Object.assign({}, newState));
      });

      room.onMessage('GAME_START', () => {
        setGameInstance(<GameCanvas controller={room} />);
      });

      room.onMessage('ROUND_END', () => {});

      room.onMessage('GAME_END', () => {
        alert('Last Pacman standing has won!');
        setGameInstance(null);
        leaveGame();
        history.push('/home');
      });

      room.send('PLAYER_READY', { ready });
      room.send('SET_PID', { id: sessionStorage.getItem('id'), name: sessionStorage.getItem('userName') });
    })();

    // leave on umount
    return leaveGame;
  }, []);

  function isRoomAdmin(id) {
    id = id || room?.sessionId;
    return roomState?.adminId === id;
  }

  function startGame() {
    room.send('START_GAME');
  }

  function leaveGame() {
    room?.send?.('LEAVE_MATCH');
    window.room = null;
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

  function changePlayerColor() {
    room.send('CHANGE_PLAYER_COLOR');
  }

  // get list of players
  const players = Array.from(roomState?.players?.values?.() || []);
  const length = players.length;
  for (let i = 0; i < 4 - length; i++) {
    players.push(null);
  }

  return (
    <Container className='room'>
      {/* GAME */}
      <div className={`game ${!roomState?.gameStarted && 'hidden'}`}>
        <div className='game__alert'>{roomState?.gameAlertMessage}</div>

        {gameInstance}

        <div className='game__player-list'>
          {roomState?.gameStarted &&
            players.map((player, i) => {
              if (player == null) return;

              return (
                <div
                  className={`player-card player-card--mini ${
                    player.id === room?.sessionId && 'player-card--is-player'
                  }`}
                  style={{ '--select-color': player.tint }}
                  key={`p1-${i}`}
                >
                  <PacmanIcon width='20' color={player.tint} />
                  <p>{player.username}</p>
                </div>
              );
            })}
        </div>
      </div>

      {/* LOBBY */}
      <div className={`lobby ${roomState?.gameStarted && 'hidden'}`}>
        <div className='lobby__header'>
          <div className='room-id-desc'>
            <p>
              Room ID:
              <br />
              <span>{room?.id}</span>
            </p>
          </div>

          <img style={{ width: '75%' }} src={player_select_title} />

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
                  style={{ '--select-color': player.tint }}
                  key={`p-${i}`}
                  onClick={player.id === room?.sessionId ? changePlayerColor : null}
                >
                  <PacmanIcon style={{ margin: '1.4rem 0 0.6rem' }} color={player.tint} />

                  <div style={{ position: 'relative' }}>
                    {chatMessage && <Tooltip placement='top'>{chatMessage}</Tooltip>}
                    <p>{player.username}</p>
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
