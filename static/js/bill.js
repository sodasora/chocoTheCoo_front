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

        const fifthText = document.createElement('img');
        fifthText.classList.add('pd-cart-icon');
        fifthText.src = `/static/images/shopping-cart.png`;
        
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
                window.location.href = `${FRONT_BASE_URL}/bill_detail.html?${billId}`;
            }
            else {
                alert('잘못된 요청입니다.');
            }
        })
        fifthText.addEventListener('click', async function (e) {
            console.log(e);            
            console.log("여기서 이제 bill_id로 정보를 받아와서 백엔드에 요청하면 될듯?ㅜㅜ");            
        })
    })
};


window.onload = async function () {
    renderBillList();
}