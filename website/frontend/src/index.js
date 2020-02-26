import React from 'react';
import ReactDOM from 'react-dom';
import io from 'socket.io-client';
import './index.css';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            connectedUsers: new Map(),
            endpoint: 'http://localhost:5000'
        }
    }
    setSocketListeners() {
        const { endpoint } = this.state;
        const socket = io(endpoint);
        socket.on('user_connected', (user) => {
            this.state.connectedUsers.set(user.id, user.audio_conf);
        });
        
        socket.on('user_disconnected', (user) => {
            this.state.connectedUsers.delete(user.id);
        });
        
    }
    componentDidMount() {
        this.setSocketListeners();
    }
}

// ========================================

ReactDOM.render(
    <body>Test</body>,
    document.getElementById('root')
);
