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
            // col1image.setAttribute("src", `${BACK_BASE_URL}/${e.product.image}`);
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
        // const col4 = document.createElement("div");
        // col4.classList.add("col-2", "centered");
        // col4.textContent = 3000;
        // row.appendChild(col4);

        cartCheck.appendChild(row);
        cartCheck.appendChild(line);
    })
    return renderPaymentInfo();
}


async function makePurchaseOrder() {
    const deli = document.getElementById("orderDeliveryId").getAttribute("data-deliveryId");
    const bill = await makeBills(deli);

    const url = new URL(window.location.href);
    const queryString = url.search.substring(1);
    makeOrders(queryString, bill.id);
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
    const dropdown = document.querySelector(".dropdown");
    const dropdownContent = document.getElementById("dropdownContent");

    dropdown.addEventListener("mouseover", function () {
        dropdownContent.style.display = "block";
    });

    dropdown.addEventListener("mouseleave", function () {
        dropdownContent.style.display = "none";
    });

    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
    renderModalBtns()
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