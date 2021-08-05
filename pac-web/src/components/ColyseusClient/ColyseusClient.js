import React, { createContext } from 'react';
import { Client } from 'colyseus.js';

export const client = new Client('ws://localhost:8080');

const Context = createContext();
const ColyseusClient = ({ children, ...rest }) => (
  <Context.Provider value={client} {...rest}>
    {children}
  </Context.Provider>
);

/* helper client methods */
client.createNewRoom = async function() {
  const room = await client.create('game-room'); 
  sessionStorage.setItem('roomId', room?.id);
  sessionStorage.setItem('sessionId', room?.sessionId);
  return room;
};

client.joinRoomById = async function(id) {
  let room = null;
  const roomId = sessionStorage.getItem('roomId');
  const sessionId = sessionStorage.getItem('sessionId');

  // attempt a reconnection before trying to rejoin the room
  console.log('Attempting reconnection...');
  try { if (roomId === id) room = await client.reconnect(roomId, sessionId); } 
  catch(err) { console.log('Failed to reconnect. Rejoining room...'); }

  try { if (room == null) room = await client.joinById(id);	}
  catch(err) { console.log(err); }
	
  if (room != null) console.log('Room joined successfully');
  sessionStorage.setItem('roomId', room?.id);
  sessionStorage.setItem('sessionId', room?.sessionId);
  return room;
};

client.clearSession = function() {
  sessionStorage.setItem('sessionId', null);
}

/* helper hook */
export const useColyseus = () => {
  return client;
};

export default ColyseusClient;