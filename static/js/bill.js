import { BACK_BASE_URL, FRONT_BASE_URL } from './api.js'

async function getBillList() {
    const response = await fetch(`${BACK_BASE_URL}/api/users/bills/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": "Bearer " + localStorage.getItem("access")
        }
    })

    if (response.status == 200) {
        const response_json = await response.json();
        console.log(response_json);
        return response_json;
    } else {
        console.log(response.status);
    }
}

async function renderBillList() {
    const bills = await getBillList();
    const billBox = document.querySelector('#bill-lists');
    bills.forEach(e => {
        const pdInfoDiv = document.createElement('div');
        pdInfoDiv.classList.add('pd-info');
        pdInfoDiv.setAttribute('data-bill-id', `${e.id}`);

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

        const firstText = document.createElement('div');
        try {
            firstText.innerText = `${e.order_items[0].name} 외 ${e.order_items.length - 1}건`;
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
        fourthText.innerText = `상태: ${e.order_status}`;

        const fifthText = document.createElement('div');
        fifthText.style.marginLeft = 'auto';
        fifthText.style.float = 'right';
        fifthText.innerText = `장바구니 담기`;

        textDiv.appendChild(firstText);
        textDiv.appendChild(secondText);
        textDiv.appendChild(thirdText);
        textDiv.appendChild(fourthText);
        firstText.appendChild(fifthText);

        pdInfoDiv.appendChild(imgDiv);
        pdInfoDiv.appendChild(textDiv);

        billBox.appendChild(pdInfoDiv);
    });
}

window.onload = async function () {
    renderBillList();
}