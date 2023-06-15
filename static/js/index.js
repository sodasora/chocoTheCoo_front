import { BACK_BASE_URL, FRONT_BASE_URL } from './api.js'


// 로그인 되어있다면(localstorage에 토큰이 있다면) 로그인 되어있으므로 pass
// 토큰이 없고, url에 파라미터가 있다면, 해당 값을 판별해서 해당하는 함수를 호출
if (localStorage.getItem("payload")) {
} else if (location.href.split("=")[1]) {
    const code = new URLSearchParams(window.location.search).get("code");
    const state = new URLSearchParams(window.location.search).get("state");
    const hashParams = new URLSearchParams(window.location.hash.substr(1));
    const google_token = hashParams.get("access_token");
    if (code) {
        if (state) {
            getNaverToken(code, state);
        } else {
            getKakaoToken(code);
        }
    } else if (google_token) {
        getGoogleToken(google_token);
    }
}

// 받아온 토큰을 로컬 스토리지에 저장
// 에러 발생 시, 에러 문구를 띄워주고 이전 페이지(로그인페이지)로
async function setLocalStorage(response) {
    if (response.status === 200) {
        const response_json = await response.json();
        localStorage.setItem("access", response_json.access);
        localStorage.setItem("refresh", response_json.refresh);
        const base64Url = response_json.access.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split("")
                .map(function (c) {
                    return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
                })
                .join("")
        );
        localStorage.setItem("payload", jsonPayload);
        window.location.reload();
    } else {
        alert(response_json["error"]);
        window.history.back();
    }
}

// 각각 해당하는 url로 데이터를 실어서 요청을 보내고 액세스 토큰을 받아오는 함수
async function getKakaoToken(kakao_code) {
    // Resource Server로부터 응답받은 accesstoken을 백엔드 서버로 발송
    const response = await fetch(`${BACK_BASE_URL}/api/users/kakao/login/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ code: kakao_code })
    });
    setLocalStorage(response);
}

async function getGoogleToken(google_token) {
    const response = await fetch(`${BACK_BASE_URL}/api/users/google/login/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ access_token: google_token })
    });
    setLocalStorage(response);
}

async function getNaverToken(naver_code, state) {
    const response = await fetch(`${BACK_BASE_URL}/api/users/naver/login/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ naver_code: naver_code, state: state })
    });
    setLocalStorage(response);
}