function User(users, id, client) {
  var self = this;

  self.send = function send(obj) {
    client.send(JSON.stringify(obj));
  };

  self.send({
    msg: 'init',
    id: id,
    users: users.get(),
    instruments: users.instruments.get()
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
      case 'instrument:message':
        users.broadcast({
          msg: 'instrument:message',
          from: id,
          id: data.id,
          content: data.content
        });
        break;
      case 'instrument:setState':
        users.instruments.setState(data.id, data.state);
        if (data.broadcast)
          users.broadcast({
            msg: 'instrument:setState',
            from: id,
            id: data.id,
            state: data.state
          });
        break;
      case 'instrument:add':
        var instrument = users.instruments.add(data.url, data.state);
        users.broadcast({
          msg: 'instrument:add',
          from: id,
          id: instrument.id,
          url: instrument.url,
          state: instrument.state
        });
        break;
      case 'instrument:remove':
        users.instruments.remove(data.id);
        users.broadcast({
          msg: 'instrument:remove',
          from: id,
          id: data.id
        });
        break;
      default:
        console.warn("Unknown msg:", data.msg);
        break;
    }
  });
}

function Instruments() {
  var self = this;
  var instruments = {};
  var latestID = 0;

  self.get = function() {
    var array = [];
    for (var id in instruments)
      array.push(instruments[id]);
    return array;
  };

  self.setState = function(id, state) {
    instruments[id].state = state;
  };

  self.add = function(url, state) {
    var id = ++latestID;
    instruments[id] = {
      id: id,
      url: url,
      state: state
    };
    return instruments[id];
  };

  self.remove = function(id) {
    delete instruments[id];
  };
}

function Users() {
  var self = this;
  var users = {};
  var latestID = 0;

  self.instruments = new Instruments();
  
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
