var users2 = require('./../server/controllers/users.js');
module.exports = function Routes (app, io) {
	app.get('/', function (req,res) { users2.index(req,res) });
	app.get('/classic', function (req,res) { users2.pacman1(req,res) });
	app.get('/survivor', function (req,res) { users2.pacman2(req,res) });

	// app.get('/users', function (req,res) { users.index(req,res) });
	// app.get('/users/index.json', function (req,res) { users.index_json(req,res) });
	// app.get('/users/new', function (req,res) { users.new(req,res) });
	// app.post('/users', function (req,res) { users.create(req,res) });
	// app.get('/users/:id', function (req,res) { users.show(req,res) });
	// app.get('/users/:id/edit', function (req,res) { users.edit(req,res) });
	// app.post('/users/newUser_json', function (req,res) { users.newUser_json(req,res) });
	
	var users = {};

	io.on('connection', function (socket) {
		socket.on('login', function (data) {
			var info = { x: 30, y: 60, pos: 39, id: socket.id, collision: false, power: false, score: 0 };
			var user = { name: data.name, info: info };
			socket.emit('current_user', user );
			socket.emit('all_users', { users: users });
			socket.broadcast.emit('new_user', { user: user, users: users });
			users[socket.id] = user;
		})

		socket.on('key_press', function (data) {
			users[data.info.id].info = data.info;
			socket.broadcast.emit('new_movement', { info: data.info });
		})

		socket.on('eat_coin', function (data) {
			for (var i in coins) {
				if (coins[i].id == data.coin_id) {
					coins.splice(i, 1);
				}
			}
			socket.broadcast.emit('update_coin', { coin_id: data.coin_id });
			io.emit('update_all_coins', { coins: coins });
		})

		socket.on('update_score', function (data) {
			users[data.id].score = data.score;
			socket.broadcast.emit('broadcast_score', { id: data.id, score: data.score });
		})

		socket.on('winner', function (data) {
			socket.broadcast.emit('game_over', { name: data.name });
		})

		socket.on('disconnect', function (req) {
			delete users[socket.id];
			socket.broadcast.emit('remove_user', { id: socket.id });
		})
	});	

};