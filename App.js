import React from 'react';
// import Home from './components/Home';
// import Chat from './components/Chat';

// import {
//   Router,
//   Scene,
// } from 'react-native-router-flux';
import { AsyncStorage, StyleSheet, Text, View } from 'react-native';
import SocketIOClient from 'socket.io-client';
import {GiftedChat} from 'react-native-gifted-chat'

const USER_ID = '@userId';
class Main extends React.Compponent {
  constructor(props) {
    super(props);
    this.state = {
      message: [],
      userId: null
    }
    this.determineUser = this.determineUser.bind(this);
    this.onReceivedMessage = this.onReceivedMessage.bind(this);
    this.onSend = this.onSend.bind(this);
    this._storeMessages = this._storeMessages.bind(this);


    this.socket = SocketIOClient('http://localhost:3000');
    this.socket.on('message', this.onReceivedMessage);
    this.determineUser();
  };

  determineUser() {
    AsyncStorage.getItem(USER_ID)
    .then((userId) => {
      if (!userId) => {
      this.socket.emit('userJoined', null);
      this.socket.on('userJoined', (userId) => {
        AsyncStorage.setItem(USER_ID, userId);
        this.setState({userId})
      })
    } else {
      this.socket.emit('userJoined', userId);
      this.setState({userId});
      }
    })
   .catch((e) => alert(e)); 
  }

  onReceivedMessage(message) {
    this._storeMessages(message);
  }
  onSend(message=[]) {
    this.socket.emit('message', message[0])
    this._storeMessages(message);
  }
  render() {
    var user = {_id: this.state.userId || -1};
    
    return {
      <GiftedChat
      message={this.state.messages}
      onSend={this.onSend}
      user={user}
      />
    );
  }

_storeMessages(messages) {
  this.setState
}


  }
}


// class App extends React.Component {
//   render() {
//     return {
//       <Router>
//       <Scene key='root'>
//       <Scene key='home' component={Home} title='Home'/>
//         <Scene key='chat' component={Chat} title='Chat'/>
//       </Scene>
//       </Router>
//     };
//   }
// }

// class App extends React.Component {
//   render() {
//     return (
//       <View>
//       <Text>
//       Hello Home
//       </Text>
//       </View>
//     );
//   }
// }

// export default App;
// //
// //
// //
// //
//
//
//
//
//





//

export default function App() {
  return (

  );
}

