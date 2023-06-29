import { FRONT_BASE_URL, payload, OrderItemToCart, changebillstatus, patchSubscribeView, getBillDetail, getSubscribeView, getUserProfileAPIView, getMyReviewView } from './api.js'

window.onload = async function () {
    if (payload == null) {
        alert("로그인이 필요 합니다.")
        window.location.replace(`${FRONT_BASE_URL}/login.html`)
    }
    renderBillDetails();
    subscription_info();
    profile();
}

async function renderBillDetails() {
    const url = new URL(window.location.href);
    console.log(url.searchParams.get('ordered'));
    if (url.searchParams.get('ordered')) {
        alert("주문이 완료되었습니다.");
    }
    const bill_id = url.searchParams.get('bill_id');
    console.log(bill_id);
    const bill = await getBillDetail(bill_id);
    const deli = document.getElementById("deliveryInfo")

    const recipient = document.querySelector(".recipient")
    recipient.innerHTML = bill.recipient

    // const phone = document.querySelector(".phone-num")
    // phone.innerHTML = bill.phone

    const address1 = document.querySelector(".address1")
    address1.innerHTML = bill.address

    const address2 = document.querySelector(".address2")
    address2.innerHTML = bill.detail_address

    const billStatus = document.querySelector(".deli-status")
    billStatus.innerHTML = bill.bill_order_status

    const billDate = document.querySelector(".deli-date")
    const billCreated = bill.created_at.split('T')[0]
    billDate.innerHTML = billCreated

    renderBillOrders(bill);
}

export async function gowritereview(product_id) {
    window.location.href = `${FRONT_BASE_URL}/writereview.html?product_id=${product_id}`
}

async function renderBillOrders(bill) {
    const orderListBox = document.getElementById("orderLists")
    const orderItemList = bill.order_items
    orderItemList.forEach(e => {
        const orderList = document.createElement("div")
        orderList.classList.add("order-list")

        const imgDiv = document.createElement('div');
        imgDiv.style.padding = '0';
        imgDiv.style.margin = '0';

        const img = document.createElement('img');
        img.classList.add('pd-info-thumb');
        if (e.image) {
            img.src = `${e.image}`
        }
        else {
            img.src = '/static/images/초콜릿.jpg'
        }
        imgDiv.appendChild(img);

        const firstText = document.createElement('div');
        firstText.innerText = `${e.name}`
        firstText.style.fontWeight = 'bold';
        firstText.style.fontSize = '1.2em';

        const secondText = document.createElement('div');
        secondText.innerText = `${(e.price).toLocaleString()} 원`;

        const thirdText = document.createElement('div');
        thirdText.innerText = `${e.amount}개`

        const fourthText = document.createElement('div');
        fourthText.style.display = 'flex';
        fourthText.innerText = `상태: ${e.order_status}`;

        const fifthText = document.createElement('img');
        fifthText.classList.add('pd-cart-icon');
        fifthText.src = `/static/images/shopping-cart.png`;
        fifthText.setAttribute('data-orderItem', `${e.order_items}`)
        fifthText.addEventListener('click', () => OrderItemToCart(e.id))

        const textDiv = document.createElement('div');
        textDiv.classList.add('order-context')
        textDiv.appendChild(firstText)
        textDiv.appendChild(secondText)
        textDiv.appendChild(thirdText);
        textDiv.appendChild(fourthText)

        const content = document.createElement("div")
        content.setAttribute("id", "button-content")
        content.appendChild(fifthText)

        const productId = e.product_id

        if (e.order_status == "구매확정") {
            // 리뷰 작성 가기
            const goreview = document.createElement('button');
            goreview.innerText = `리뷰쓰기`;
            goreview.setAttribute(`id`, 'reviewbutton');

            goreview.onclick = function () {
                gowritereview(productId)
            }
            content.appendChild(goreview)
        } else if (e.order_status == "배송완료") {
            const productId = e.id;
            const goconfirm = document.createElement('button');
            goconfirm.innerText = `구매확정하기`;
            goconfirm.setAttribute(`id`, 'confirmbutton');
            goconfirm.onclick = async function () {
                await changebillstatus(productId, 6)
                window.location.reload();
            }
            content.appendChild(goconfirm)
        }

        orderList.appendChild(imgDiv);
        orderList.appendChild(textDiv);
        orderList.appendChild(content);
        orderListBox.appendChild(orderList);
    });

}

let today = new Date();

function leftPad(value) {
    if (value < 10) {
        value = "0" + value;
        return value;
    }
    return value;
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

// 프로필
async function profile() {
    const user_id = payload.user_id
    const profile_data = await getUserProfileAPIView(user_id)

    if (profile_data.profile_image != null) {
        document.getElementById("user-image").setAttribute("src", profile_data['profile_image'])
    }

    document.getElementById("user-name").innerText = profile_data.nickname
    document.getElementById("user-email").innerText = profile_data.email
    if (profile_data["introduction"] == "아직 소개글이 없습니다.") {
        document.getElementById("user-intro").innerText = profile_data.introduction
    } else {
        document.getElementById("user-intro").innerText = profile_data.introduction.slice(0, 13) + "..."
    }
    document.getElementById("user-wish").innerText = profile_data.product_wish_list_count
    document.getElementById("user-point").innerText = profile_data.total_point + "p"
}