import {
    BACK_BASE_URL, FRONT_BASE_URL, getUserProfileAPIView,
    getSubscribeView, patchSubscribeView, getMyReviewView
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
    const profile_data = await getUserProfileAPIView()

    if (profile_data['profile_image'] != null) {
        document.getElementById("user-image").setAttribute("src", `${BACK_BASE_URL}` + profile_data['profile_image'])
    }

    document.getElementById("user-name").innerText = profile_data["nickname"]
    document.getElementById("user-email").innerText = profile_data["email"]
    document.getElementById("user-intro").innerText = profile_data["introduction"].slice(0, 13)
    document.getElementById("user-wish").innerText = profile_data["product_wish_list_count"]
    document.getElementById("user-point").innerText = profile_data["total_point"] + "p"

}

async function review() {
    const review_list = document.getElementById("my-review-list")

    const review_data = await getMyReviewView()
    console.log(review_data)

    review_data.forEach(e => {
        const newCard = document.createElement("div")
        newCard.setAttribute("class", "card")
        newCard.setAttribute("id", "review")

        const newBody = document.createElement("div")
        newBody.setAttribute("class", "card-body")

        const newImageClass = document.createElement("div")
        newImageClass.setAttribute("class", "image")

        const newItemImage = document.createElement("img")
        newItemImage.setAttribute("class", "productimage")

        if (e["image"] == null) {
            newItemImage.setAttribute("src", "static/images/기본이미지.gif")
        } else {
            newItemImage.setAttribute("src", `${e["image"]}`)
        }

        newImageClass.appendChild(newItemImage)

        const newItemText = document.createElement("div")
        newItemText.setAttribute("class", "card-text")

        const newReviewtitle = document.createElement("div")
        newReviewtitle.setAttribute("class", "review-title")
        newReviewtitle.innerText = e["title"]

        const newReviewcontent = document.createElement("div")
        newReviewcontent.setAttribute("class", "review-content")
        newReviewcontent.innerText = e["content"]

        const newItemTitle = document.createElement("div")
        newItemTitle.setAttribute("class", "title")
        newItemTitle.innerText = "제품명: " + e["product_name"]

        const newItemStar = document.createElement("div")
        newItemStar.setAttribute("class", "star")
        newItemStar.innerText = "별점: " + e["product_star"]

        const newItemDate = document.createElement("div")
        newItemDate.setAttribute("class", "updated")
        newItemDate.innerText = "최근 수정날짜: " + e["updated_at"].slice(0, 10)

        newItemText.appendChild(newReviewtitle)
        newItemText.appendChild(newReviewcontent)
        newItemText.appendChild(newItemTitle)
        newItemText.appendChild(newItemStar)
        newItemText.appendChild(newItemDate)

        newBody.appendChild(newImageClass)
        newBody.appendChild(newItemText)

        newCard.appendChild(newBody)
        review_list.appendChild(newCard)
    })
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
                subscription_button.addEventListener("click", againsub)
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
    profile();
    subscription_info();
    review();
}  