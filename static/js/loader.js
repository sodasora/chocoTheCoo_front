import { BACK_BASE_URL, FRONT_BASE_URL, getPointStaticView, getUserProfileAPIView } from './api.js'


// 현재 내 포인트 확인 함수
async function getPoint() {

    // 오늘 날짜 형식맞추기 0000-00-00
    let today = new Date();
    let year = today.getFullYear();
    let month = String(today.getMonth() + 1).padStart(2, '0'); //두자리되도록 앞에0채우기
    let date = String(today.getDate()).padStart(2, '0'); //두자리되도록 앞에0채우기
    today = `${year}-${month}-${date}`;

    const mypoint = await getPointStaticView(today)
    const mypoint_json = await mypoint.json()

    const point = document.getElementById("point")
    point.innerText = `내 포인트 : ${mypoint_json.total_point.toLocaleString({ style: 'currency' })} P`
}


/* 헤더 가져오기 */
async function injectHeader() {
    fetch("./header.html")
        .then((response) => {
            return response.text();
        })
        .then((data) => {
            document.querySelector("header").innerHTML = data;
        })

    let headerHtml = await fetch("./header.html")
    let data = await headerHtml.text()
    document.querySelector("header").innerHTML = data;

    // 메인 타이틀 클릭 시 홈으로
    const title = document.getElementById("nav-title")
    title.addEventListener("click", function () {
        window.location.replace(`${FRONT_BASE_URL}`)
    })

    const payload = localStorage.getItem("payload");
    // payload가 존재 = 로그인되어있다면
    if (payload) {
        const payload_parse = JSON.parse(payload)

        const intro = document.getElementById("intro")
        intro.innerText = `${payload_parse.nickname}님`

        // 회원가입과 로그인 버튼 숨기기
        const signup = document.getElementById("signup")
        const login = document.getElementById("login")
        signup.style.display = "none";
        login.style.display = "none";
        
        const mobileSignup = document.getElementById("mobileSignUp")
        const mobileLogin = document.getElementById("mobileLogin")
        mobileSignup.style.display = "none";
        mobileLogin.style.display = "none";

        // 로그아웃
        const logout = document.getElementById("logout")
        logout.addEventListener("click", function () {
            handleLogout()
        })
        
        const mobileLogout = document.getElementById("mobileLogout")
        mobileLogout.addEventListener("click", function () {
            handleLogout()
        })

        getPoint()

        // console.log(payload_parse)
        // 판매자가 아니라면 판매자등록페이지로 이동
        if (!payload_parse.is_seller) {
            const onlyseller = document.getElementById("seller")
            onlyseller.addEventListener("click", function () {
                window.location.href = "user_detail_page.html"
            })
        }

    } else {
        // 비로그인 상태에서 장바구니,마이페이지,판매자페이지,로그아웃 숨기기
        // 비로그인 상태에서 내 포인트,포인트충전 숨기기
        const cart = document.getElementById("cart")
        const mypage = document.getElementById("mypage")
        const point = document.getElementById("point")
        const charge = document.getElementById("charge")
        const chats = document.getElementById("chatting")
        const CBTI = document.getElementById("CBTI")
        const onlyseller = document.getElementById("seller")

        logout.style.display = "none"
        point.remove()
        cart.remove()

        function login() {
            window.location.href = "login.html"
        }

        mypage.addEventListener("click", login)
        charge.addEventListener("click", login)
        chats.addEventListener("click", login)
        CBTI.addEventListener("click", login)
        onlyseller.addEventListener("click", login)

    }
}
injectHeader();




// 로그아웃
export async function handleLogout() {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("payload");
    window.location.replace(`${FRONT_BASE_URL}/login.html`);
}

/* 푸터 가져오기 */
async function injectFooter() {
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
injectFooter();

// 최상위 일 때 back to top 위로 버튼 비활성화
window.addEventListener('scroll', function () {
    const upbtn = document.getElementById("upbtn");
    if (window.pageYOffset == document.body.scrollTop) {
        upbtn.classList.remove("show");
    } else {
        upbtn.classList.add("show");
    }
});


// 로그인 잔여시간 함수
function getTime() {
    const payload = localStorage.getItem("payload");
    const payload_parse = JSON.parse(payload)
    const tokenLifeTime = document.getElementById("tokenLifeTime")
    if (payload_parse != null) {
        // NumericDate 형식
        // exp 1970년 ~  토큰이 만료되는 초(sec)
        let exp = payload_parse.exp
        // iat 1970년 ~ 토큰 발급 날짜까지의 초(sec)
        let iat = payload_parse.iat

        // NumericDate 형식의 현재 시간(sec) 구하기
        const now = Math.floor(Date.now() / 1000);

        // 토큰의 남은 만료기간 구하기
        const lifeTime = (exp - now) / 60

        // 토큰 유효기간이 지났다면 토큰 정보 삭제
        if (lifeTime < 0) {

            localStorage.removeItem("access")
            localStorage.removeItem("refresh")
            localStorage.removeItem("payload")
            location.reload();
            // 토큰 유효기간이 지나지 않았다면 남은 로그인 시간 출력
        } else {
            const MIN = parseInt(lifeTime)
            const SEC = parseInt(lifeTime % 1 * 60)
            tokenLifeTime.textContent = `로그인 남은 시간 : ${MIN}분 ${SEC}초`
        }
    } else {
        tokenLifeTime.style.display = "none"
    }
}
function init() {
    setInterval(getTime, 1000)
}
init();




