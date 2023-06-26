import {
    BACK_BASE_URL, FRONT_BASE_URL, getUserProfileAPIView,
    getSubscribeView, patchSubscribeView, getMyReviewView, payload
} from "./api.js";

let today = new Date();

// 한자리 숫자인 경우 앞에 '0' 붙혀주는 함수
function leftPad(value) {
    if (value < 10) {
        value = "0" + value;
        return value;
    }
    return value;
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
    document.getElementById("user-intro").innerText = profile_data["introduction"].slice(0, 13)
    document.getElementById("user-wish").innerText = profile_data["product_wish_list_count"]
    document.getElementById("user-point").innerText = profile_data["total_point"] + "p"

}

// 리뷰수정
export async function goEditReview(product_id, review_id) {
    window.location.href = `${FRONT_BASE_URL}/writereview.html?product_id=${product_id}&review_id=${review_id}`;
}

async function pagination_review(review) {
    const review_list = document.getElementById("my-review-list")
    const buttons = document.getElementById("review-buttons");

    // 페이지네이션 페이지 설정
    const numOfContent = review.length;
    const maxContent = 5; //한 페이지에 보이는 수
    const maxButton = 5; //보이는 최대 버튼 수
    const maxPage = Math.ceil(numOfContent / maxContent);
    let page = 1;

    const Content = (id) => {
        const newCard = document.createElement("div")
        newCard.setAttribute("class", "card")
        newCard.setAttribute("id", "review")

        const newBody = document.createElement("div")
        newBody.setAttribute("class", "card-body")

        const neweditbutton = document.createElement("button")
        neweditbutton.setAttribute("class", "button")
        neweditbutton.setAttribute("id", "button-review")
        neweditbutton.innerText = "수정하기"
        neweditbutton.addEventListener("click", function () {
            goEditReview(review[id].product, review[id].id)
        })

        const newImageClass = document.createElement("div")
        newImageClass.setAttribute("class", "image")

        const newItemImage = document.createElement("img")
        newItemImage.setAttribute("class", "productimage")

        if (review[id].image == null) {
            newItemImage.setAttribute("src", "static/images/기본이미지.gif")
        } else {
            newItemImage.setAttribute("src", `${review[id].image}`)
        }

        newImageClass.appendChild(newItemImage)

        const newItemText = document.createElement("div")
        newItemText.setAttribute("class", "card-text")

        const newReviewtitle = document.createElement("div")
        newReviewtitle.setAttribute("class", "review-title")
        newReviewtitle.innerText = review[id].title

        const newReviewcontent = document.createElement("div")
        newReviewcontent.setAttribute("class", "review-content")
        newReviewcontent.innerText = review[id].content

        const newItemTitle = document.createElement("div")
        newItemTitle.setAttribute("class", "title")
        newItemTitle.innerText = "제품명: " + review[id].product_name

        const newItemStar = document.createElement("div")
        newItemStar.setAttribute("class", "star")
        newItemStar.innerText = "별점: " + review[id].product_star

        const newItemDate = document.createElement("div")
        newItemDate.setAttribute("class", "updated")
        newItemDate.innerText = "최근 수정날짜: " + (review[id].updated_at).slice(0, 10)

        newItemText.appendChild(newReviewtitle)
        newItemText.appendChild(newReviewcontent)
        newItemText.appendChild(newItemTitle)
        newItemText.appendChild(newItemStar)
        newItemText.appendChild(newItemDate)

        newBody.appendChild(newImageClass)
        newBody.appendChild(newItemText)
        newBody.appendChild(neweditbutton);

        newCard.appendChild(newBody)

        return newCard;
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
        while (review_list.hasChildNodes()) {
            review_list.removeChild(review_list.lastChild);
        }
        // 글의 최대 개수를 넘지 않는 선에서, 화면에 maxContent개의 글 생성
        for (let id = (page - 1) * maxContent + 1; id <= page * maxContent && id <= numOfContent; id++) {
            review_list.appendChild(Content(id - 1));
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

window.onload = async function () {
    profile();
    subscription_info();

    const review_data = await getMyReviewView()
    if (review_data != "") {
        pagination_review(review_data);
    }
}  