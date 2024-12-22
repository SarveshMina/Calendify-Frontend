var socket = null;

//Prepare game
var app = new Vue({
    el: '#game',
    data: {
        connected: false,
        messages: [],
        chatmessage: '',
        gameState: 'landing', // Controls the screen state
        userState: null, // Tracks if the user is logged in
        // Login/Register data
        loginUsername: '',
        loginPassword: '',
        registerUsername: '',
        registerPassword: '',
        // Error messages
        loginError: null,
        registerError: null,
    },
    mounted: function () {
        connect();
    },
    methods: {
        handleChat(message) {
            if (this.messages.length + 1 > 10) {
                this.messages.pop();
            }
            this.messages.unshift(message);
        },
        chat() {
            socket.emit('chat', this.chatmessage);
            this.chatmessage = '';
        },
        nextStage() {
            this.gameState = 'content'; 
        },
        handleLogin() {
            if (!this.loginEmail || !this.loginPassword) {
                this.loginError = 'Please fill out all fields.';
                return;
            }
            this.loginError = null;
            this.userState = { username: this.loginUsername }; 
        },
        handleRegister() {
            // Simulate a registration attempt
            if (!this.registerUsername || !this.registerPassword) {
                this.registerError = 'Please fill out all fields.';
                return;
            }
            this.registerError = null;
            this.userState = { registerUsername: this.registerUsername, registerPassword: this.registerPassword }; // Example: Set the user state
        },
    },
});

function connect() {
    //Prepare web socket
    socket = io();

    //Connect
    socket.on('connect', function () {
        app.connected = true;
    });

    socket.on('connect_error', function (message) {
        alert('Unable to connect: ' + message);
    });

    socket.on('disconnect', function () {
        alert('Disconnected');
        app.connected = false;
    });

    socket.on('chat', function (message) {
        app.handleChat(message);
    });
}
