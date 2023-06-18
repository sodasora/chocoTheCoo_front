import { BACK_BASE_URL, FRONT_BASE_URL } from './api.js'

window.onload = async function () {
    renderBillDetails();
}

async function getBillDetail(bill_id) {
    const response = await fetch(`${BACK_BASE_URL}/api/users/bills/${bill_id}/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": "Bearer " + localStorage.getItem("access")
        },
    })

    if (response.status == 200) {
        const response_json = await response.json();
        console.log(response_json);
        return response_json;
    } else {
        console.log(response.status);
    }
}

async function renderBillDetails() {
    const url = new URL(window.location.href);
    console.log(url.searchParams.get('ordered'));
    const bill_id = url.searchParams.get('bill_id');
    console.log(bill_id);
    const bill = await getBillDetail(bill_id);
    const deli = document.getElementById("delivery-info")
    deli.innerHTML = bill;
    // 추가예정
    // bill.order_items.forEach(e => {

    // });
}
