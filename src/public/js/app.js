const socket = io();

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");
const room = document.getElementById("room");

room.hidden = true;

let roomName;

function addMessage(message) {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = message;
  ul.appendChild(li);
}
function handleMessageSubmit(e) {
  e.preventDefault();
  const input = room.querySelector("input");
  const value = input.value;
  socket.emit("new_message", value.toString("utf8"), roomName, () => {
    addMessage(`You: ${value.toString("utf8")}`);
  });
  input.value = "";
}
function showRoom() {
  welcome.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName}`;
  const form = room.querySelector("form");
  form.addEventListener("submit", handleMessageSubmit);
}

function handleRoomSubmit(e) {
  e.preventDefault();
  const input = form.querySelector("input");
  socket.emit("enter_room", input.value.toString("utf8"), showRoom);
  roomName = input.value.toString("utf8");
  input.value = "";
}
form.addEventListener("submit", handleRoomSubmit);
socket.on("welcome", () => {
  addMessage("Someone Joined!");
});
socket.on("bye", () => {
  addMessage("Someone left ㅠㅠ");
});
socket.on("new_message", addMessage);
