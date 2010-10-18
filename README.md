In eastern Canada, a kitchen party is a social gathering in someone's kitchen. Some people bring instruments and play them, while others cheer them on.

In this vein, Kitchen Party is a proof-of-concept Web-based chat room in which participants can bring *instruments* for anyone to play. An instrument is an embedded web page that communicates with the chat room via the [postMessage][] API. This API allows serverless client page to provide real-time, collaborative social functionality without needing to deal with identity or network communications.

  [postMessage]: https://developer.mozilla.org/en/DOM/window.postMessage

## Motivation ##

I originally conceived of the Kitchen Party idea when participating in [my first CrisisCamp][] in August 2010. A number of activities were nontrivial for participants to perform on their own&mdash;for instance, finding an obscure town in Pakistan. These could have benefitted from being more social, but creating a full server-based Web application would be nontrivial, and getting all the participants to visit a particular app would be too.

Instead, I thought it would be interesting to be able to simply drop a widget into very the chat room that participants were already in. This would reduce the amount of cat-herding needed to get participants to use the application, and the chat room could provide widgets with an API that would reduce development costs and enable rapid iteration.

Furthermore, by not requiring any server-side coding, it becomes possible for casual Web developers to easily make simple real-time, collaborative applications using tools like [HTMLPad][].

  [my first CrisisCamp]: http://www.toolness.com/wp/?p=955
  [HTMLPad]: http://www.toolness.com/wp/?p=1107

## Server Dependencies ##

The chat room and its associated server have the following dependencies:

  * [node.js](http://nodejs.org/)
  * [socket.io](http://socket.io/)
  * [jschannel](http://github.com/mozilla/jschannel)
  * [jQuery](http://jquery.com/)

## Instruments ##

Instruments only need to include one file, [kitchen-party.js][], which automatically pulls in `jschannel` and uses it to communicate with the parent chat room. See [example-instrument.html][] for sample code.

  [kitchen-party.js]: http://github.com/toolness/kitchen-party/blob/master/static-files/kitchen-party.js
  [example-instrument.html]: http://github.com/toolness/kitchen-party/blob/master/static-files/example-instrument.html
