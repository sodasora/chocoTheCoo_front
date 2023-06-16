import { BACK_BASE_URL, makeBills, makeOrders, getCheckedCart } from "./api.js"


async function getDeliveryData(element) {
    const postal_code = document.getElementById("postal_code");
    postal_code.value = element.postal_code;
    const address = document.getElementById("address");
    address.value = element.address;
    const detail_address = document.getElementById("detail_address");
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

async function getPayloadParse() {
    const payload = localStorage.getItem("payload");
    const payload_parse = JSON.parse(payload);
    return payload_parse;
}

async function loadCheckedCart() {
    const url = new URL(window.location.href);
    const queryString = url.search.substring(1);
    const checkedCart = await getCheckedCart(queryString);
    const cartCheck = document.getElementById("orderCart")
    console.log(checkedCart)
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
            col1image.setAttribute("src", `${BACK_BASE_URL}/${e.product.image}`);
        }
        const col2 = document.createElement("div");
        col2.classList.add("col-2", "centered");
        col2.textContent = e.amount;

        const col3 = document.createElement("div");
        col3.classList.add("col-2", "centered");
        col3.textContent = e.aggregate_price;

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
}

window.onload = async () => {
    const payload_parse = await getPayloadParse();
    if (payload_parse == null) {
        console.log("비 로그인 사용자");
    }
    else {
        const response = await getUserDeliveryInformationAPI(payload_parse.user_id);
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

    loadCheckedCart();

    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))

    const getOrderBtn = document.getElementById("getOrderBtn");
    getOrderBtn.addEventListener("click", function () {
        //! 확인창 모달로 변경 예정
        let do_confirm = confirm("확실해요??")
        if (do_confirm) {
            //! 결제 함수 들어갈 자리
            makePurchaseOrder();
        }
        else { }
    })
}

async function makePurchaseOrder() {
    const deli = document.getElementById("orderDeliveryId").getAttribute("data-deliveryId");
    const bill = await makeBills(deli);

    const url = new URL(window.location.href);
    const queryString = url.search.substring(1);
    makeOrders(queryString, bill.id);
}

