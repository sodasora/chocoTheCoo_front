import {
    BACK_BASE_URL, FRONT_BASE_URL, getPointView, getPointStaticView,
    postPointAttendanceView, getUserProfileAPIView,
    getSubscribeView, patchSubscribeView,
} from "./api.js";

// 달력
let nowMonth = new Date();  // 현재 달을 페이지를 로드한 날의 달로 초기화 
let today = new Date();     // 페이지를 로드한 날짜를 저장
today.setHours(0, 0, 0, 0);    // 비교 편의를 위해 today의 시간을 초기화

// 달력 생성 : 해당 달에 맞춰 테이블을 만들고, 날짜를 채워 넣는다.
function buildCalendar() {

    let firstDate = new Date(nowMonth.getFullYear(), nowMonth.getMonth(), 1);     // 이번달 1일
    let lastDate = new Date(nowMonth.getFullYear(), nowMonth.getMonth() + 1, 0);  // 이번달 마지막날

    let tbody_Calendar = document.querySelector(".Calendar > tbody");
    document.getElementById("calYear").innerText = nowMonth.getFullYear();             // 연도 숫자 갱신
    document.getElementById("calMonth").innerText = leftPad(nowMonth.getMonth() + 1);  // 월 숫자 갱신

    while (tbody_Calendar.rows.length > 0) {                        // 이전 출력결과가 남아있는 경우 초기화
        tbody_Calendar.deleteRow(tbody_Calendar.rows.length - 1);
    }

    let nowRow = tbody_Calendar.insertRow();        // 첫번째 행 추가           

    for (let j = 0; j < firstDate.getDay(); j++) {  // 이번달 1일의 요일만큼
        let nowColumn = nowRow.insertCell();        // 열 추가
    }

    for (let nowDay = firstDate; nowDay <= lastDate; nowDay.setDate(nowDay.getDate() + 1)) {   // day는 날짜를 저장하는 변수, 이번달 마지막날까지 증가시키며 반복  

        let nowColumn = nowRow.insertCell();        // 새 열을 추가하고
        nowColumn.innerText = leftPad(nowDay.getDate());      // 추가한 열에 날짜 입력


        if (nowDay.getDay() == 0) {                 // 일요일인 경우 글자색 빨강으로
            nowColumn.style.color = "#DC143C";
        }
        if (nowDay.getDay() == 6) {                 // 토요일인 경우 글자색 파랑으로 하고
            nowColumn.style.color = "#0000CD";
            nowRow = tbody_Calendar.insertRow();    // 새로운 행 추가
        }

        nowColumn.className = "Day";
        nowColumn.onclick = function () {
            choiceDate(this);
        }
    }
}

// 날짜 선택
function choiceDate(nowColumn) {
    if (document.getElementsByClassName("choiceDay")[0]) {                              // 기존에 선택한 날짜가 있으면
        document.getElementsByClassName("choiceDay")[0].classList.remove("choiceDay");  // 해당 날짜의 "choiceDay" class 제거
    }
    nowColumn.classList.add("choiceDay"); // 선택된 날짜에 "choiceDay" class 추가
    Choicelist();
}

// 이전달 버튼 클릭
function prevCalendar() {
    nowMonth = new Date(nowMonth.getFullYear(), nowMonth.getMonth() - 1, nowMonth.getDate());   // 현재 달을 1 감소
    buildCalendar();    // 달력 다시 생성
}

// 다음달 버튼 클릭
function nextCalendar() {
    nowMonth = new Date(nowMonth.getFullYear(), nowMonth.getMonth() + 1, nowMonth.getDate());   // 현재 달을 1 증가
    buildCalendar();    // 달력 다시 생성
}

// 한자리 숫자인 경우 앞에 '0' 붙혀주는 함수
function leftPad(value) {
    if (value < 10) {
        value = "0" + value;
        return value;
    }
    return value;
}

// 선택한 날짜의 포인트 정보 보여주기
async function Choicelist() {
    const year = document.getElementById("calYear").innerText
    const month = document.getElementById("calMonth").innerText
    const date = document.getElementsByClassName("choiceDay")[0].innerText
    const day = year + '-' + month + '-' + date

    const response_point = await getPointView(day)
    const point = await response_point.json()
    //console.log(response_point_json)

    const response_point_statistic = await getPointStaticView(day)
    const response_point_statistic_json = await response_point_statistic.json()
    //console.log(response_point_statistic_json)

    const newlist = document.getElementById('points-list')
    const newcheck = document.getElementById('checkpoint')
    newcheck.innerText = `${day} 포인트내역`

    if (point != "") {
        const newlist = document.getElementById('points-list');
        const buttons = document.getElementById("point-buttons");

        // 페이지네이션 페이지 설정
        const numOfContent = point.length;
        const maxContent = 5; //한 페이지에 보이는 수
        const maxButton = 5; //보이는 최대 버튼 수
        const maxPage = Math.ceil(numOfContent / maxContent);
        let page = 1;

        const Content = (id) => {
            //"""포인트 종류: 출석(1), 텍스트리뷰(2), 포토리뷰(3), 구매(4), 충전(5), 구독권이용료(6), 결제(7)"""
            const point_date = (point[id].created_at).slice(11, 19)
            const newP = document.createElement("p")
            newP.setAttribute("class", "pointinfo")
            if (point[id].point_category == "출석") {
                newP.setAttribute("style", "color:blue;")
                newP.innerText = `${point_date}` + " 출석: " + point[id].point + "p"
            }
            if (point[id].point_category == "텍스트리뷰") {
                newP.setAttribute("style", "color:blue;")
                newP.innerText = `${point_date}` + " 텍스트(별점)리뷰: " + point[id].point + "p"
            }
            if (point[id].point_category == "포토리뷰") {
                newP.setAttribute("style", "color:blue;")
                newP.innerText = `${point_date}` + " 포토리뷰: " + point[id].point + "p"
            }
            if (point[id].point_category == "구매") {
                newP.setAttribute("style", "color:blue;")
                newP.innerText = `${point_date}` + " 구매: " + point[id].point + "p"
            }
            if (point[id].point_category == "충전") {
                newP.setAttribute("style", "color:blue;")
                newP.innerText = `${point_date}` + " 충전: " + point[id].point + "p"
            }
            if (point[id].point_category == "구독권이용료") {
                newP.setAttribute("style", "color:red;")
                newP.innerText = `${point_date}` + " 구독권이용료: " + point[id].point + "p"
            }
            if (point[id].point_category == "결제") {
                newP.setAttribute("style", "color:red;")
                newP.innerText = `${point_date}` + " 결제: " + point[id].point + "p"
            }
            return newP
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
    } else {
        newlist.innerText = `${day} 포인트 내역이 없습니다.`
    }

    const newstatistic = document.getElementById("statistic-list")
    newstatistic.innerText = `${day}  포인트 통계`

    const plus_statistic = document.createElement("div")
    plus_statistic.setAttribute("class", "point-statistic")
    plus_statistic.setAttribute("id", "totalplus")
    plus_statistic.innerText = "총 획득포인트: " + response_point_statistic_json["day_plus"] + "p"
    newstatistic.appendChild(plus_statistic)

    const minus_statistic = document.createElement("div")
    minus_statistic.setAttribute("class", "point-statistic")
    minus_statistic.setAttribute("id", "totalminus")
    minus_statistic.innerText = "총 이용포인트: " + response_point_statistic_json["day_minus"] + "p"
    newstatistic.appendChild(minus_statistic)

    const statistic = document.createElement("div")
    statistic.setAttribute("class", "point-statistic")
    statistic.setAttribute("id", "totalpoint")
    statistic.innerText = "총포인트: " + response_point_statistic_json["day_total_point"] + "p"
    newstatistic.appendChild(statistic)

}


// 오늘 포인트 정보
async function getToday() {
    const nowyear = today.getFullYear()
    const nowmonth = leftPad(today.getMonth() + 1)
    const nowdate = leftPad(today.getDate())

    const nowday = nowyear + '-' + nowmonth + '-' + nowdate
    const response_point = await getPointView(nowday)
    const point = await response_point.json()

    const response_point_statistic = await getPointStaticView(nowday)
    const response_point_statistic_json = await response_point_statistic.json()
    //console.log(response_point_statistic_json)

    const newlist = document.getElementById('points-list')
    const newcheck = document.getElementById('checkpoint')
    newcheck.innerText = "오늘의 포인트내역"

    if (point != "") {
        const newlist = document.getElementById('points-list');
        const buttons = document.getElementById("point-buttons");

        // 페이지네이션 페이지 설정
        const numOfContent = point.length;
        const maxContent = 5; //한 페이지에 보이는 수
        const maxButton = 5; //보이는 최대 버튼 수
        const maxPage = Math.ceil(numOfContent / maxContent);
        let page = 1;

        const Content = (id) => {
            //"""포인트 종류: 출석(1), 텍스트리뷰(2), 포토리뷰(3), 구매(4), 충전(5), 구독권이용료(6), 결제(7)"""
            const point_date = (point[id].created_at).slice(11, 19)
            const newP = document.createElement("p")
            newP.setAttribute("class", "pointinfo")
            if (point[id].point_category == "출석") {
                newP.setAttribute("style", "color:blue;")
                newP.innerText = `${point_date}` + " 출석: " + point[id].point + "p"
            }
            if (point[id].point_category == "텍스트리뷰") {
                newP.setAttribute("style", "color:blue;")
                newP.innerText = `${point_date}` + " 텍스트(별점)리뷰: " + point[id].point + "p"
            }
            if (point[id].point_category == "포토리뷰") {
                newP.setAttribute("style", "color:blue;")
                newP.innerText = `${point_date}` + " 포토리뷰: " + point[id].point + "p"
            }
            if (point[id].point_category == "구매") {
                newP.setAttribute("style", "color:blue;")
                newP.innerText = `${point_date}` + " 구매: " + point[id].point + "p"
            }
            if (point[id].point_category == "충전") {
                newP.setAttribute("style", "color:blue;")
                newP.innerText = `${point_date}` + " 충전: " + point[id].point + "p"
            }
            if (point[id].point_category == "구독권이용료") {
                newP.setAttribute("style", "color:red;")
                newP.innerText = `${point_date}` + " 구독권이용료: " + point[id].point + "p"
            }
            if (point[id].point_category == "결제") {
                newP.setAttribute("style", "color:red;")
                newP.innerText = `${point_date}` + " 결제: " + point[id].point + "p"
            }
            return newP
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
    } else {
        newlist.innerText = `${nowday} 오늘의 포인트 내역이 없습니다.`
    }

    const newstatistic = document.getElementById("statistic-list")
    newstatistic.innerText = `오늘의 포인트 통계`

    const plus_statistic = document.createElement("div")
    plus_statistic.setAttribute("class", "point-statistic")
    plus_statistic.setAttribute("id", "totalplus")
    plus_statistic.innerText = "오늘 획득포인트: " + response_point_statistic_json["day_plus"] + "p"
    newstatistic.appendChild(plus_statistic)

    const minus_statistic = document.createElement("div")
    minus_statistic.setAttribute("class", "point-statistic")
    minus_statistic.setAttribute("id", "totalminus")
    minus_statistic.innerText = "오늘 이용포인트: " + response_point_statistic_json["day_minus"] + "p"
    newstatistic.appendChild(minus_statistic)

    const statistic = document.createElement("div")
    statistic.setAttribute("class", "point-statistic")
    statistic.setAttribute("id", "totalpoint")
    statistic.innerText = "오늘 총포인트: " + response_point_statistic_json["day_total_point"] + "p"
    newstatistic.appendChild(statistic)

    const newmonth_total = document.getElementById("month-total")
    newmonth_total.setAttribute("class", "point-statistic")
    newmonth_total.setAttribute("style", "font-size:2vw;")
    newmonth_total.innerText = "이번달 총 리워드: " + response_point_statistic_json["month_total_point"] + "p"

    const new_total = document.getElementById("total-reward")
    new_total.setAttribute("class", "point-statistic")
    new_total.setAttribute("style", "font-size:2vw;")
    new_total.innerText = "총 리워드: " + response_point_statistic_json["total_point"] + "p"

}

// 출석인증
async function attendancePoint() {
    const response = await postPointAttendanceView()
    //console.log(response)
    if (response.status == 201) {
        alert("인증완료")
        window.location.reload()
    } else {
        alert("인증을 이미 했습니다.")
    }
}

// 프로필
async function profile() {
    const profile_data = await getUserProfileAPIView()

    if (profile_data['profile_image'] != null) {
        document.getElementById("user-image").setAttribute("src", `${BACK_BASE_URL}` + profile_data['profile_image'])
    }

    document.getElementById("user-name").innerText = profile_data["nickname"]
    document.getElementById("user-email").innerText = profile_data["email"]
    if (profile_data["introduction"] == "아직 소개글이 없습니다.") {
        document.getElementById("user-intro").innerText = profile_data["introduction"]
    } else {
        document.getElementById("user-intro").innerText = profile_data["introduction"].slice(0, 13) + "..."
    }
    document.getElementById("user-wish").innerText = profile_data["product_wish_list_count"]
    document.getElementById("user-point").innerText = profile_data["total_point"] + "p"
}

// 위시리스트 상품 상세페이지로 이동
export async function productDetail(product_id) {
    window.location.href = `${FRONT_BASE_URL}/productdetail.html?product_id=${product_id}`
}

async function pagination_wish(wish) {
    const wish_list = document.getElementById("my-wish-list")
    const buttons = document.getElementById("wish-buttons");

    // 페이지네이션 페이지 설정
    const numOfContent = wish.length;
    const maxContent = 3; //한 페이지에 보이는 수
    const maxButton = 5; //보이는 최대 버튼 수
    const maxPage = Math.ceil(numOfContent / maxContent);
    let page = 1;

    const Content = (id) => {
        const newCol = document.createElement("div")
        newCol.setAttribute("class", "col")

        const newCard = document.createElement("div")
        newCard.setAttribute("class", "card")
        newCard.setAttribute("id", "wishitem")

        const newItemImage = document.createElement("img")
        newItemImage.setAttribute("class", "wishimage")
        if (wish[id].image == null) {
            newItemImage.setAttribute("src", "static/images/기본이미지.gif")
        } else {
            newItemImage.setAttribute("src", `${BACK_BASE_URL}${wish[id].image}`)
        }
        const newItemName = document.createElement("div")
        newItemName.setAttribute("class", "wishname")
        newItemName.innerText = "제품명: " + wish[id].name
        const newItemContent = document.createElement("div")
        newItemContent.setAttribute("class", "wishtype")
        newItemContent.innerText = "제품설명: " + (wish[id].content).slice(0, 15) + "..."

        newCard.appendChild(newItemImage)
        newCard.appendChild(newItemName)
        newCard.appendChild(newItemContent)
        newCard.onclick = function () {
            productDetail(wish[id].id);
        };
        newCol.appendChild(newCard)
        return newCol;
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
        while (wish_list.hasChildNodes()) {
            wish_list.removeChild(wish_list.lastChild);
        }
        // 글의 최대 개수를 넘지 않는 선에서, 화면에 maxContent개의 글 생성
        for (let id = (page - 1) * maxContent + 1; id <= page * maxContent && id <= numOfContent; id++) {
            wish_list.appendChild(Content(id - 1));
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


// 구독
async function nosub() {
    const response = await patchSubscribeView();
    if (response.status == 200) {
        window.location.reload();
    }
}

async function againsub() {
    const response = await patchSubscribeView();
    if (response.status == 200) {
        window.location.reload();
    }
}

async function gosubinfo() {
    window.location.href = 'subscriptioninfo.html'
}

async function subscription_info() {
    const subscription_data = await getSubscribeView()
    //console.log(subscription_data)

    const newcard = document.getElementById("subscription-card")

    const newdesc = document.createElement("div")
    newdesc.setAttribute("class", "subscription-desc")
    newdesc.innerText = "구독정보: "
    newcard.appendChild(newdesc)

    const subscription_button = document.getElementById("sub-button")

    if (subscription_data != "") {
        if (subscription_data["subscribe"] == true) {
            const newsubscriptview = document.createElement("div")
            newsubscriptview.setAttribute("class", "subscrip-view")
            newsubscriptview.innerText = `${subscription_data["updated_at"].slice(0, 10)} 
                                            ~
                                            ${subscription_data["next_payment"]} 00:00 까지`

            const newsubscriptdate = document.createElement("div")
            newsubscriptdate.setAttribute("class", "subscrip-date")
            newsubscriptdate.innerText = "다음 결제일: " + subscription_data["next_payment"]

            newcard.appendChild(newsubscriptview)
            newcard.appendChild(newsubscriptdate)

            subscription_button.innerText = "구독 해지"
            subscription_button.addEventListener("click", nosub)
        } else {
            const nowyear = today.getFullYear()
            const nowmonth = leftPad(today.getMonth() + 1)
            const nowdate = leftPad(today.getDate())
            const nowday = nowyear + '-' + nowmonth + '-' + nowdate
            if (subscription_data["next_payment"] < nowday) {
                const newsubscriptview = document.createElement("div")
                newsubscriptview.setAttribute("class", "subscrip-view")
                newsubscriptview.innerText = "구독을 해지했습니다"

                const newsubscriptdate = document.createElement("div")
                newsubscriptdate.setAttribute("class", "subscrip-date")
                newsubscriptdate.innerText = `이전 구독 정보:
                                        ${subscription_data["updated_at"].slice(0, 10)}
                                        ~ 
                                        ${subscription_data["next_payment"]} 00:00까지`

                newcard.appendChild(newsubscriptview)
                newcard.appendChild(newsubscriptdate)

                subscription_button.innerText = "구독하기"
                subscription_button.addEventListener("click", gosubinfo)
            } else {
                const newsubscriptview = document.createElement("div")
                newsubscriptview.setAttribute("class", "subscrip-view")
                newsubscriptview.innerText = "구독해지 예약완료"

                const newsubscriptdate = document.createElement("div")
                newsubscriptdate.setAttribute("class", "subscrip-date")
                newsubscriptdate.innerText = `${subscription_data["updated_at"].slice(0, 10)}
                                            ~ 
                                            ${subscription_data["next_payment"]} 00:00까지`

                newcard.appendChild(newsubscriptview)
                newcard.appendChild(newsubscriptdate)

                subscription_button.innerText = "구독하기"
                subscription_button.addEventListener("click", againsub)
            }
        }
    } else {
        newdesc.innerText = "구독 정보가 없습니다."
        subscription_button.innerText = "구독하기"
        subscription_button.addEventListener("click", gosubinfo)
    }
}

window.onload = async function () {
    buildCalendar();
    document.getElementById("prevCalendar").addEventListener("click", prevCalendar)
    document.getElementById("nextCalendar").addEventListener("click", nextCalendar)
    getToday();
    document.getElementById("Attendance").addEventListener("click", attendancePoint);
    profile();
    const profile_data = await getUserProfileAPIView()
    const wish = profile_data["product_wish_list"]
    pagination_wish(wish);
    subscription_info()
}  