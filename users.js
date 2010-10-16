function User(users, id, client) {
  var self = this;

  self.send = function send(obj) {
    client.send(JSON.stringify(obj));
  };

  self.send({
    msg: 'init',
    id: id,
    users: users.get()
  });

  client.on('message', function(data) {
    data = JSON.parse(data);

    switch (data.msg) {
      case 'say':
        users.broadcast({
          msg: 'say',
          from: id,
          content: data.content
        });
        break;
      default:
        console.warn("Unknown msg:", data.msg);
        break;
    }
  });
}

function Users() {
  var self = this;
  var users = {};
  var latestID = 0;

  self.onConnection = function(client) {
    var id = ++latestID;

    self.broadcast({
      msg: 'connect',
      id: id
    });

    users[id] = new User(self, id, client);

    client.on('disconnect', function() {
      delete users[id];
      self.broadcast({
        msg: 'disconnect',
        id: id
      });
    });
  };
  
  self.broadcast = function(obj) {
    for (var id in users)
      users[id].send(obj);
  };
  
  self.get = function() {
    var array = [];
    for (var id in users)
      array.push(id);
    return array;
  };
}

exports.build = function build() {
  return new Users();
};
