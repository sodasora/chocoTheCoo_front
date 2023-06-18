import { FRONT_BASE_URL, handleSignupAPI, getVerificationCodeAPI, VerificationCodeSubmitAPI } from './api.js'

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


export async function handleSignup() {
    // 회원 가입
    const email = document.getElementById("signupEmail")
    const nickname = document.getElementById("signupNickname")
    const password = document.getElementById("signupPassword")
    const password2 = document.getElementById("signupPassword2")
    const signupMessageBox = document.getElementById("signupMessageBox")
    const signupMessage = document.getElementById("signupMessage")
    const checkbox = document.getElementById("checkbox")
    if (email.value == "" || nickname.value == "" || password.value == "" || password2.value == "") {
        signupMessageBox.style.display = "flex"
        signupMessage.innerText = "빈칸 없이 입력해 주세요."
    } else if (password.value != password2.value) {
        signupMessageBox.style.display = "flex"
        signupMessage.innerText = "입력하신 두 비밀번호가 같지 않습니다."
        password.value = ''
        password2.value = ''
    } else if (checkbox.checked === false) {
        signupMessageBox.style.display = "flex"
        signupMessage.innerText = "동의 사항을 확인해 주세요."
    } else {

        const response = await handleSignupAPI(email.value, nickname.value, password.value)
        if (response.status == 200) {
            email.readOnly = true
            const signup_item_one = document.querySelectorAll(".signup-item-one");
            signup_item_one.forEach((item) => {
                item.style.display = "none";
            });

            const signup_item_two = document.querySelectorAll(".signup-item-two");
            signup_item_two.forEach((item) => {
                item.style.display = "block";
            });
            const signupNavItemTwo = document.getElementById("signupNavItemTwo")
            signupNavItemTwo.style.backgroundColor = "#7B4242";
            signupMessageBox.style.display = "none"
        } else if (response.status == 400) {
            signupMessageBox.style.display = "flex"
            password.value = ''
            password2.value = ''
            signupMessage.innerText = "이미 가입한 계정이 있거나 입력값이 올바르지 않습니다."
        }
    }


}

export async function getVerificationCode() {
    // 인증 코드 발급 받기
    const signupMessageBox = document.getElementById("signupMessageBox")
    const signupMessage = document.getElementById("signupMessage")
    const email = document.getElementById("signupEmail")
    signupMessage.innerText = "인증 코드를 발송중 입니다. 잠시만 기다려 주세요."
    signupMessageBox.style.display = "flex"
    if (email.value == "") {
        signupMessage.innerText = "이메일을 입력해 주세요."
    } else {
        const response = await getVerificationCodeAPI(email.value)
        if (response.status == 200) {
            signupMessage.innerText = "인증 코드를 발송 했습니다."
            const hidden_items = document.querySelectorAll(".hidden-box-2");
            hidden_items.forEach((item) => {
                item.style.display = "block";
            });
            email.readOnly = true
        } else if (response.status == 405) {
            signupMessage.innerText = "가입된 이메일 정보를 찾을 수 없습니다."
        }
    }
}

export async function VerificationCodeSubmit() {
    // 계정 이메일 인증
    const email = document.getElementById("signupEmail")
    const verificationCode = document.getElementById("signupVerificationCode")
    const response = await VerificationCodeSubmitAPI(email.value, verificationCode.value)
    if (response.status == 200) {
        window.location.replace(`${FRONT_BASE_URL}/login.html`)
    } else {
        const signupMessageBox = document.getElementById("signupMessageBox")
        const signupMessage = document.getElementById("signupMessage")
        signupMessageBox.style.display = "flex"
        if (response.status == 404) {
            signupMessage.innerText = "가입된 이메일 정보를 찾을 수 없습니다."
        } else if (response.status == 406) {
            signupMessage.innerText = "인증 코드를 발급 받아 주세요."
        } else {
            signupMessage.innerText = "인증 코드가 올바르지 않습니다."
        }
    }
}

export async function setEventListener() {
    // html 요소 이벤트 리스너 추가
    document.getElementById("signupInformationSubmit").addEventListener("click", handleSignup)
    document.getElementById("getVerificationCodeBoxTag").addEventListener("click", getVerificationCode)
    document.getElementById("signupVerificationCodeSubmit").addEventListener("click", VerificationCodeSubmit)
}

window.onload = async () => {
    injectFooter()
    setEventListener()
    const payload = localStorage.getItem("payload");
    const payload_parse = JSON.parse(payload)
    if (payload_parse != null) {
        window.location.replace(`${FRONT_BASE_URL}/index.html`)
    }
}