const socket = io('/');

const joinBtn = document.querySelector("#join-btn"); 
const name = document.querySelector("#name");
const modal = document.querySelector("#modal");
const chats = document.querySelector("#chats");

const mainInput = document.querySelector("#chat-input");

let username;

function getTime() {
    let time = new Date(); 
    hour = time.getHours() < 10 ? `0${time.getHours()}` : `${time.getHours()}`;
    mins = time.getMinutes() < 10 ? `0${time.getMinutes()}` : `${time.getMinutes()}`;

    return `${hour}:${mins}`;
}

joinBtn.addEventListener("click", () => {
    if (name.value !== '') {
        socket.emit('join-room', ROOMID, name.value);
    }
});

function newUser(username) {

}

socket.on('user-connected', data => {
    modal.style.display = "none";
    console.log(`${data} has joined the chat`);
    chats.innerHTML +=
    `
    <div class="global">
        <small>${data} has joined the chat</small>
    </div>
    `;
    username = data;
});

socket.on('group-message', data => {
    console.log(data);
    chats.innerHTML += 
    `
    <div class="chat">
        <span>${data.message}</span>
        <small>${data.time} | ${data.sender}</small>
    </div>
    `;
});

mainInput.addEventListener("keypress", (e) => {
    if (e.which == 13 || e.keyCode == 13) {

        let currentMessage = {
            message: mainInput.value,
            sender: username,
            time: getTime()
        };

        socket.emit('message', currentMessage);
        mainInput.value = "";
    }
})