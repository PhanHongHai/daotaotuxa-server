import socketioJwt from 'socketio-jwt';

import { client } from './interface';
import { pushIDtoArray, removeIDfromArray, checkClientExist } from './helper';

let jwtSecret: any = process.env.SECRET_SIGN_TOKEN;

let initSockets = (io: any) => {
	let clients: client[] = [];
	io.on(
		'connection',
		socketioJwt.authorize({
			secret: jwtSecret,
			timeout: 15000, // 15 seconds to send the authentication message
		}),
	).on('authenticated', (socket: any) => {
		//this socket is authenticated, we are good to handle more events from it.
		let checkClient = checkClientExist(clients, socket.decoded_token.userID);
		if (checkClient) socket.emit('client-was-active', true);
		clients = pushIDtoArray(clients, socket.id, socket.decoded_token.userID);
		console.log(clients);
		socket.on('send-class-id', (classID: string) => {
			socket.join(classID, () => {
				let rooms = Object.keys(socket.rooms);
				console.log(rooms);
			});
		});
		socket.on('disconnect', () => {
			clients = removeIDfromArray(clients, socket.id, socket.decoded_token.userID);
			console.log(clients);
		});
	});
};

export default initSockets;
