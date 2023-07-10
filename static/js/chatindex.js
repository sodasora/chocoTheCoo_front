import {
    FRONT_BASE_URL, postChatindexAPI, getChatindexAPI, payload, deleteChatroom, checkPasswordAPI
} from "./api.js";

async function pagination_chatlist(chat) {
    const newlist = document.getElementById("chats-list");
    const buttons = document.getElementById("chat-buttons");

    // 페이지네이션 페이지 설정
    const numOfContent = chat.length;
    const maxContent = 5; //한 페이지에 보이는 수
    const maxButton = 5; //보이는 최대 버튼 수
    const maxPage = Math.ceil(numOfContent / maxContent);
    let page = 1;

    const Content = (id) => {
        const newdiv = document.createElement("div")
        newdiv.setAttribute("class", "newchat")

        const newname = document.createElement("li")
        newname.setAttribute("class", "chatname")
        if (chat[id].password != null) {
            newname.innerText = "🔒 " + chat[id].name
        } else {
            newname.innerText = "▫️ " + chat[id].name
        }

        newname.onclick = function () {
            gochat(chat[id].id)
        };

        const chatdesc = document.createElement("span")
        chatdesc.setAttribute("class", "chatdesc")
        chatdesc.innerText = chat[id].desc

        const chatbutton = document.createElement("button")
        chatbutton.setAttribute("class", "gobutton")
        chatbutton.setAttribute("data-bs-toggle", "modal")
        chatbutton.setAttribute("data-bs-target", "#staticBackdrop2")
        chatbutton.innerText = "입장"
        chatbutton.onclick = function () {
            if (chat[id].password != null) {
                const submit = document.getElementById("chatbutton2")
                submit.onclick = function () {
                    checkpassword(chat[id].id)
                }
            } else {
                gochat(chat[id].id)
            }
        };

        const user_id = payload.user_id

        const deletebuton = document.createElement("button")
        deletebuton.setAttribute("class", "deletebuton")
        deletebuton.innerText = "삭제"
        if (chat[id].author == user_id) {
            deletebuton.onclick = function () {
                deletechat(chat[id].id)
            };
        } else {
            deletebuton.setAttribute("style", "display:none;")
        }

        newdiv.appendChild(newname)
        newdiv.appendChild(chatdesc)
        newdiv.appendChild(chatbutton)
        newdiv.appendChild(deletebuton)

        return newdiv
    }

    const makeButton = (id) => {
        const button = document.createElement("button");
        button.classList.add("button_page");
        button.dataset.num = id;
        button.innerText = id;
        button.addEventListener("click", (e) => {
            Array.prototype.forEach.call(buttons.children, (button) => {
                if (button.dataset.num) button.classList.remove("active");
            });
            e.target.classList.add("active");
            renderContent(parseInt(e.target.dataset.num));
        });
        return button;
    }

    const renderContent = (page) => {
        // 목록 리스트 초기화
        while (newlist.hasChildNodes()) {
            newlist.removeChild(newlist.lastChild);
        }
        // 글의 최대 개수를 넘지 않는 선에서, 화면에 maxContent개의 글 생성
        for (let id = (page - 1) * maxContent + 1; id <= page * maxContent && id <= numOfContent; id++) {
            newlist.appendChild(Content(id - 1));
        }
    };

    const goPrevPage = () => {
        page -= maxButton;
        render(page);
    };

    const goNextPage = () => {
        page += maxButton;
        render(page);
    };

    const prev = document.createElement("button");
    prev.classList.add("button_page", "prev");
    prev.innerHTML = `<ion-icon name="chevron-back-outline"></ion-icon>`;
    prev.addEventListener("click", goPrevPage);

    const next = document.createElement("button");
    next.classList.add("button_page", "next");
    next.innerHTML = `<ion-icon name="chevron-forward-outline"></ion-icon>`;
    next.addEventListener("click", goNextPage);

    const renderButton = (page) => {
        // 버튼 리스트 초기화
        while (buttons.hasChildNodes()) {
            buttons.removeChild(buttons.lastChild);
        }
        // 화면에 최대 maxButton개의 페이지 버튼 생성
        for (let id = page; id < page + maxButton && id <= maxPage; id++) {
            buttons.appendChild(makeButton(id));
        }
        // 첫 버튼 활성화(class="active")
        buttons.children[0].classList.add("active");

        buttons.prepend(prev);
        buttons.appendChild(next);

        // 이전, 다음 페이지 버튼이 필요한지 체크
        if (page - maxButton < 1) buttons.removeChild(prev);
        if (page + maxButton > maxPage) buttons.removeChild(next);
    };

    const render = (page) => {
        renderContent(page);
        renderButton(page);
    };
    render(page);

}

async function makechat() {
    const newinfo = document.getElementById("room-name")
    const newdesc = document.getElementById("room-desc")
    const newpassword = document.getElementById("room-password")
    const roomname = newinfo.value
    const roomdesc = newdesc.value
    let roompassword = newpassword.value.replace(/\s/g, '')
    if (roompassword == "") {
        roompassword = null
    }
    const result = await postChatindexAPI(roomname, roomdesc, roompassword);

    if (result == 201) {
        alert("등록완료")
        window.location.reload()
    } else if (result == 400) {
        alert("잘못 입력하셨습니다. 빈칸이 있으면 안됩니다. 다시 입력 바랍니다.")
    } else {
        alert("채팅방은 3개까지 만들 수 있습니다.")
    }
}


function gochat(id) {
    window.location.href = `${FRONT_BASE_URL}/chatroom.html?room=${id}`
}


async function checkpassword(id) {
    const passwordinput = document.getElementById("room-password-check")
    const password = passwordinput.value.replace(/\s/g, '')
    const response = await checkPasswordAPI(id, password)
    if (response == 200) {
        gochat(id)
    } else {
        alert("비밀번호가 틀립니다.")
    }
}

async function deletechat(id) {
    const response = await deleteChatroom(id)
    if (response == 204) {
        alert("삭제완료")
        window.location.reload();
    } else if (response == 403) {
        alert("접속유저가 존재합니다. 잠시 후 실행해주세요.")
    } else {
        alert("삭제권한이 없습니다.")
    }
}

export async function create_chat_room() {
    if (payload == null) {
        alert("로그인이 필요 합니다.")
        window.location.replace(`${FRONT_BASE_URL}/login.html`)
    }
}

window.onload = async function () {
    if (payload == null) {
        alert("로그인이 필요 합니다.")
        window.location.replace(`${FRONT_BASE_URL}/login.html`)
    }
    const inputElement = document.querySelector('#room-name');
    inputElement.addEventListener('keyup', function () {
        const text = inputElement.value;

        // 입력한 글자 수가 최대 글자 수를 초과할 경우, 입력한 문자열을 자름
        if (text.length > 10) {
            inputElement.value = text.slice(0, 10);
        }
    });

    const inputdescElement = document.querySelector('#room-desc');
    inputdescElement.addEventListener('keyup', function () {
        const text = inputdescElement.value;

        // 입력한 글자 수가 최대 글자 수를 초과할 경우, 입력한 문자열을 자름
        if (text.length > 50) {
            inputdescElement.value = text.slice(0, 50);
        }
    });

    const chat = await getChatindexAPI();
    pagination_chatlist(chat);

    const button = document.getElementById("chatbutton")
    button.addEventListener("click", makechat)
    document.getElementById("create-chat-room-button").addEventListener("click", create_chat_room)
}