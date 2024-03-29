import {
    FRONT_BASE_URL, getPointView, getPointStaticView,
    postPointAttendanceView, getUserProfileAPIView,
    getSubscribeView, patchSubscribeView, payload, sellerFollowAPI, productDetail
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

    const response_point_statistic = await getPointStaticView(day)
    const response_point_statistic_json = await response_point_statistic.json()

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
                newP.innerText = `${point_date}` + " 출석: " + point[id].point.toLocaleString() + "p"
            }
            if (point[id].point_category == "텍스트리뷰") {
                newP.setAttribute("style", "color:blue;")
                newP.innerText = `${point_date}` + " 텍스트(별점)리뷰: " + point[id].point.toLocaleString() + "p"
            }
            if (point[id].point_category == "포토리뷰") {
                newP.setAttribute("style", "color:blue;")
                newP.innerText = `${point_date}` + " 포토리뷰: " + point[id].point.toLocaleString() + "p"
            }
            if (point[id].point_category == "구매") {
                newP.setAttribute("style", "color:blue;")
                newP.innerText = `${point_date}` + " 구매: " + point[id].point.toLocaleString() + "p"
            }
            if (point[id].point_category == "충전") {
                newP.setAttribute("style", "color:blue;")
                newP.innerText = `${point_date}` + " 충전: " + point[id].point.toLocaleString() + "p"
            }
            if (point[id].point_category == "구독권이용료") {
                newP.setAttribute("style", "color:red;")
                newP.innerText = `${point_date}` + " 구독권이용료: " + point[id].point.toLocaleString() + "p"
            }
            if (point[id].point_category == "결제") {
                newP.setAttribute("style", "color:red;")
                newP.innerText = `${point_date}` + " 결제: " + point[id].point.toLocaleString() + "p"
            }
            if (point[id].point_category == "정산") {
                newP.setAttribute("style", "color:blue;")
                newP.innerText = `${point_date}` + " 정산: " + point[id].point.toLocaleString() + "p"
            }
            if (point[id].point_category == "환불") {
                newP.setAttribute("style", "color:blue;")
                newP.innerText = `${point_date}` + " 환불: " + point[id].point.toLocaleString() + "p"
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
    plus_statistic.innerText = "총 획득포인트: " + response_point_statistic_json["day_plus"].toLocaleString() + "p"
    newstatistic.appendChild(plus_statistic)

    const minus_statistic = document.createElement("div")
    minus_statistic.setAttribute("class", "point-statistic")
    minus_statistic.setAttribute("id", "totalminus")
    minus_statistic.innerText = "총 이용포인트: " + response_point_statistic_json["day_minus"].toLocaleString() + "p"
    newstatistic.appendChild(minus_statistic)
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
                newP.innerText = `${point_date}` + " 출석: " + point[id].point.toLocaleString() + "p"
            }
            if (point[id].point_category == "텍스트리뷰") {
                newP.setAttribute("style", "color:blue;")
                newP.innerText = `${point_date}` + " 텍스트(별점)리뷰: " + point[id].point.toLocaleString() + "p"
            }
            if (point[id].point_category == "포토리뷰") {
                newP.setAttribute("style", "color:blue;")
                newP.innerText = `${point_date}` + " 포토리뷰: " + point[id].point.toLocaleString() + "p"
            }
            if (point[id].point_category == "구매") {
                newP.setAttribute("style", "color:blue;")
                newP.innerText = `${point_date}` + " 구매: " + point[id].point.toLocaleString() + "p"
            }
            if (point[id].point_category == "충전") {
                newP.setAttribute("style", "color:blue;")
                newP.innerText = `${point_date}` + " 충전: " + point[id].point.toLocaleString() + "p"
            }
            if (point[id].point_category == "구독권이용료") {
                newP.setAttribute("style", "color:red;")
                newP.innerText = `${point_date}` + " 구독권이용료: " + point[id].point.toLocaleString() + "p"
            }
            if (point[id].point_category == "결제") {
                newP.setAttribute("style", "color:red;")
                newP.innerText = `${point_date}` + " 결제: " + point[id].point.toLocaleString() + "p"
            }
            if (point[id].point_category == "정산") {
                newP.setAttribute("style", "color:blue;")
                newP.innerText = `${point_date}` + " 정산: " + point[id].point.toLocaleString() + "p"
            }
            if (point[id].point_category == "환불") {
                newP.setAttribute("style", "color:blue;")
                newP.innerText = `${point_date}` + " 환불: " + point[id].point.toLocaleString() + "p"
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
    plus_statistic.innerText = "오늘 획득포인트: " + response_point_statistic_json["day_plus"].toLocaleString() + "p"
    newstatistic.appendChild(plus_statistic)

    const minus_statistic = document.createElement("div")
    minus_statistic.setAttribute("class", "point-statistic")
    minus_statistic.setAttribute("id", "totalminus")
    minus_statistic.innerText = "오늘 이용포인트: " + response_point_statistic_json["day_minus"].toLocaleString() + "p"
    newstatistic.appendChild(minus_statistic)

    const newmonth_plus = document.getElementById("month-plus")
    newmonth_plus.setAttribute("class", "point-statistic")
    newmonth_plus.innerText = "이번달 획득포인트: " + response_point_statistic_json["month_plus"].toLocaleString() + "p"

    const newmonth_minus = document.getElementById("month-minus")
    newmonth_minus.setAttribute("class", "point-statistic")
    newmonth_minus.innerText = "이번달 이용포인트: " + response_point_statistic_json["month_minus"].toLocaleString() + "p"

    const new_total = document.getElementById("total-reward")
    new_total.setAttribute("class", "point-statistic")
    new_total.innerText = "현재 포인트 총액: " + response_point_statistic_json["total_point"].toLocaleString() + "p"

}

// 출석인증
async function attendancePoint() {
    const response = await postPointAttendanceView()
    if (response.status == 201) {
        alert("인증완료")
        window.location.reload()
    } else {
        alert("인증을 이미 했습니다.")
    }
}

// 프로필
async function profile() {
    const user_id = payload.user_id
    const profile_data = await getUserProfileAPIView(user_id)

    if (profile_data['profile_image'] != null) {
        document.getElementById("user-image").setAttribute("src", profile_data['profile_image'])
    }

    document.getElementById("user-name").innerText = profile_data["nickname"]
    document.getElementById("user-email").innerText = profile_data["email"]
    if (profile_data["introduction"] == "아직 소개글이 없습니다.") {
        document.getElementById("user-intro").innerText = profile_data["introduction"]
    } else {
        document.getElementById("user-intro").innerText = profile_data["introduction"].slice(0, 13) + "..."
    }
    document.getElementById("user-wish").innerText = profile_data["product_wish_list_count"]
    document.getElementById("user-point").innerText = profile_data["total_point"].toLocaleString() + "p"
}

// 위시리스트 상품 상세페이지로 이동

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
            newItemImage.setAttribute("src", wish[id].image)
        }
        const newItemName = document.createElement("div")
        newItemName.setAttribute("class", "wishname")
        newItemName.innerText = "제품명: " + (wish[id].name).slice(0, 10) + "..."
        const newItemContent = document.createElement("div")
        newItemContent.setAttribute("class", "wishtype")
        newItemContent.innerText = "제품설명: " + (wish[id].content).slice(0, 15) + "..."

        newCard.appendChild(newItemImage)
        newCard.appendChild(newItemName)
        newCard.appendChild(newItemContent)

        // 품절(2)표시
        if (wish[id].item_state == 2) {
            // 이미지 품절표시
            const soldoutImage = document.createElement("img");
            soldoutImage.setAttribute("src", "/static/images/soldout.png");
            soldoutImage.setAttribute("class", "soldout");
            newCard.prepend(soldoutImage)
            // 투명화
            newCard.style.opacity = 0.7
        }

        // 삭제(6)표시
        if (wish[id].item_state == 6) {
            // 상품이미지 삭제표시
            const deleteImg = document.createElement("img");
            deleteImg.setAttribute('src', '/static/images/품절.png');
            deleteImg.setAttribute('class', 'delete');
            imgDiv.appendChild(deleteImg);
            // 상품명 삭제표시
            const pdInfoTextDiv = document.createElement('div');
            pdInfoTextDiv.classList.add('pd-info-text');
            pdInfoTextDiv.textContent = "삭제된 상품입니다"
            infoDiv.prepend(pdInfoTextDiv);
            // 투명화
            newCard.style.opacity = 0.5
            // 체크박스 해제 및 입력기능 비활성화
            checkboxInput.checked = false;
            checkboxInput.setAttribute("disabled", "")
            amountDiv.setAttribute("disabled", "")
        }


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
async function changesub() {
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
            subscription_button.addEventListener("click", changesub)
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
                subscription_button.addEventListener("click", changesub)
            }
        }
    } else {
        newdesc.innerText = "구독 정보가 없습니다."
        subscription_button.innerText = "구독하기"
        subscription_button.addEventListener("click", gosubinfo)
    }
}

export async function mywishView() {
    document.getElementById("my-wish-box").style.display = "block"
    document.getElementById("my-bookmark-box").style.display = "none"
}

export async function showBookmarkList() {
    document.getElementById("my-bookmark-box").style.display = "block"
    document.getElementById("my-wish-box").style.display = "none"
}

export async function setEventListener() {
    document.getElementById("wishfont").addEventListener("click", mywishView)
    document.getElementById("bookmarkmarket").addEventListener("click", showBookmarkList)
}

export async function sellerFollow(element) {
    const response = await sellerFollowAPI(element.user);
    if (response.status == 404) {
        alert("판매자 정보가 삭제되었거나, 로그인이 필요합니다.")
    } else if (response.status == 422) {
        alert("판매자 사용자만 팔로우 할 수 있습니다.")
    } else if (response.status == 400) {
        alert("스스로를 팔로우 할 수 없습니다.")
    } else if (response.status == 401) {
        alert("로그인이 필요합니다.")
        window.location.replace(`${FRONT_BASE_URL}/login.html`)
    } else {
        const response_json = await response.json()
        document.getElementById(`followerCount_${element.user}`).innerText = `follower : ${response_json.followings}`
        const follow_button = document.getElementById(`sellerFollowButton_${element.user.id}`)
        response.status == 200 ? follow_button.innerText = "Follow" : follow_button.innerText = "Un Follow"
    }

}

export async function goSellerPage(user_id) {
    const url = `${FRONT_BASE_URL}/sellerpage.html?seller=${user_id}`
    window.location.href = url;
}


export async function getMyFollowList(seller_information) {
    const bookmarkList = document.getElementById("bookmarkList");
    const buttons = document.getElementById("bookmark-buttons");

    // 페이지네이션 페이지 설정
    const numOfContent = seller_information.length;
    const maxContent = 3; //한 페이지에 보이는 수
    const maxButton = 5; //보이는 최대 버튼 수
    const maxPage = Math.ceil(numOfContent / maxContent);
    let page = 1;

    const Content = (id) => {
        const element = seller_information[id];
        const company_img = element.company_img == null ? '/static/images/store.gif' : `${element.company_img}`

        const sellerCardBox = document.createElement('div');
        sellerCardBox.classList.add('seller-card-box');

        const sellerImgBox = document.createElement('div');
        sellerImgBox.classList.add('seller-img-box');
        sellerImgBox.style.backgroundImage = `url(${company_img})`;

        const sellerInformationBox = document.createElement('div');
        sellerInformationBox.classList.add('seller-information-box');

        const companyName = document.createElement('p');
        companyName.textContent = element.company_name;

        const contactNumber = document.createElement('p');
        contactNumber.textContent = element.contact_number;

        const sellerFollowButton = document.createElement('div');
        sellerFollowButton.classList.add('seller-follow');
        sellerFollowButton.textContent = 'Un Follow';
        sellerFollowButton.setAttribute("id", `sellerFollowButton_${element.user.id}`)
        sellerFollowButton.onclick = function () {
            sellerFollow(element)
        }

        const sellergoButton = document.createElement('div');
        sellergoButton.classList.add('seller-go');
        sellergoButton.textContent = 'Go';
        sellergoButton.onclick = function () {
            goSellerPage(element.user)
        }

        const followerCount = document.createElement('span');
        followerCount.id = `followerCount_${element.user}`;
        followerCount.textContent = `follower: ${element.followings}`;

        sellerInformationBox.appendChild(companyName);
        sellerInformationBox.appendChild(contactNumber);
        sellerInformationBox.appendChild(sellerFollowButton);
        sellerInformationBox.appendChild(sellergoButton);
        sellerInformationBox.appendChild(followerCount);

        sellerCardBox.appendChild(sellerImgBox);
        sellerCardBox.appendChild(sellerInformationBox);

        return sellerCardBox;
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
        while (bookmarkList.hasChildNodes()) {
            bookmarkList.removeChild(bookmarkList.lastChild);
        }
        // 글의 최대 개수를 넘지 않는 선에서, 화면에 maxContent개의 글 생성
        for (let id = (page - 1) * maxContent + 1; id <= page * maxContent && id <= numOfContent; id++) {
            bookmarkList.appendChild(Content(id - 1));
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


window.onload = async function () {
    if (payload == null) {
        alert("로그인이 필요 합니다.")
        window.location.replace(`${FRONT_BASE_URL}/login.html`)
    } else {
        buildCalendar();
        document.getElementById("prevCalendar").addEventListener("click", prevCalendar)
        document.getElementById("nextCalendar").addEventListener("click", nextCalendar)
        getToday();
        document.getElementById("Attendance").addEventListener("click", attendancePoint);
        profile();
        const user_id = payload.user_id
        const profile_data = await getUserProfileAPIView(user_id)
        const wish = profile_data["product_wish_list"]
        if (wish == "") {
            const wish_box = document.querySelector(".my-wish-none")
            wish_box.innerText = "찜한 상품이 없습니다."
        } else {
            pagination_wish(wish);
        }
        subscription_info();
        setEventListener();
        if (profile_data.followings.length == 0) {
            const bookmark_box = document.querySelector(".my-bookmark-none")
            bookmark_box.innerText = "팔로우하는 스토어가 없습니다."
        } else {
            await getMyFollowList(profile_data.followings)
        }
    }
}  