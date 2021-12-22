const socket = io('/');

const joinBtn = document.querySelector("#join-btn"); 
const name = document.querySelector("#name");
const modal = document.querySelector("#modal");
const chats = document.querySelector("#chats");

const mainInput = document.querySelector("#chat-input");

let pars = document.querySelector("#pars");

let username;
let participants = [];

let timer;
const waitTime = 1000;

function getTime() {
    let time = new Date(); 
    hour = time.getHours() < 10 ? `0${time.getHours()}` : `${time.getHours()}`;
    mins = time.getMinutes() < 10 ? `0${time.getMinutes()}` : `${time.getMinutes()}`;

    return `${hour}:${mins}`;
}

joinBtn.addEventListener("click", () => {
    if (name.value !== '') {
        username = name.value;
        socket.emit('join-room', ROOMID, name.value);
    }
});

name.addEventListener("keypress", (e) => {
    if (e.which == 13 || e.keyCode == 13) {
        if (name.value !== '') {
            username = name.value;
            socket.emit('join-room', ROOMID, name.value);
        }
    }
})

function updatePars(data) {
    pars.innerHTML = '';
    data.map(user => {
        pars.innerHTML +=
        `
        <div class="${user === username && 'myname'}">${user === username ? 'You' : user}</div>
        `
    });
}

socket.on('user-connected', data => {
    modal.style.display = "none";
    console.log(`${data} has joined the chat`);
    chats.innerHTML +=
    `
    <div class="global">
        <small>${data === username ? "You joined the chat" : data + ' joined the chat'}</small>
    </div>
    `;
});

socket.on('participants', data => {
    updatePars(data);
    console.log(data);
});

socket.on('typing-in', sender => {
    console.log(sender + ' is typing');
    if (sender !== username) {
        chats.innerHTML +=
        `
        <div class="hint" id="hint">
            <span class="user">${sender}</span> is typing...
        </div>
        `;
    }
});

socket.on('hide-typing', () => {
    console.log('typing hidden');
    const hint = document.getElementsByClassName("hint");
    
    while (hint[0]) {
        hint[0].parentElement.removeChild(hint[0]);
    }
})

socket.on('group-message', data => {
    console.log(data);
    console.log(username);
    chats.innerHTML += 
    `
    <div class="chat ${data.sender === username && "mine"}">
        <span>${data.message}</span>
        <small>${data.time} | ${data.sender === username ? "You" : data.sender}</small>
    </div>
    `;

    chats.scrollTop = chats.scrollHeight;
});

mainInput.addEventListener("keypress", (e) => {
    if (e.which == 13 || e.keyCode == 13) {

        if (e.target.value !== '') {
            let currentMessage = {
                message: mainInput.value,
                sender: username,
                time: getTime()
            };
    
            socket.emit('message', currentMessage);
            mainInput.value = "";
        }
    }
})

let infoIcon = document.querySelector("#info-icon");
let tooltip = document.querySelector("#tooltip");

infoIcon.addEventListener("click", () => {
    if (tooltip.style.display !== "flex") {
        tooltip.style.display = "flex";
        infoIcon.setAttribute("name", "close-circle-outline");
    } else {
        infoIcon.setAttribute("name", "information-circle-outline");
        tooltip.style.display = "none";
    }
});

mainInput.addEventListener("keypress", () => {
    socket.emit('typing-out', username);
    window.clearTimeout(timer);
});

mainInput.addEventListener("keyup", (e) => {
    window.clearTimeout(timer); // prevent errant multiple timeouts from being generated
	timer = window.setTimeout(() => {
        socket.emit('typing-stopped');
    }, waitTime)
});