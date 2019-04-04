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

const vm = new Vue({
    data: {
        socketID: "",
        nickname: "",
        message: "",
        messages: []
    },

    methods: {
        dispatchMessage() {
            // send a chat message
            socket.emit('chat message', { content: this.message, name: this.nickname || "Anonymous"} );

            this.message = "";
        }
    },

    updated: function(){
        window.scrollTo(0, document.querySelector('body').scrollHeight + 5000);
    },

    components: {
        newmessage: ChatMessage
    }
}).$mount("#app");

socket.addEventListener('connected', setUserId);
socket.addEventListener('chat message', appendMessage);
socket.addEventListener('disconnect', appendMessage);