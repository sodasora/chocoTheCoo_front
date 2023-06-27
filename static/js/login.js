import { BACK_BASE_URL, REDIRECT_URI, FRONT_BASE_URL, handleLoginAPI, getVerificationCodeAPI, setUserInformationAPI, kakaoLoginAPI, googleLoginAPI, naverLoginAPI } from './api.js'

let modal_image_index = 0

async function injectFooter() {
    // 푸터 html 불러오기
    fetch("./footer.html")
        .then((response) => {
            return response.text();
        })
        .then((data) => {
            document.querySelector("footer").innerHTML = data;
        })

    let headerHtml = await fetch("./footer.html")
    let data = await headerHtml.text()
    document.querySelector("footer").innerHTML = data;
}


export async function handleLogin() {
    // 로그인 , 토큰 저장
    const message_box = document.getElementById("message-box")
    const message = document.getElementById("message")
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    if (email == '' || password == '') {
        message.textContent = "빈칸 없이 입력해 주세요."
        message_box.style.display = "flex"
    } else {

        const response = await handleLoginAPI();
        if (response.status == 200) {
            const response_json = await response.json()
            localStorage.setItem("access", response_json.access);
            localStorage.setItem("refresh", response_json.refresh);

            const base64Url = response_json.access.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            localStorage.setItem("payload", jsonPayload)
            window.location.replace(`${FRONT_BASE_URL}/index.html`)

        } else {
            const response_json = await response.json()
            message_box.style.display = "flex"
            if (response.status == 404) {
                // 찾을 수 없는 계정
                message.textContent = "가입된 이메일이 없습니다."
            } else {
                message.textContent = response_json.non_field_errors[0]
            }
        }
    }
}

export async function getVerificationCode() {
    // 인증 코드 발급 받기
    const message = document.getElementById("message")
    const email = document.getElementById("email")
    message.innerText = "인증 코드를 발송 중 입니다. 잠시만 기다려 주세요."
    if (email.value == "") {
        message.innerText = "이메일을 입력해 주세요."
    } else {
        const response = await getVerificationCodeAPI(email.value)
        if (response.status == 200) {
            message.innerText = "인증 코드를 발급 했습니다."
            const hidden_items = document.querySelectorAll(".hidden-box-2");
            hidden_items.forEach((item) => {
                item.style.display = "block";
            });
            email.readOnly = true
            const container = document.getElementById("container");
            // 높이 값 설정 
            container.style.height = "calc(150vh - 50px)";
        } else if (response.status == 404) {
            message.innerText = "이메일 정보를 찾을 수 없습니다."
        }
    }
}

export async function setUserInformation() {
    // 비밀번호 재 설정(찾기기능) 및 비활성 게정 활성화
    const email = document.getElementById("email")
    const verificationCode = document.getElementById("verificationCode")
    const password = document.getElementById("password")
    const password2 = document.getElementById("password2")
    const message = document.getElementById("message")
    message.innerText = ''
    if (email.value == '' || verificationCode.value == '' || password.value == '' || password2.value == '') {
        message.innerText = "빈칸 없이 입력해 주세요."
    } else if (password.value != password2.value) {
        password.value = ''
        password2.value = ''
        message.innerText = "입력하신 두 비밀번호가 같지 않습니다."
    } else {
        const response = await setUserInformationAPI()
        const response_json = await response.json()
        console.log(response_json)
        if (response.status == 200) {
            window.location.reload()
        } else if (response.status == 404) {
            message.innerText = '가입된 이메일 정보를 찾을 수 없습니다.'
        }
        else {

            message.innerText = response_json.non_field_errors
        }
    }
}

export async function handleEvent() {
    // 페이지 view 변경
    const change_items = document.querySelectorAll(".change-item");
    const message_box = document.getElementById("message-box")
    const message = document.getElementById("message")
    const passwordBox = document.getElementById("passwordBox")
    passwordBox.style.display = "none"
    message_box.style.display = "flex"
    message.textContent = "이메일 인증을 받고 비밀번호를 재 설정해주세요."
    change_items.forEach((item) => {
        item.style.display = "none";
    });
    const hidden_items = document.querySelectorAll(".hidden-box");
    hidden_items.forEach((item) => {
        item.style.display = "block";
    });
    if (window.innerWidth >= 1440) {
        document.querySelector(".container").style.height = "160vh";
    }
}


export async function closeModal() {
    document.getElementById("modal").style.display = "none"
}

export async function changeModal(eventValue) {
    const message = [
        "이메일 정보와 비밀번호를 입력해서 로그인 해주세요.",
        "소셜 계정으로 간편한 가입과 로그인이 가능 합니다.",
        "가입된 계정이 없다면 회원 가입을 진행해 주세요.",
        "휴면 계정이시거나, 비밀번호를 잊어 버리셨다면\n 비밀번호를 재 설정 해 주세요.",
        "비밀 번호를 재 설정하기 위해서, 이메일 정보를 입력하고 인증 번호를 발급 받아 주세요.",
        "이메일로 전송해드린 인증 코드를 작성해 주세요.",
        "새로운 비밀번호를 입력해 주세요.",
        "빈칸 없이 입력해 주셨다면 제출 버튼을 눌러 주세요.",
        "인증 코드를 발급 받지 못했다면, 다시 발급 받아 주세요.",
    ]

    document.getElementById("modal-image-box").style.backgroundImage = `url('/static/images/login_guide/login_guide_${eventValue}.png')`;
    document.getElementById("modal-message-box").innerText = message[eventValue]
    document.getElementById("modal-page").innerText = `${eventValue}/8`
}

export async function modalLeftButton() {
    modal_image_index -= modal_image_index == 0 ? 0 : 1
    changeModal(modal_image_index)
}
export async function modalRightButton() {
    modal_image_index += modal_image_index == 8 ? 0 : 1
    changeModal(modal_image_index)
}

export async function setEventListener() {
    // html 요소 이벤트 리스너 추가
    document.getElementById("loginButton").addEventListener("click", handleLogin)
    document.getElementById("submitButton").addEventListener("click", setUserInformation)
    document.getElementById("verificationButton").addEventListener("click", getVerificationCode)
    var elements = document.getElementsByClassName("change-action");
    for (var i = 0; i < elements.length; i++) {
        elements[i].addEventListener("click", handleEvent);
    }
    document.getElementById("password").addEventListener("keydown", (event) => {
        if (event.key == "Enter") {
            handleLogin()
        }
    })


    document.getElementById("kakaoBtn").addEventListener("click", kakaoLoginAPI)
    document.getElementById("naverBtn").addEventListener("click", naverLoginAPI)
    document.getElementById("googleBtn").addEventListener("click", googleLoginAPI)
    document.getElementById("modal-close-button").addEventListener("click", closeModal)
    document.getElementById("modal-left-button").addEventListener("click", modalLeftButton)
    document.getElementById("modal-right-button").addEventListener("click", modalRightButton)


}







window.onload = async () => {
    // 로그인 안한 사용자만 접근 가능
    setEventListener();
    // injectFooter();
    const payload = localStorage.getItem("payload");
    const payload_parse = JSON.parse(payload)
    if (payload_parse != null) {
        window.location.replace(`${FRONT_BASE_URL}/index.html`)
    }
}