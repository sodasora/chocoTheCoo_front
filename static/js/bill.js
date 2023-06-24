import { BACK_BASE_URL, FRONT_BASE_URL, patchSubscribeView, getSubscribeView, getUserProfileAPIView, getBillList, billToCart } from './api.js'


async function renderBillList() {
    const bills = await getBillList();
    const billBox = document.getElementById('billLists');
    const buttons = document.getElementById("bill-buttons");

    if (bills != "") {

        // 페이지네이션 페이지 설정
        const numOfContent = bills.length;
        const maxContent = 5; //한 페이지에 보이는 수
        const maxButton = 5; //보이는 최대 버튼 수
        const maxPage = Math.ceil(numOfContent / maxContent);
        let page = 1;

        const Content = (id) => {
            const pdInfoDiv = document.createElement('div');
            pdInfoDiv.classList.add('pd-info');

            const imgDiv = document.createElement('div');
            imgDiv.style.padding = '0';
            imgDiv.style.margin = '0';

            const img = document.createElement('img');
            img.classList.add('pd-info-thumb');
            if (bills[id].thumbnail) {
                img.src = '/static/images/초콜릿.jpg'
            }
            else {
                img.src = `${bills[id].thumbnail[0]}`
            }
            imgDiv.appendChild(img);

            const textDiv = document.createElement('div');
            textDiv.classList.add('pd-info-text');
            textDiv.setAttribute('data-billId', `${bills[id].id}`);

            const firstText = document.createElement('div');
            try {
                if (bills[id].order_items_count == 1) {
                    firstText.innerText = `${bills[id].thumbnail_name}`
                }
                else {
                    firstText.innerText = `${bills[id].thumbnail_name} 외 ${bills[id].order_items_count - 1}건`;
                }
            }
            catch {
                firstText.innerText = `주문 내역에 상품이 없습니다!!`;
            }
            firstText.style.fontWeight = 'bold';
            firstText.style.fontSize = '1.2em';

            const secondText = document.createElement('div');
            secondText.innerText = `${bills[id].total_price.toLocaleString()} 원`;

            const thirdText = document.createElement('div');
            thirdText.innerText = `구매일 ${bills[id].created_at.split('T')[0]}`;

            const fourthText = document.createElement('div');
            fourthText.style.display = 'flex';
            fourthText.innerText = `상태: ${bills[id].bill_order_status}`;

            const fifthText = document.createElement('img');
            fifthText.classList.add('pd-cart-icon');
            fifthText.src = `/static/images/shopping-cart.png`;
            fifthText.setAttribute('data-orderItem', `${bills[id].order_items}`)

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
                // console.log("여기서 이제 bill_id로 정보를 받아와서 백엔드에 요청하면 될듯?ㅜㅜ");
            })

            return pdInfoDiv
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
            while (billBox.hasChildNodes()) {
                billBox.removeChild(billBox.lastChild);
            }
            // 글의 최대 개수를 넘지 않는 선에서, 화면에 maxContent개의 글 생성
            for (let id = (page - 1) * maxContent + 1; id <= page * maxContent && id <= numOfContent; id++) {
                billBox.appendChild(Content(id - 1));
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
        billBox.setAttribute("style", "font-family: 'S-CoreDream-3Light'; color: white;")
        billBox.innerText = "구매 내역이 없습니다."
    }
}

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