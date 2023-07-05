import { FRONT_BASE_URL, handleSignupAPI, getVerificationCodeAPI, VerificationCodeSubmitAPI, kakaoLoginAPI, googleLoginAPI, naverLoginAPI } from './api.js'
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
        } else {
            signupMessageBox.style.display = "flex"
            password.value = ''
            password2.value = ''
            const response_json = await response.json()

            if (response_json.err.non_field_errors == null) {
                if (response_json.err.nickname != null) {
                    signupMessage.innerText = '닉네임의 길이는 20글자 미만 공백 없이 작성해 주세요.'
                } else if (response_json.err.password != null) {
                    signupMessage.innerText = '비밀 번호 정보가 올바르지 않습니다.'
                } else {
                    signupMessage.innerText = '이미 등록된 이메일 계정이거나, 이메일 정보가 올바르지 않습니다.'
                }
            } else {
                signupMessage.innerText = response_json.err.non_field_errors
            }
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
        } else if (response.status == 404) {
            signupMessage.innerText = "가입된 이메일 정보를 찾을 수 없습니다."
        } else {
            const response_json = await response.json()
            signupMessage.innerText = response_json.err
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
        const response_json = await response.json()
        const signupMessageBox = document.getElementById("signupMessageBox")
        const signupMessage = document.getElementById("signupMessage")
        signupMessageBox.style.display = "flex"
        if (response.status == 404) {
            signupMessage.innerText = "가입된 이메일 정보를 찾을 수 없습니다."
        } else if (response_json.err != null) {

            signupMessage.innerText = response_json.err
        } else {
            signupMessage.innerText = "인증코드 정보가 올바르지 않습니다."
        }
    }
}

const hoverEvent = document.getElementById("hoverEvent")
const hoverEventMessage = document.getElementById("hoverEventMessage")
hoverEvent.addEventListener('mouseover', () => {
    hoverEventMessage.style.display = 'block';
});
hoverEvent.addEventListener('mouseout', () => {
    hoverEventMessage.style.display = 'none';
});

export async function closeModal() {
    document.getElementById("modal").style.display = "none"
}

export async function changeModal(eventValue) {
    const message = [
        "회원 정보를 입력해 주세요.",
        "개인 정보 수집 이용에 동의해 주세요.",
        "소셜 계정을 통해 간편한 가입을 할 수 있습니다.",
        "이미 계정이 있으시다면 로그인을 진행해 주세요.",
        "계정 인증을 위해 이메일 인증을 진행해 주세요.",
        "이메일로 발급한 인증 코드를 입력하고 제출해 주세요.",
    ]

    document.getElementById("modal-image-box").style.backgroundImage = `url('/static/images/signup_guide/signup_guide_${eventValue}.png')`;
    document.getElementById("modal-message-box").innerText = message[eventValue]
    document.getElementById("modal-page").innerText = `${eventValue}/5`
}

export async function modalLeftButton() {
    modal_image_index -= modal_image_index == 0 ? 0 : 1
    changeModal(modal_image_index)
}
export async function modalRightButton() {
    modal_image_index += modal_image_index == 5 ? 0 : 1
    changeModal(modal_image_index)
}



export async function setEventListener() {
    // html 요소 이벤트 리스너 추가
    document.getElementById("signupInformationSubmit").addEventListener("click", handleSignup)
    document.getElementById("getVerificationCodeBoxTag").addEventListener("click", getVerificationCode)
    document.getElementById("signupVerificationCodeSubmit").addEventListener("click", VerificationCodeSubmit)

    document.getElementById("kakaoBtn").addEventListener("click", kakaoLoginAPI)
    document.getElementById("naverBtn").addEventListener("click", naverLoginAPI)
    document.getElementById("googleBtn").addEventListener("click", googleLoginAPI)

    document.getElementById("modal-close-button").addEventListener("click", closeModal)
    document.getElementById("modal-left-button").addEventListener("click", modalLeftButton)
    document.getElementById("modal-right-button").addEventListener("click", modalRightButton)
    document.getElementById('modal-skip-today').addEventListener('click', hideModalForToday)
}


function getTodayString() {
    // 오늘 날짜 가져오기
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
}

function checkSkipToday() {
    const skipToday = localStorage.getItem('signup-skip-today');
    const today = getTodayString();
    if (skipToday === today) {
        closeModal();
    }
}

function hideModalForToday() {
    closeModal();

    const today = getTodayString();
    localStorage.setItem('signup-skip-today', today);
}
window.onload = async () => {
    injectFooter()
    setEventListener()
    checkSkipToday()
    const payload = localStorage.getItem("payload");
    const payload_parse = JSON.parse(payload)
    if (payload_parse != null) {
        window.location.replace(`${FRONT_BASE_URL}/index.html`)
    }
}