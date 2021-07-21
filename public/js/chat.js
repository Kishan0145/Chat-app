var query_String = Qs.parse(location.search, { ignoreQueryPrefix: true })
var query_String = Qs.parse(location.search, { ignoreQueryPrefix: true })
const socket = io();
const $messages = document.getElementById("message");

const autoscroll = () => {
    // New message element
    const $newMessage = $messages.lastElementChild
    // Height of the new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin
    // Visible height
    const visibleHeight = $messages.offsetHeight
    // Height of messages container
    const containerHeight = $messages.scrollHeight
    // How far have I scrolled?
    const scrollOffset = $messages.scrollTop + visibleHeight
    if (containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight
    }
}

function playSound(url) {
    const audio = new Audio(url);
    audio.play();
}

document.querySelector("#message-form").addEventListener("submit", (e) => {
    e.preventDefault();
    window.value = document.getElementById("msg").value;
})

socket.on("Msg", (msg) => {
    console.log("msg", msg)
    console.log("query ", query_String)
    var container = document.createElement("div");
    container.setAttribute("class", "message");
    var message = document.createElement("p");
    if (msg.msg != undefined) {
        if (!msg.msg.includes("https")) {
            message.innerText = `${msg.msg}`
        }
    }
    var user_time = document.createElement("p");

    var user_span = document.createElement("span");
    user_span.setAttribute("class", "message__name");

    var time_span = document.createElement("span");
    time_span.setAttribute("class", "message__meta");
    time_span.innerText = `${moment(new Date()).format("h:mm a")}- `
    if ((window.value === msg.msg || ((msg.msg.includes("https") && (msg.username === query_String.username))) || (window.value != undefined) && ((msg.msg.includes("https") && (msg.username === query_String.username))))) {

        user_span.innerText = "me"
        container.classList.add("my_message")
        user_span.classList.add("my_message_name")
        time_span.classList.add("my_message_meta")
    }
    else {
        playSound("/audio/hollow-582.ogg")
        user_span.innerText = `${msg.username}`
    }
    user_time.appendChild(user_span)
    user_time.appendChild(time_span)

    container.appendChild(user_time)
    container.appendChild(message)
    if (msg.msg != undefined) {
        if (msg.msg.includes("https")) {

            var location = document.createElement("a");
            location.setAttribute("href", msg.msg);
            location.setAttribute("target", "_blank")
            location.innerText = `My Location`;
            message.appendChild(location)
        }
        else {
            message.innerText = `${msg.msg}`
        }
    }

    document.getElementById("message").insertAdjacentElement("beforeend", container)
    autoscroll()
})


document.querySelector("#message-form").addEventListener("submit", (e) => {
    e.preventDefault();
    document.getElementById("send").disabled = true;
    const msg = document.getElementById("msg").value;
    const elem = document.querySelector(".message")
    socket.emit("Message", msg);
    document.getElementById("send").disabled = false;
    document.getElementById("msg").value = ""
    document.getElementById("msg").focus();

    document.querySelector("textarea").style.height = "";
})


document.getElementById("location").addEventListener("click", () => {
    document.getElementById("location").disabled = true;
    navigator.geolocation.getCurrentPosition((position) => {
        const current_location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
        }

        socket.emit("sendLocation", current_location);
        document.getElementById("location").disabled = false;
    })
})


socket.emit("join", query_String, (error) => {
    alert(error);
    location.href = "/";
})
socket.on("roomUsers", (userData) => {
    const sidebar = document.getElementById("roomUsers").innerHTML
    const html = Mustache.render(sidebar, {
        room: userData.room,
        users: userData.users,
    })
    document.querySelector(".chat__sidebar").innerHTML = html;
})