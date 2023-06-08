import { BACK_BASE_URL, FRONT_BASE_URL, handleLogin } from './api.js'

document.getElementById("login").addEventListener("click",handleLoginBtn)

// 로그인 폼 기입 후 로그인 눌렀을 때 실행되는 함수
async function handleLoginBtn() {
    const response = await handleLogin();

    if (response.status == 200) {
        const response_json = await response.json()

        localStorage.setItem("access", response_json.access);
        localStorage.setItem("refresh", response_json.refresh);

        const base64Url = response_json.access.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        localStorage.setItem("payload", jsonPayload)
        alert("환영합니다!")
        window.location.replace(`${FRONT_BASE_URL}/`)
    } else {
        alert("회원정보가 일치하지 않습니다!")
    }
}