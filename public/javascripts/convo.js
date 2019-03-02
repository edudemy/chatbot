var botui = new BotUI('api-bot');

var socket = io.connect('http://localhost:8010');
// read the BotUI docs : https://docs.botui.org/
botui.message.bot({ // show first message
  delay: 200,
  content: 'Hello I am Luca. I can help you with all queries regarding cryptocurrency and blockchain.',
	loading: true, // fake typing

}).then( () => {
	 botui.message
    .bot({
      delay: 300,
		  loading: true,
      content: 'May I know your name ?'
    })
}).then(function () {
      return botui.action.text({
        delay: 400,
        action: {
          size: 18,
          icon: 'user-circle-o',
          sub_type: 'text',
          placeholder: 'John ?'
        }
      })
    }).then((res) => {
      name = res.value; // save new value
      return botui.message
        .bot({
          delay: 300,
          loading: true,
          content: 'Nice to meet you ' + name 
        });
    }).then( () =>{
  return botui.message.bot({
    delay: 500, 
	loading: true,
    content: 'What can I help you with ?',
  })
}).then( () =>{
  return botui.action.button({ // let user choose something
    delay: 300,
    action: [
      {
        text: 'Buy Cryptocurrency',
        value: 'Buy Cryptocurrency',
      },
      {
        text: 'Trade Cryptocurrency',
        value: 'Trade Cryptocurrency'
      },
			 {
        text: 'Know more about Cryptocurrency',
        value: 'Know more about Cryptocurrency'
      }
    ]
  })
}).then( (res) => {
  return botui.message.bot({
    delay: 400,
  loading: true, // pretend like we are doing something
  type : 'html',
    content: 'To know about ' + res.text.toLowerCase() + ' Check our product <button><a href="https://trade.globalxchange.com">GX Trade</a></button>!'
  })
}).then( ()=>{
  return botui.message.add({
    content: 'What else can I help you with',
  delay: 1500,
  loading : true,
  })
}).then(function () {
  botui.action.text({
    action: {
      placeholder: 'Type here', }
  }
).then(function (res) {
  socket.emit('fromClient', { client : res.value }); // sends the message typed to server
    console.log(res.value); // will print whatever was typed in the field.
  }).then(function () {
    socket.on('fromServer', function (data) { // recieveing a reply from server.
      console.log(data.server);
      newMessage(data.server);
      addAction();
  })
});
})

function newMessage (response) {
  botui.message.add({
    content: response,
    delay: 0,
  })
}

function addAction () {
  botui.action.text({
    action: {
      placeholder: 'Type here....', 
    }
  }).then(function (res) {
    socket.emit('fromClient', { client : res.value });
    console.log('client response: ', res.value);
  })
}

