import ChatMessage from './modules/ChatMessage.js';

const socket = io();

function setUserId({sID, message}) {
    //debugger;
    console.log('connected', sID, message);
    vm.socketID = sID;
}

function appendMessage(message) {
    vm.messages.push(message);
}

function appendConnect(obj){
    console.log(obj);
    vm.notifications.push(obj.message.name + " has connected!");
    vm.users = obj.userList;
}

function appendDisconnect(obj){
    if(obj.message.name !=""){
    console.log(obj);
    vm.notifications.push(obj.message.name + " has disconnected!");
    console.log(obj.userList);
    vm.users = obj.userList;
    }
}

const vm = new Vue({
    data: {
        socketID: "",
        nickname: "",
        message: "",
        messages: [],

        showModal: true,
        users: [],
        notifications: [],

        users: [],

        msgError: false,
        nameError: false

    },

    methods: {
        dispatchMessage() {
            if(this.message != ""){
            this.msgError = false;
            // send a chat message
            socket.emit('chat message', { content: this.message, name: this.nickname} );
            this.message = "";
            }else{
                this.msgError = true;
            }
        },

        changeNickname(){
            if(this.nickname != ""){
            socket.emit('userConnect', { name: this.nickname } );
            this.showModal=false;
            }else{
                this.nameError = true;
            }
        },

        forceDisconnect(){
            socket.emit('force disconnect', { name: this.nickname } );
            window.location.replace('/loggedout');
        }

    },

    updated: function(){
        window.scrollTo(0, document.querySelector('body').scrollHeight + 5000);
    },

    created: function(){
        this.showModal = true;
    },

    components: {
        newmessage: ChatMessage
    }
}).$mount("#app");

socket.addEventListener('connected', setUserId);
socket.addEventListener('chat message', appendMessage);
socket.addEventListener('userConnect', appendConnect);
socket.addEventListener('userDisconnect', appendDisconnect);