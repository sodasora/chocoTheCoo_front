import {
    access_token, getChatLogAPI, getChatroominfo, payload, BACK_BASE_URL
} from "./api.js";

const urlParams = new URLSearchParams(window.location.search);
const roomId = urlParams.get('room');

const roominfo = await getChatroominfo(roomId)
const roomname = document.getElementById("chatname")
roomname.innerText = "채팅방: " + roominfo["name"]

const message_list = document.getElementById("chat_messages")

async function get_chat_log() {
    const chatlog = await getChatLogAPI(roomId);
    console.log(chatlog)

    chatlog.forEach(e => {
        const element = document.createElement("div");
        element.className = "chat-message";

        let footer = "";
        let message = e['content'];
        let sender = e['author_name'];
        let time = e['created_at'];
        let is_read = e['is_read'];
        let profile = e['author_image'];

        if (sender == payload.nickname) {
            element.className += " me";
        } else {
            footer = ` from ${sender}`;
        }

        if (message) {
            const wrapper = document.createElement("div");
            wrapper.textContent = message + footer;

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
            message_time.setAttribute("class", "message_time")
            message_time.innerText = time

            // const readcheck = document.createElement("li")
            // readcheck.setAttribute("class", "readcheck")
            // if (is_read == true) {
            //     readcheck.innerText = "읽음"
            // } else {
            //     readcheck.innerText = "읽지 않음"
            // }

            content.appendChild(profile_image);
            element.appendChild(content);
            element.appendChild(wrapper);
            element.appendChild(message_time);
            // element.appendChild(readcheck);

            message_list.appendChild(element);
            message_list.scrollTop = message_list.scrollHeight;
        }
    })
}

let chatSocket
let nowPage = 1
let backurl = BACK_BASE_URL.substring(7,)
console.log(backurl)
function socketSwap(roomId) {
    if (chatSocket) {
        chatSocket.close()
        message_list.empty()
        nowPage = 1
    }

    if (roomId != null) {
        chatSocket = new WebSocket(
            'ws://' + backurl +
            '/ws/chat/' + roomId + '/?token=' + access_token);

        console.log(chatSocket)

        chatSocket.onopen = function (e) {
            get_chat_log(roomId)
        }

        chatSocket.onmessage = function (e) {
            let data = JSON.parse(e.data);
            console.log(data)

            let sender = data['sender_name']
            let count = data['participants_count']
            let message = data['message']
            let time = data['time'];
            let is_read = data['is_read']
            let profile = data['profile']

            if (data['response_type'] == 'enter') {
                const participant_count = document.getElementById("user_count")
                participant_count.innerText = ` ${count}명`

                // chatlog["participant"].forEach(e => {
                //     const element = document.createElement("div");
                //     element.className = "chat-message";

                //     const participant = document.getElementById("user_list")
                //     const newli = document.createElement('li')
                //     newli.innerText = e.author
                //     participant.appendChild(newli)
                // })
            }

            if (data['response_type'] == 'out') {
                const participant_count = document.getElementById("user_count")
                participant_count.innerText = ` ${count}명`

                // chatlog["participant"].forEach(e => {
                //     const element = document.createElement("div");
                //     element.className = "chat-message";

                //     const participant = document.getElementById("user_list")
                //     const newli = document.createElement('li')
                //     newli.innerText = e.author
                //     participant.appendChild(newli)
                // })
            }

            const element = document.createElement("div");
            element.className = "chat-message";
            let footer = "";

            if (sender == payload.nickname) {
                element.className += " me";
            } else {
                footer = ` from ${sender}`;
            }

            if (message) {
                const wrapper = document.createElement("div");
                wrapper.textContent = message + footer;

                const message_time = document.createElement("li")
                message_time.setAttribute("class", "message_time")
                message_time.innerText = time

                // const readcheck = document.createElement("li")
                // readcheck.setAttribute("class", "readcheck")
                // if (is_read == true) {
                //     readcheck.innerText = "읽음"
                // } else {
                //     readcheck.innerText = "읽지 않음"
                // }

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
                // element.appendChild(readcheck);

                message_list.appendChild(element);
                message_list.scrollTop = message_list.scrollHeight;
            }
        }

        chatSocket.onclose = function (e) {
            console.error('Chat socket closed unexpectedly');
        }

        let chatMessageInput = document.querySelector("#chatMessageInput");

        // 엔터키(keyCode 13)를 누르면 전송 버튼(chatMessageSend)을 클릭
        // chatMessageInput.focus();
        // chatMessageInput.onkeyup = function (e) {
        //     if (e.keyCode === 13) {  // enter, return
        //         chatMessageSend.click();
        //     }
        // };

        chatMessageSend.onclick = function (e) {
            const messageInputDom = chatMessageInput;
            const message = messageInputDom.value;
            if (message === '') {
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
    }
}

socketSwap(roomId);



// const handlers = {
//     chat_messages_tag: null,
//     ws: null,
//     retry: 0,
//     username_set: new Set(),

//     init() {
//         this.chat_messages_tag = document.querySelector("#chat_messages");
//         document.querySelector("#message_form")
//             .addEventListener("submit", this.onsubmit.bind(this));
//     },
//     connect(ws_url) {
//         if (this.ws) this.ws.close();

//         this.ws = new WebSocket(ws_url || this.ws?.url);

//         this.ws.onopen = this.onopen.bind(this);
//         this.ws.onclose = this.onclose.bind(this);
//         this.ws.onerror = this.onerror.bind(this);
//         this.ws.onmessage = this.onmessage.bind(this);
//     },
//     reconnect() {
//         this.connect();
//     },
//     onopen() {
//         console.log("웹소켓 서버와 접속");
//         this.retry = 0;

//         fetch(`${BACK_BASE_URL}/chat/${roomId}/`)
//             .then(response => response.json())
//             .then(({ username_list }) => {
//                 this.username_set = new Set([...this.username_set, ...username_list]);
//                 this.update_user_list();
//             });
//     },
//     onclose(event) {
//         const close_code = event.code;

//         if (close_code === 4000) {
//             this.modal("채팅방이 삭제되었습니다.", () => {
//                 window.location.href = "chatindex.html";
//             });
//         }
//         else if (!event.wasClean) {
//             console.error("웹소켓 서버가 죽었거나, 네트워크 장애입니다.");
//             if (this.retry < 3) {
//                 this.retry += 1;
//                 setTimeout(() => {
//                     this.reconnect();
//                     console.log(`[${this.retry}] 접속 재시도 ...`);
//                 }, 1000 * this.retry)
//             }
//             else {
//                 console.log("웹소켓 서버에 접속할 수 없습니다.");
//                 alert('.')
//                 window.location.href = "chatindex.html";
//             }
//         }
//     },
//     onerror() {
//         console.log("웹소켓 에러가 발생했습니다.");
//         alert('*')
//         window.location.href = "chatindex.html";
//     },
//     onmessage(event) {
//         const message_json = event.data;
//         console.log("메세지 수신 :", message_json);

//         const { type, message, sender, username } = JSON.parse(message_json);
//         switch (type) {
//             case "chat.message":
//                 this.append_message(message, sender);
//                 break;
//             case "chat.user.join":
//                 this.append_message(`${username}님이 들어오셨습니다.`);
//                 this.username_set.add(username);
//                 this.update_user_list();
//                 break;
//             case "chat.user.leave":
//                 this.append_message(`${username}님이 나가셨습니다.`);
//                 this.username_set.delete(username);
//                 this.update_user_list();
//                 break;
//             default:
//                 console.error(`Invalid message type : ${type}`);
//         }
//     },
//     append_message(message, sender) {
//         const element = document.createElement("div");
//         element.className = "chat-message";

//         let footer = "";
//         if (sender === "") {
//             element.className += " me";
//         }
//         else if (sender) {
//             footer = ` from ${sender}`;
//         }

//         const wrapper = document.createElement("div");
//         wrapper.textContent = message + footer;
//         element.appendChild(wrapper);

//         this.chat_messages_tag.appendChild(element);
//         this.chat_messages_tag.scrollTop = this.chat_messages_tag.scrollHeight;

//     },
//     onsubmit(event) {
//         event.preventDefault();

//         const form_data = new FormData(event.target);
//         const props = Object.fromEntries(form_data);
//         event.target.reset();  // reset form

//         const { message } = props;
//         console.log("웹소켓으로 전송할 메세지 :", message);

//         // this.append_message(message);

//         this.ws.send(JSON.stringify({
//             type: "chat.message",
//             message: message,
//         }))
//     },
//     update_user_list() {
//         const html = [...this.username_set]
//             .map(nickname => `<li>${nickname}</li>`)
//             .join('');
//         document.querySelector("#user_list").innerHTML = html;

//         document.querySelector("#user_count").textContent =
//             `(${this.username_set.size}명)`;
//     },
//     modal(message, ok_handler) {
//         const modal_ele = document.querySelector("#staticBackdrop");
//         const body_ele = modal_ele.querySelector(".modal-body");
//         const button_ele = modal_ele.querySelector(".modal-footer button");

//         body_ele.textContent = message;

//         button_ele.addEventListener("click", () => {
//             if (ok_handler) ok_handler();
//             modal.hide();
//         });

//         const modal = new bootstrap.Modal(modal_ele);
//         modal.show();
//     }
// };

// handlers.init();
// const protocol = location.protocol === "http:" ? "ws:" : "wss:";
// const ws_url = protocol + "//" + "127.0.0.1:8000" + "/ws" + `/chat/${roomId}/chatting/`;







// get_chat_log(roomId);

