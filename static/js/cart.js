import { FRONT_BASE_URL, getCartList, deleteCartItem, changeCartItemAmount, payload } from './api.js'



async function renderCartList() {
    const cartItems = await getCartList();
    const cartBox = document.querySelector('#cartList');
    cartItems.forEach(e => {
        const cartItemDiv = document.createElement('div');
        cartItemDiv.classList.add('row', 'cart-item');

        const col1Div = document.createElement('div');
        col1Div.classList.add('col-2', 'check-each-div');

        const checkboxInput = document.createElement('input');
        checkboxInput.setAttribute("data-cartId", e.id);
        checkboxInput.classList.add('col-2', "check-each");
        checkboxInput.type = 'checkbox';
        checkboxInput.checked = true;

        col1Div.appendChild(checkboxInput);

        const col2Div = document.createElement('div');
        col2Div.classList.add('col-6', 'pd-info');

        const imgDiv = document.createElement('div');
        imgDiv.style.padding = '0';
        imgDiv.style.margin = '0';
        imgDiv.style.display = 'flex';

        const img = document.createElement('img');
        img.classList.add('pd-info-thumb');
        if (e.product.image) {
            img.src = `${e.product.image}`
        }
        else {
            img.src = `/static/images/초콜릿.jpg`
        }
        imgDiv.appendChild(img);

        const infoDiv = document.createElement('div');
        infoDiv.classList.add('info-box');

        const pdInfoText = document.createElement('div');
        pdInfoText.classList.add('pd-info-text');
        pdInfoText.textContent = `${e.product.name}`;

        const priceAmountDiv = document.createElement('div');
        priceAmountDiv.classList.add('pd-price-amount');

        const priceDiv = document.createElement('div');
        priceDiv.classList.add('pd-price');
        priceDiv.textContent = `${e.product.price.toLocaleString()}원`;

        const multiplyDiv = document.createElement('div');
        multiplyDiv.classList.add("pd-multiply");
        multiplyDiv.textContent = ' × ';

        const amountDiv = document.createElement('select');
        amountDiv.classList.add('pd-amount');

        const options = [
            { value: e.amount, label: e.amount, hidden: true },
            { value: '1', label: '1' },
            { value: '2', label: '2' },
            { value: '3', label: '3' },
            { value: '4', label: '4' },
            { value: '5', label: '5' },
            { value: '6', label: '6' },
            { value: '7', label: '7' },
            { value: '8', label: '8' },
            { value: '9', label: '9' },
            { value: '10', label: '10' },
            { value: '10+', label: '10+' }
        ];

        options.forEach(optionData => {
            const option = document.createElement('option');
            option.value = optionData.value;
            option.textContent = optionData.label;
            if (optionData.hidden) {
                option.hidden = optionData.hidden;
            }
            amountDiv.appendChild(option);
        });

        amountDiv.value = e.amount;


        const hr = document.createElement('hr');

        priceAmountDiv.appendChild(priceDiv);
        priceAmountDiv.appendChild(multiplyDiv);
        priceAmountDiv.appendChild(amountDiv);

        infoDiv.appendChild(pdInfoText);
        infoDiv.appendChild(hr);
        infoDiv.appendChild(priceAmountDiv);

        col2Div.appendChild(imgDiv);
        col2Div.appendChild(infoDiv);

        const col3Div = document.createElement('div');
        col3Div.classList.add('col-2', 'sum-price');
        col3Div.textContent = `${e.aggregate_price.toLocaleString()} 원`;
        col3Div.setAttribute('data-price', e.aggregate_price);
        col3Div.setAttribute('data-deliveryFee', '3000');

        const col4Div = document.createElement('div');
        // const feeData = ((!payload.subscribe_data) * 3000).toLocaleString()
        const feeData = 0
        col4Div.classList.add('col-2', 'pd-deliveryfee');

        col4Div.textContent = `${feeData} 원`

        const col5Div = document.createElement('div');
        col5Div.classList.add('pd-del-box');
        const delBtn = document.createElement('img');
        delBtn.classList.add('pd-del-btn', 'col-1');
        delBtn.src = "/static/images/cross.png";
        delBtn.setAttribute('data-cartId', e.id);

        col5Div.appendChild(delBtn);

        cartItemDiv.appendChild(col5Div);
        cartItemDiv.appendChild(col1Div);
        cartItemDiv.appendChild(col2Div);
        cartItemDiv.appendChild(col3Div);
        cartItemDiv.appendChild(col4Div);


        cartBox.appendChild(cartItemDiv);


        // 품절(2)표시
        if (e.product.item_state == 2) {
            // 이미지 품절표시
            const soldoutImage = document.createElement("img");
            soldoutImage.setAttribute("src", "/static/images/soldout.png");
            soldoutImage.setAttribute("class", "soldout");
            imgDiv.appendChild(soldoutImage)
            // 투명화
            cartItemDiv.style.opacity = 0.5
            // 체크박스 해제 및 입력기능 비활성화
            checkboxInput.checked = false;
            checkboxInput.setAttribute("disabled", "")
            amountDiv.setAttribute("disabled", "")
        }

        // 삭제(6)표시
        if (e.product.item_state == 6) {
            // 상품이미지 삭제표시
            const deleteImg = document.createElement("img");
            deleteImg.setAttribute('src', '/static/images/품절.png');
            deleteImg.setAttribute('class', 'delete');
            imgDiv.appendChild(deleteImg);
            // 상품명 삭제표시
            const pdInfoTextDiv = document.createElement('div');
            pdInfoTextDiv.classList.add('pd-info-text');
            pdInfoTextDiv.textContent = "삭제된 상품입니다"
            infoDiv.prepend(pdInfoTextDiv);
            // 투명화
            cartItemDiv.style.opacity = 0.5
            // 체크박스 해제 및 입력기능 비활성화
            checkboxInput.checked = false;
            checkboxInput.setAttribute("disabled", "")
            amountDiv.setAttribute("disabled", "")
        }


        const hrLine = document.createElement('hr');
        hrLine.classList.add('line');

        cartBox.appendChild(hrLine);
        amountDiv.addEventListener('change', (a) => {
            if (a.target.value == "10+") {
                const moreOption = document.createElement('input');
                moreOption.classList.add('pd-amount');
                const amountChangeBtn = document.createElement('button');
                amountChangeBtn.innerText = '변경';
                amountChangeBtn.classList.add('pd-amount-submit');

                amountDiv.style.display = 'none';
                priceAmountDiv.appendChild(moreOption);
                priceAmountDiv.appendChild(amountChangeBtn);

                amountChangeBtn.addEventListener('click', (b) => {
                    changeCartItemAmount(e.id, moreOption.value)
                })
            }
            else {
                changeCartItemAmount(e.id, a.target.value)
            }
        })
        col5Div.addEventListener('click', (b) => {
            deleteCartItem(e.id);
        })
    })
    renderTotals();
}

async function renderTotals() {
    const sumPrice = document.querySelectorAll('.sum-price')

    let totalPrice = 0;
    let totalDeliveryFee = 0;

    sumPrice.forEach(e => {
        totalPrice += parseInt(e.dataset.price);
        // totalDeliveryFee += parseInt(e.dataset.deliveryfee);
    })


    const totals = document.getElementById('totals');

    const totalPriceBox = document.createElement('div');
    totalPriceBox.classList.add('col-3');
    totalPriceBox.textContent = `총 상품가격 ${totalPrice.toLocaleString()}`;

    const plusSign = document.createElement('div');
    plusSign.classList.add('col-1');
    plusSign.textContent = '+';

    const equalSign = document.createElement('div');
    equalSign.classList.add('col-1');
    equalSign.textContent = '=';

    const totalDeliveryFeeBox = document.createElement('div');
    totalDeliveryFeeBox.classList.add('col-3');
    totalDeliveryFeeBox.textContent = `총 배송비 ${totalDeliveryFee.toLocaleString()}`;

    const totalOrder = document.createElement('div');
    totalOrder.classList.add('col-3');
    totalOrder.textContent = `총 주문금액 ${(totalPrice + totalDeliveryFee).toLocaleString()}`;

    const orderBtn = document.createElement('div');
    orderBtn.classList.add('order-btn');
    orderBtn.textContent = '주문하기';

    orderBtn.addEventListener('click', () => {
        const cartCheck = document.querySelectorAll('.check-each');
        let cart_id_list = [];
        cartCheck.forEach(e => {
            if (e.checked) {
                const cart_item_id = e.getAttribute('data-cartId');
                cart_id_list.push(cart_item_id);
            }
        });

        if (cart_id_list.length > 0) {
            const params = new URLSearchParams();
            params.set('cart_id', cart_id_list.join(","));
            const queryString = params.toString();
            window.location.href = `${FRONT_BASE_URL}/ordercheck.html?` + `${queryString}`;
        }
        else {
            alert('선택된 상품이 없습니다.');
        }

    })
    totals.appendChild(totalPriceBox);
    totals.appendChild(plusSign);
    totals.appendChild(totalDeliveryFeeBox);
    totals.appendChild(equalSign);
    totals.appendChild(totalOrder);
    totals.parentNode.appendChild(orderBtn);
}


window.onload = async function () {
    if (payload == null) {
        alert("로그인이 필요 합니다.")
        window.location.replace(`${FRONT_BASE_URL}/login.html`)
    } else {
        renderCartList();
        const checkAll = document.getElementById('checkAll');
        checkAll.addEventListener('click', (e) => {
            const cartCheck = document.querySelectorAll('.check-each');
            if (checkAll.checked == true) {
                cartCheck.forEach(check => {
                    check.checked = true;
                });
            }
            else {
                cartCheck.forEach(check => {
                    check.checked = false;
                });
            }
        })
    }
}