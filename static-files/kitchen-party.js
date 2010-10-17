;KitchenParty = (function() {
  var KitchenParty = {
    createInstrument: function(cb, partyWindow) {
      partyWindow = partyWindow || window.parent;

      if (!partyWindow || partyWindow == window) {
        cb(true, null);
        return;
      }

      function makeChannel() {
        var channel = window.Channel.build({
          window: partyWindow,
          // TODO: Use the current origin of partyWindow?
          origin: '*',
          scope: 'kitchen-party-instrument'
        });

        cb(false, new InstrumentChannel(channel));
      }

      if (window.Channel)
        makeChannel();
      else
        loadScriptInMyDir('jschannel.js', makeChannel);
    }
  };

  function reportError(msg, e) {
    if (window.console && window.console.error) {
      window.console.error(msg);
      if (e.stack)
        window.console.error(e.stack);
      else
        window.console.error(e);
    }
  }
  
  function InstrumentChannel(channel) {
    var self = this;
    var listeners = {
      'message': [],
      'setState': []
    };

    function validateEvent(event) {
      if (!(event in listeners))
        throw new Error('invalid event: ' + event);
    }

    function emit(event, arg) {
      validateEvent(event);
      listeners[event].forEach(function(cb) {
        try {
          cb.call(self, arg);
        } catch (e) {
          reportError("uncaught exception for event '" + event + "':", e);
        }
      });
    }

    channel.bind('instrument:message', function(trans, content) {
      emit('message', content);
    });

    channel.bind('instrument:setState', function(trans, state) {
      emit('setState', state);
    });

    self.on = function on(event, cb) {
      validateEvent(event);
      if (typeof(cb) != 'function')
        throw new Error('expected function, not ' + typeof(cb));
      listeners[event].push(cb);
    };

    self.send = function send(content) {
      channel.notify({
        method: 'instrument:message',
        params: content
      });
    };

    self.setState = function setState(state, broadcast) {
      channel.notify({
        method: 'instrument:setState',
        params: {state: state, broadcast: broadcast}
      });
    };

    self.setSize = function setSize(width, height) {
      channel.notify({
        method: 'instrument:setSize',
        params: {width: width, height: height}
      });
    };
  }

  function loadScriptInMyDir(filename, cb) {
    var ME = /kitchen-party.js$/;
    
    var scripts = document.querySelectorAll("script");
    
    for (var i = 0; i < scripts.length; i++) {
      var script = scripts[i];
      if (script.src.match(ME)) {
        var newScript = document.createElement('script');
        newScript.setAttribute('src', script.src.replace(ME, filename));
        newScript.addEventListener('load', cb, false);
        document.documentElement.appendChild(newScript);
        return;
      }
    }
    throw new Error("Couldn't find myself!");
  }

  return KitchenParty;
})();
