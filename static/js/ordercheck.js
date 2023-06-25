import {
    BACK_BASE_URL,
    makeBills,
    makeOrders,
    getCheckedCart,
    payload,
    access_token,
    FRONT_BASE_URL,
    getPointStaticView,
} from "./api.js"

async function getDeliveryData(element) {
    const postal_code = document.getElementById("postalCode");
    postal_code.value = element.postal_code;
    const address = document.getElementById("address");
    address.value = element.address;
    const detail_address = document.getElementById("detailAddress");
    detail_address.value = element.detail_address;
    const recipient = document.getElementById("recipient");
    recipient.value = element.recipient;
    const delivery_id = document.getElementById("orderDeliveryId");
    delivery_id.setAttribute("data-deliveryId", element.id)
}

async function DeliveryInformation(response_json) {
    const dropdown_content = document.querySelector(".dropdown-content");
    const delivery_data = response_json;

    Object.values(delivery_data).forEach((element) => {
        const dropdown_item = document.createElement("p");
        dropdown_item.classList.add("dropdown-item", "centered");
        dropdown_item.id = `delivery_${element.id}`;
        dropdown_item.setAttribute("data-hidden-value", element);
        dropdown_item.innerText = element.address;

        dropdown_item.addEventListener("click", function () {
            getDeliveryData(element);
            dropdown_content.style.display = "none";
            document.getElementById("Postcode").style.display = "none";
        });

        dropdown_content.appendChild(dropdown_item);
    });

    getDeliveryData(Object.values(delivery_data)[0]);
}

//* 유저 배송정보 조회, 머지하면 똑같은거 있을거같아서 일단 api로 안넘겼습니다
async function getUserDeliveryInformationAPI(user_id) {
    const response = await fetch(`${BACK_BASE_URL}/api/users/create/delivery/${user_id}/`, {
        headers: {
            'content-type': 'application/json',
            "Authorization": "Bearer " + localStorage.getItem("access")
        },
        method: 'GET',
    });
    return response;
}

async function loadCheckedCart() {
    const url = new URL(window.location.href);
    const queryString = url.search.substring(1);
    const checkedCart = await getCheckedCart(queryString);
    const cartCheck = document.getElementById("orderCart")
    checkedCart.forEach((e) => {
        const row = document.createElement("div");
        row.classList.add("cart-check", "checked-cart-items");

        const col1 = document.createElement("div");
        col1.classList.add("col-2", "centered");
        col1.style.cursor = ""
        col1.textContent = e.product.name;
        const col1image = document.createElement("img");

        if (e.product.image) {
            col1image.classList.add("product-img");
            col1image.setAttribute("src", `${e.product.image}`);
        }
        const col2 = document.createElement("div");
        col2.classList.add("col-2", "centered");
        col2.textContent = e.amount;

        const col3 = document.createElement("div");
        col3.classList.add("col-2", "centered", "product-price");
        col3.setAttribute("data-price", e.aggregate_price);
        col3.textContent = `${e.aggregate_price.toLocaleString()}원`

        const line = document.createElement("hr");

        col1.appendChild(col1image);
        row.appendChild(col1);
        row.appendChild(col2);
        row.appendChild(col3);

        col1.addEventListener("mouseover", function () {
            col1image.style.display = "block";
        })
        col1.addEventListener("mouseleave", function () {
            col1image.style.display = "none";
        })

        cartCheck.appendChild(row);
        cartCheck.appendChild(line);
    })
    return renderPaymentInfo();
}


async function makePurchaseOrder() {
    const deli = document.getElementById("orderDeliveryId").getAttribute("data-deliveryId");
    if (deli == 0) {
        const recipient = document.getElementById("recipient").value
        const postcode = document.getElementById("postalCode").value
        const address = document.getElementById("address").value
        const detailAddress = document.getElementById("detailAddress").value
        const delivery_data = {
            recipient: recipient,
            postcode: postcode,
            address: address,
            detailAddress: detailAddress
        };
        let bill = await makeBills(null, delivery_data)
        const url = new URL(window.location.href);
        const queryString = url.search.substring(1);
        makeOrders(queryString, bill.id);
    } else {
        let bill = await makeBills(deli);
        const url = new URL(window.location.href);
        const queryString = url.search.substring(1);
        makeOrders(queryString, bill.id);
    }
}

async function renderPaymentInfo() {
    const priceEach = document.querySelectorAll(".product-price");

    let priceTotal = 0;

    priceEach.forEach(e => {
        priceTotal += parseInt(e.getAttribute("data-price"));
    });

    const priceTotalData = document.querySelector(".price-total");
    priceTotalData.innerText = `${priceTotal.toLocaleString()}원`;

    const deliveryFee = document.querySelector(".delivery-fee-total");
    const deliveryFeeData = (priceEach.length * (!payload.subscribe_data) * 3000)
    deliveryFee.innerText = `${deliveryFeeData.toLocaleString()}원`;

    const totalPrice = document.querySelector(".real-total");
    totalPrice.innerText = `${(priceTotal + deliveryFeeData).toLocaleString()}원`;

    let today = new Date();
    let year = today.getFullYear();
    let month = String(today.getMonth() + 1).padStart(2, '0'); //두자리되도록 앞에0채우기
    let date = String(today.getDate()).padStart(2, '0'); //두자리되도록 앞에0채우기
    today = `${year}-${month}-${date}`;

    const pointNow = document.getElementById("pointNow");
    // const pointMinus = document.getElementById("pointMinus");
    const pointAfter = document.getElementById("pointAfter");

    const myPoint = await getPointStaticView(today)
    const mypoint_json = await myPoint.json()
    pointNow.innerText = `${mypoint_json.total_point.toLocaleString()} P`;

    const pricePoint = (priceTotal + deliveryFeeData)

    // pointMinus.innerText = pricePoint.toLocaleString();
    const afterPoint = (mypoint_json.total_point - pricePoint);
    pointAfter.innerText = `${afterPoint.toLocaleString()} P`;
    if (afterPoint < 0) {
        pointAfter.style.color = "red";
    }
}

window.onload = async () => {
    loadCheckedCart();
    if (!access_token) {
        window.location.href = `${FRONT_BASE_URL}/login`;
    }
    else {
        const response = await getUserDeliveryInformationAPI(payload.user_id);
        const response_json = await response.json();
        DeliveryInformation(response_json);
    }
    const registDelivery = document.getElementById("registDelivery")
    const dropdown = document.querySelector(".dropdown");
    const dropdownContent = document.getElementById("dropdownContent");

    dropdown.addEventListener("mouseover", function () {
        dropdownContent.style.display = "block";
    });

    dropdown.addEventListener("mouseleave", function () {
        dropdownContent.style.display = "none";
    });

    const recipient = document.getElementById("recipient")
    recipient.addEventListener("change", function () {
        const deliId = document.getElementById("orderDeliveryId")
        deliId.setAttribute("data-deliveryId", 0);
    })

    registDelivery.addEventListener("click", function () {
        document.getElementById("Postcode").style.display = "block";
        document.getElementById("address").value = ""
        document.getElementById("detailAddress").value = ""
        document.getElementById("postalCode").value = ""


    })

    dropdownContent.style.display = "none";
    const detailAddress = document.getElementById("detailAddress");
    detailAddress.disabled = false;

    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
    renderModalBtns()
    document.getElementById("Postcode").addEventListener("click", function (e) {
        addressSearchAPI()
    })

    document.getElementById("btnFoldWrap").addEventListener("click", foldPostcode)
}


async function renderModalBtns() {
    const button1 = document.createElement("button");
    button1.setAttribute("type", "button");
    button1.setAttribute("class", "modal-btn1 btn btn-primary");
    button1.textContent = "결제하기";

    const button2 = document.createElement("button");
    button2.setAttribute("type", "button");
    button2.setAttribute("class", "modal-btn2 btn btn-secondary");
    button2.setAttribute("data-bs-dismiss", "modal");
    button2.textContent = "취소";

    button1.addEventListener("click", function () {
        console.log("완")
        makePurchaseOrder();
    })
    const modalBtnBox = document.getElementById("modalBtnBox");


    const user_agent = navigator.userAgent.toLowerCase();

    if (user_agent.indexOf('mac') !== -1) {
        modalBtnBox.appendChild(button2);
        modalBtnBox.appendChild(button1);
    } else {
        modalBtnBox.appendChild(button1);
        modalBtnBox.appendChild(button2);
    }
}

async function addressSearchAPI() {
    // 주소지 검색 API
    var element_wrap = document.getElementById('wrap');
    // 현재 scroll 위치를 저장해놓는다.
    new daum.Postcode({
        oncomplete: function (data) {
            // 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.

            // 각 주소의 노출 규칙에 따라 주소를 조합한다.
            // 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
            var addr = ''; // 주소 변수
            var extraAddr = ''; // 참고항목 변수

            //사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
            if (data.userSelectedType === 'R') { // 사용자가 도로명 주소를 선택했을 경우
                addr = data.roadAddress;
            } else { // 사용자가 지번 주소를 선택했을 경우(J)
                addr = data.jibunAddress;
            }

            // 사용자가 선택한 주소가 도로명 타입일때 참고항목을 조합한다.
            if (data.userSelectedType === 'R') {
                // 법정동명이 있을 경우 추가한다. (법정리는 제외)
                // 법정동의 경우 마지막 문자가 "동/로/가"로 끝난다.
                if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
                    extraAddr += data.bname;
                }
                // 건물명이 있고, 공동주택일 경우 추가한다.
                if (data.buildingName !== '' && data.apartment === 'Y') {
                    extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
                }
                // 표시할 참고항목이 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
                if (extraAddr !== '') {
                    extraAddr = ' (' + extraAddr + ')';
                }
                // 조합된 참고항목을 해당 필드에 넣는다.
                document.getElementById("detailAddress").value += extraAddr;

            }

            // 우편번호와 주소 정보를 해당 필드에 넣는다.
            document.getElementById('postalCode').value = data.zonecode;
            document.getElementById("address").value = addr;
            // 커서를 상세주소 필드로 이동한다.
            document.getElementById("detailAddress").focus();

            // iframe을 넣은 element를 안보이게 한다.
            // (autoClose:false 기능을 이용한다면, 아래 코드를 제거해야 화면에서 사라지지 않는다.)
            element_wrap.style.display = 'none';
            window.scrollTo(0, 0);
            document.getElementById("orderDeliveryId").setAttribute("data-deliveryId", 0);
        },
        // 우편번호 찾기 화면 크기가 조정되었을때 실행할 코드를 작성하는 부분. iframe을 넣은 element의 높이값을 조정한다.
        onresize: function (size) {
            element_wrap.style.height = size.height + 'px';
        },
        width: '100%',
        height: '100%'
    }).embed(element_wrap);
    // iframe을 넣은 element를 보이게 한다.
    element_wrap.style.display = 'block';
}

export async function foldPostcode() {
    // 주소지 검색 API창
    var element_wrap = document.getElementById('wrap');
    // 우편번호 찾기 찾기 화면을 넣을 element
    element_wrap.style.display = 'none';
    // iframe을 넣은 element를 안보이게 한다.
}