import {
    access_token, getChatLogAPI, getChatroominfo, payload, BACK_BASE_URL, FRONT_BASE_URL
} from "./api.js";

const urlParams = new URLSearchParams(window.location.search);
const roomId = urlParams.get('room');

if (payload == null) {
    alert("로그인이 필요 합니다.")
    window.location.replace(`${FRONT_BASE_URL}/login.html`)
} else if (roomId == null) {
    alert("채팅방 정보를 찾을 수 없습니다.")
    window.location.replace(`${FRONT_BASE_URL}/index.html`)
}


let chatSocket
let nowPage = 1
let username_set = new Set();

const roominfo = await getChatroominfo(roomId)
// console.log(roominfo)
const roomname = document.getElementById("chatname")
roomname.innerText = "채팅방: " + roominfo.room["name"]

const message_list = document.getElementById("chat_messages")

async function get_chat_log() {
    const chatlog = await getChatLogAPI(roomId);
    // console.log(chatlog)

    chatlog.forEach(e => {
        const element = document.createElement("div");
        element.className = "chat-message";

        let message = e['content'];
        let sender = e['author_name'];
        let created_at = e['created_at']
        let time = e['created_at_time'];
        let profile = e['author_image'];

        if (sender == payload.nickname) {
            element.className += " me";
        }

        if (message) {
            const wrapper = document.createElement("div");
            wrapper.textContent = message;

            const content = document.createElement("li");
            content.setAttribute("class", "image")

            const profile_image = document.createElement("img")
            profile_image.setAttribute("class", "profile_image")
            if (profile != null) {
                // console.log(profile);
                profile_image.setAttribute("src", profile)
            } else {
                profile_image.setAttribute("src", "static/images/기본상품.png")
            }

            const message_time = document.createElement("li")

            if (sender == payload.nickname) {
                message_time.setAttribute("class", "message_time")
                message_time.innerText = created_at.slice(0, 10) + ' ' + time
            } else {
                message_time.setAttribute("class", "message_time")
                message_time.innerText = created_at.slice(0, 10) + ' ' + time + ' ' + sender;
            }

            content.appendChild(profile_image);
            element.appendChild(content);
            element.appendChild(wrapper);
            element.appendChild(message_time);

            message_list.appendChild(element);
            message_list.scrollTop = message_list.scrollHeight;
        }
    })
}

function socketSwap(roomId) {
    if (chatSocket) {
        chatSocket.close()
        message_list.empty()
        nowPage = 1
    }

    let backurl = BACK_BASE_URL.substring(7,)
    console.log(backurl)
    if (roomId != null) {

        // 로컬
        chatSocket = new WebSocket(
            'ws://' + backurl + '/ws/chat/' + roomId + '/?id=' + payload.user_id
        );

        //배포
        // chatSocket = new WebSocket(
        //     'wss://' + backurl + '/ws/chat/' + roomId + '/?id=' + payload.user_id
        // );

        // console.log(chatSocket)

        function update_user_list() {
            const html = Array.from(username_set).map(sender => `<li>${sender}</li>`).join('');
            document.querySelector("#user_list").innerHTML = html;
            document.querySelector("#user_count").textContent =
                `(${username_set.size}명)`;
        };

        chatSocket.onopen = function (e) {
            get_chat_log(roomId)
            roominfo.participants.forEach(e => {
                username_set.add(e["author_name"]);
            })
            update_user_list();
        }

        chatSocket.onmessage = function (e) {
            let data = JSON.parse(e.data);
            // console.log(data)

            let sender = data['sender_name']
            let message = data['message']
            let time = data['time'];
            let profile = data['profile']

            if (data['response_type'] == 'enter') {
                const alarm = document.createElement("li")
                alarm.setAttribute("class", "enter-alarm")
                alarm.innerHTML = `${sender}님이 들어오셨습니다.`;
                message_list.append(alarm);

                username_set.add(sender);
                update_user_list();
            }

            if (data['response_type'] == 'out') {
                const alarm = document.createElement("li")
                alarm.setAttribute("class", "out-alarm")
                alarm.innerHTML = `${sender}님이 나가셨습니다.`;
                message_list.append(alarm);

                username_set.delete(sender);
                update_user_list();
            }

            const element = document.createElement("div");
            element.className = "chat-message";

            if (sender == payload.nickname) {
                element.className += " me";
            }

            if (message) {
                const wrapper = document.createElement("div");
                wrapper.textContent = message;

                const message_time = document.createElement("li")
                message_time.setAttribute("class", "message_time")
                if (sender == payload.nickname) {
                    message_time.innerText = time
                } else {
                    message_time.innerText = time + ' ' + sender
                }

                const content = document.createElement("li");
                content.setAttribute("class", "image")

                const profile_image = document.createElement("img")
                profile_image.setAttribute("class", "profile_image")
                if (profile != null) {
                    // console.log(profile);
                    profile_image.setAttribute("src", profile)
                } else {
                    profile_image.setAttribute("src", "static/images/기본상품.png")
                }

                content.appendChild(profile_image);
                element.appendChild(content);
                element.appendChild(wrapper);
                element.appendChild(message_time);
                message_list.appendChild(element);
                message_list.scrollTop = message_list.scrollHeight;
            }
        }

        chatSocket.onclose = function (e) {
            console.error('Chat socket closed unexpectedly');
            alert("채팅방이 존재하지 않거나 로그인하지 않은 유저입니다.")
        }

        let chatMessageInput = document.querySelector("#chatMessageInput");

        // 엔터키(keyCode 13)를 누르면 전송 버튼(chatMessageSend)을 클릭
        chatMessageInput.focus();
        chatMessageInput.onkeyup = function (e) {
            if (e.keyCode === 13) {  // enter, return
                chatMessageSend.click();
            }
        };

        chatMessageSend.onclick = function (e) {
            const messageInputDom = chatMessageInput;
            const message = messageInputDom.value;
            if (message === '') {
                return
            }
            if (message.replace(/\s/g, "") === '') {
                return
            }
            chatSocket.send(JSON.stringify({
                'user_id': payload['user_id'],
                'room_id': `${roomId}`,
                'message': message
            }));
            // 메세진 전송후 입력창에 빈값 넣어주기
            messageInputDom.value = '';
        };
    } else {
        alert("채팅방을 찾을 수 없습니다.")
    }
}

socketSwap(roomId);