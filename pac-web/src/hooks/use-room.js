
export const useRoom = () => {
	const colyseus = window.colyseus;

	const createRoom = async () => {
		try { window.room = await colyseus.create('game-room'); } 
		catch(err) { console.log(err) }
		return window.room
	};
	
	const joinRoomById = async (id) => {
		try { window.room =  await colyseus.joinById(id); }
		catch(err) { console.log(err); }
		return window.room
	}
	
	return [createRoom, joinRoomById];
};

