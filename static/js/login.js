import { BACK_BASE_URL, REDIRECT_URI, FRONT_BASE_URL, handleLoginAPI, getVerificationCodeAPI, setUserInformationAPI } from './api.js'


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
    if (email.value == "") {
        message.innerText = "이메일을 입력해 주세요."
    } else {
        const response = await getVerificationCodeAPI(email.value)
        console.log(response)
        if (response.status == 200) {
            message.innerText = "이메일을 발송 했습니다."
            const hidden_items = document.querySelectorAll(".hidden-box-2");
            hidden_items.forEach((item) => {
                item.style.display = "block";
            });
            email.readOnly = true
        } else if (response.status == 405) {
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
        if (response.status == 200) {
            window.location.reload()
        } else if (response.status == 404) {
            message.innerText = '가입된 이메일 정보를 찾을 수 없습니다.'
        }
        else {
            const response_json = await response.json()
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





async function kakaoLoginBtn() {
    // 카카오 로그인

    // 백엔드 서버로부터 kakao API 반환
    const response = await fetch(`${BACK_BASE_URL}/api/users/kakao/login/`, { method: 'GET' })
    const kakao_id = await response.json()
    // Resource server와 약속된 REDIRECT URI 설정
    const redirect_uri = REDIRECT_URI
    // 요청할 데이터 설정
    const scope = 'profile_nickname,profile_image,account_email'
    // 사용자를 Resource Server로 이동
    // Resource Server는 사용자를 Redirect URI로 안내
    window.location.href = `https://kauth.kakao.com/oauth/authorize?client_id=${kakao_id}&redirect_uri=${redirect_uri}&response_type=code&scope=${scope}`
}

async function googleLoginBtn() {
    const response = await fetch(`${BACK_BASE_URL}/api/users/google/login/`, { method: 'GET' })
    const google_id = await response.json()
    const redirect_uri = REDIRECT_URI
    const scope = 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile'
    const param = `scope=${scope}&include_granted_scopes=true&response_type=token&state=pass-through value&prompt=consent&client_id=${google_id}&redirect_uri=${redirect_uri}`
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${param}`
}

async function naverLoginBtn() {
    const response = await fetch(`${BACK_BASE_URL}/api/users/naver/login`, { method: 'GET' });
    const naver_id = await response.json();
    const redirect_uri = `${FRONT_BASE_URL}/index.html`;
    const state = new Date().getTime().toString(36);
    window.location.href = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${naver_id}&redirect_uri=${redirect_uri}&state=${state}`;
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
    document.getElementById("kakaoBtn").addEventListener("click", kakaoLoginBtn)
    document.getElementById("naverBtn").addEventListener("click", naverLoginBtn)
    document.getElementById("googleBtn").addEventListener("click", googleLoginBtn)
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