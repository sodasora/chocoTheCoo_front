import { BACK_BASE_URL, FRONT_BASE_URL, getSubscribeView, getUserProfileAPIView, getBillList, billToCart } from './api.js'

async function renderBillList() {
    const bills = await getBillList();
    const billBox = document.getElementById('billLists');
    bills.forEach(e => {
        const pdInfoDiv = document.createElement('div');
        pdInfoDiv.classList.add('pd-info');

        const imgDiv = document.createElement('div');
        imgDiv.style.padding = '0';
        imgDiv.style.margin = '0';

        const img = document.createElement('img');
        img.classList.add('pd-info-thumb');
        if (e.thumbnail) {
            img.src = '/static/images/초콜릿.jpg'
        }
        else {
            img.src = `${e.thumbnail[0]}`
        }
        imgDiv.appendChild(img);

        const textDiv = document.createElement('div');
        textDiv.classList.add('pd-info-text');
        textDiv.setAttribute('data-billId', `${e.id}`);

        const firstText = document.createElement('div');
        try {
            if (e.order_items_count == 1) {
                firstText.innerText = `${e.thumbnail_name}`
            }
            else {
                firstText.innerText = `${e.thumbnail_name} 외 ${e.order_items_count - 1}건`;
            }
        }
        catch {
            firstText.innerText = `주문 내역에 상품이 없습니다!!`;
        }
        firstText.style.fontWeight = 'bold';
        firstText.style.fontSize = '1.2em';

        const secondText = document.createElement('div');
        secondText.innerText = `${e.total_price.toLocaleString()} 원`;

        const thirdText = document.createElement('div');
        thirdText.innerText = `구매일 ${e.created_at.split('T')[0]}`;

        const fourthText = document.createElement('div');
        fourthText.style.display = 'flex';
        fourthText.innerText = `상태: ${e.bill_order_status}`;

        const fifthText = document.createElement('img');
        fifthText.classList.add('pd-cart-icon');
        fifthText.src = `/static/images/shopping-cart.png`;
        fifthText.setAttribute('data-orderItem', `${e.order_items}`)

        const cartDiv = document.createElement('div')
        cartDiv.classList.add('add-to-cart');

        textDiv.appendChild(firstText);
        textDiv.appendChild(secondText);
        textDiv.appendChild(thirdText);
        textDiv.appendChild(fourthText);
        cartDiv.appendChild(fifthText);

        pdInfoDiv.appendChild(imgDiv);
        pdInfoDiv.appendChild(textDiv);
        pdInfoDiv.appendChild(cartDiv);

        billBox.appendChild(pdInfoDiv);

        textDiv.addEventListener('click', async function (e) {
            const billId = e.currentTarget.dataset.billid
            if (billId) {
                window.location.href = `${FRONT_BASE_URL}/bill_detail.html?bill_id=${billId}`;
            }
            else {
                alert('잘못된 요청입니다.');
            }
        })
        fifthText.addEventListener('click', async function (e) {
            const orderItem = e.currentTarget.dataset.orderitem;
            billToCart(orderItem);
            console.log("여기서 이제 bill_id로 정보를 받아와서 백엔드에 요청하면 될듯?ㅜㅜ");
        })
    })
};

window.onload = async function () {
    renderBillList();
    subscription_info();
    profile();
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

// 프로필
async function profile() {
    const profile_data = await getUserProfileAPIView()
    console.log(profile_data)

    if (profile_data.profile_image != null) {
        document.getElementById("user-image").setAttribute("src", `${BACK_BASE_URL}` + profile_data['profile_image'])
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