import { FRONT_BASE_URL, changebillstatus, getAllProductListAPIView, getSellerOrderListView } from './api.js';

// 주문목록 페이지네이션
async function paginationView_order(order) {
    const contents = document.getElementById("order-list");
    const buttons = document.getElementById("order-buttons");

    // 페이지네이션 페이지 설정
    const numOfContent = order.length;
    const maxContent = 10; //한 페이지에 보이는 수
    const maxButton = 5; //보이는 최대 버튼 수
    const maxPage = Math.ceil(numOfContent / maxContent);
    let page = 1;
    const makeContent = (id) => {
        if (!order[id].image) {
            order[id].image = "/static/images/품절.png" // 상품이미지 없으면 기본이미지 대체
        }
        const content = document.createElement("tr");
        content.setAttribute("data-bs-toggle", "modal");
        content.setAttribute("data-bs-target", `#staticBackdrop${id}`);

        // Modal 시작
        const modal = document.createElement("div");
        modal.setAttribute("class", "modal fade");
        modal.setAttribute("id", `staticBackdrop${id}`);
        modal.setAttribute("data-bs-backdrop", "static");
        modal.setAttribute("data-bs-keyboard", "false");
        modal.setAttribute("tabindex", "-1");
        modal.setAttribute("aria-labelledby", `staticBackdropLabel${id}`);
        modal.setAttribute("aria-hidden", "true");
        modal.style = "text-align: left;"

        const modalDialog = document.createElement('div');
        modalDialog.classList.add('modal-dialog');

        const modalContent = document.createElement('div');
        modalContent.classList.add('modal-content');

        const modalHeader = document.createElement('div');
        modalHeader.classList.add('modal-header');

        const h1 = document.createElement('h1');
        h1.textContent = '주문내역서';
        h1.classList.add('modal-title', 'fs-5');
        h1.setAttribute('id', `staticBackdropLabel${id}`);

        const btnClose = document.createElement('button');
        btnClose.setAttribute('type', 'button');
        btnClose.classList.add('btn-close');
        btnClose.setAttribute('aria-label', 'Close');
        btnClose.setAttribute('data-bs-dismiss', 'modal');

        modalHeader.appendChild(h1);
        modalHeader.appendChild(btnClose);

        const modalBody = document.createElement('div');
        modalBody.classList.add('modal-body');

        const ul1 = document.createElement('li');
        ul1.textContent = `주문등록일 : ${order[id].created_at.substr(2, 8)}\n${order[id].created_at.substr(11, 8)}`;

        const ul2 = document.createElement('li');
        ul2.textContent = `상태 : ${order[id].order_status.name}`;

        const div1 = document.createElement('div');
        div1.style.display = 'flex';

        const productImgZoom = document.createElement('div');
        productImgZoom.classList.add('product-img-zoom');
        productImgZoom.style = `background-image: url('${order[id].image}'); display: inline-block;`;

        const div2 = document.createElement('div');
        div2.style.display = 'inline-block';
        div2.style.width = '50%';

        const ul3 = document.createElement('ul');
        ul3.textContent = `상품명: ${order[id].name}`;

        const ul4 = document.createElement('ul');
        ul4.textContent = `상품가격: ${order[id].price.toLocaleString()}원`;

        const ul5 = document.createElement('ul');
        ul5.textContent = `주문수량: ${order[id].amount.toLocaleString()}개`;

        const ul6 = document.createElement('ul');
        ul6.textContent = `주문가격: ${(order[id].amount * order[id].price).toLocaleString()}원`;

        div2.appendChild(ul3);
        div2.appendChild(ul4);
        div2.appendChild(ul5);
        div2.appendChild(ul6);

        div1.appendChild(productImgZoom);
        div1.appendChild(div2);

        const ul7 = document.createElement('li');
        ul7.textContent = `배송지: ${order[id].bill.address} ${order[id].bill.detail_address} (${order[id].bill.postal_code})`;

        const ul8 = document.createElement('li');
        ul8.textContent = `받는사람: ${order[id].bill.recipient}`;

        modalBody.appendChild(ul1);
        modalBody.appendChild(ul2);
        modalBody.appendChild(div1);
        modalBody.appendChild(ul7);
        modalBody.appendChild(ul8);

        const modalFooter = document.createElement('div');
        modalFooter.classList.add('modal-footer');

        const div3 = document.createElement('div');
        div3.style.marginRight = 'auto';

        const strong = document.createElement('strong');
        strong.textContent = order[id].order_status.name;
        strong.style.fontSize = '1.5em';
        if (order[id].order_status.id == 2 ){
            strong.style= "color: red; font-weight: bold;"; // 주문확인중(2) - 빨강
        }else if (order[id].order_status.id == 3){
            strong.style= "color: orange; font-weight: bold;"; // 배송준비중(3) - 주황
        }else if (order[id].order_status.id == 5){
            strong.style= "color: green; font-weight: bold;"; // 배송완료(5) - 초록
        }

        div3.textContent = '상태: ';
        div3.appendChild(strong);

        const btnOrder = document.createElement('button');
        btnOrder.classList.add('btn', 'btn-primary');
        btnOrder.textContent = '주문확인';
        // 상태: 주문확인중(2) → 발송준비중(3)
        btnOrder.addEventListener('click', () => {
            changebillstatus(order[id].id, 3)
            window.location.reload()
        });

        const btnShipping = document.createElement('button');
        btnShipping.classList.add('btn', 'btn-primary');
        btnShipping.textContent = '발송완료';
        // 상태: 발송준비중(3) → (발송완료(4)) → 배송완료(5) ∵배송과정생략
        btnShipping.addEventListener('click', () => {
            changebillstatus(order[id].id, 5)
            window.location.reload()
        });

        // 발송준비중(3) 이후 주문확인 버튼 숨기기 | 프론트: 버튼제거, 백엔드: 권한막기
        if (order[id].order_status.id == 3) {
            btnOrder.style.display = 'none';
        }
        // 배송완료(5) 구매확정(6) 이후 수정 불가 | 프론트: 버튼제거, 백엔드: 권한막기
        if (order[id].order_status.id == 5 || order[id].order_status.id == 6) {
            btnOrder.style.display = 'none';
            btnShipping.style.display = 'none';
        }

        const btnCancel = document.createElement('button');
        btnCancel.classList.add('btn', 'btn-secondary');
        btnCancel.setAttribute('data-bs-dismiss', 'modal');
        btnCancel.textContent = 'Close';

        modalFooter.appendChild(div3);
        modalFooter.appendChild(btnOrder);
        modalFooter.appendChild(btnShipping);
        modalFooter.appendChild(btnCancel);

        modalContent.appendChild(modalHeader);
        modalContent.appendChild(modalBody);
        modalContent.appendChild(modalFooter);

        modalDialog.appendChild(modalContent);

        modal.appendChild(modalDialog);

        content.appendChild(modal)
        // Modal 끝

        const createdAtTd = document.createElement('td');
        const createdAtText = document.createTextNode(`${order[id].created_at.substr(2, 8)}\n${order[id].created_at.substr(11, 8)}`);
        createdAtTd.appendChild(createdAtText);

        const nameTd = document.createElement('td');
        const nameText = document.createTextNode(order[id].name);
        nameTd.appendChild(nameText);

        const productImgTd = document.createElement('td');
        const productImgDiv = document.createElement('div');
        productImgDiv.classList.add('product-img');
        productImgDiv.style.backgroundImage = `url(${order[id].image})`;
        productImgTd.appendChild(productImgDiv)

        // 이미지 확대보기
        const productImgDivZoom = document.createElement("div");
        productImgDivZoom.classList.add("product-img-zoom");
        productImgDivZoom.style.backgroundImage = `url(${order[id].image})`;
        productImgTd.appendChild(productImgDivZoom)

        // 이미지 확대보기 Tooltip 효과주기
        productImgTd.addEventListener("mouseover", function () {
            productImgDivZoom.style.display = "flex";
            productImgDiv.style.display = "none";
        })
        productImgTd.addEventListener("mouseleave", function () {
            productImgDivZoom.style.display = "none";
            productImgDiv.style.display = "inline-block";
        })

        const orderStatusTd = document.createElement('td');
        const orderStatusText = document.createTextNode(order[id].order_status.name);
        if (order[id].order_status.id == 2 ){
            orderStatusTd.style= "color: red; font-weight: bold;"; // 주문확인중(2) - 빨강
        }else if (order[id].order_status.id == 3){
            orderStatusTd.style= "color: orange; font-weight: bold;"; // 배송준비중(3) - 주황
        }else if (order[id].order_status.id == 5){
            orderStatusTd.style= "color: green; font-weight: bold;"; // 배송완료(5) - 초록
        }
        orderStatusTd.appendChild(orderStatusText);

        const amountTd = document.createElement('td');
        const amountText = document.createTextNode(order[id].amount.toLocaleString());
        amountTd.appendChild(amountText);

        const priceTd = document.createElement('td');
        const priceText = document.createTextNode(order[id].price.toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' }));
        priceTd.appendChild(priceText);

        const totalPriceTd = document.createElement('td');
        const totalPriceText = document.createTextNode((order[id].amount * order[id].price).toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' }));
        totalPriceTd.appendChild(totalPriceText);

        const billTd = document.createElement('td');
        const billText = document.createTextNode(`${order[id].bill.address} ${order[id].bill.detail_address} (${order[id].bill.postal_code}) ${order[id].bill.recipient}`);
        billTd.appendChild(billText);

        content.appendChild(createdAtTd);
        content.appendChild(nameTd);
        content.appendChild(productImgTd);
        content.appendChild(orderStatusTd);
        content.appendChild(amountTd);
        content.appendChild(priceTd);
        content.appendChild(totalPriceTd);
        content.appendChild(billTd);

        return content;
    };

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
        if (contents) {
            while (contents.hasChildNodes()) {
                contents.removeChild(contents.lastChild);
            }
            // 글의 최대 개수를 넘지 않는 선에서, 화면에 maxContent개의 글 생성
            for (let id = (page - 1) * maxContent + 1; id <= page * maxContent && id <= numOfContent; id++) {
                contents.appendChild(makeContent(id - 1));
            }
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
        if (buttons) {

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
        }
    };

    const render = (page) => {
        renderContent(page);
        renderButton(page);
    };
    render(page);
}


// ↓주문 목록 가져오기 관련 코드↓ //
const payload = localStorage.getItem("payload");
const payload_parse = JSON.parse(payload);

if (payload_parse == null) {
    alert("로그인이 필요 합니다.")
    window.location.replace(`${FRONT_BASE_URL}/login.html`)
} else if (payload_parse.is_seller == false) {
    alert("판매 활동 권한이 필요합니다.")
    window.location.replace(`${FRONT_BASE_URL}/user_detail_page.html`)
}
const user_id = payload_parse.user_id //로그인한 유저id

// 로그인한 판매자의 전체 주문 목록 불러오기
const seller_orders = await getSellerOrderListView()

// ↑주문 목록 가져오기 관련 코드↑ // 

// 주문 목록 페이지네이션 실행
if (seller_orders.length > 0) {

    seller_orders.sort(function(a, b) {
        return a.order_status.id - b.order_status.id; // "주문상태" 기준으로 오름차순 정렬
    });
    paginationView_order(seller_orders)
}
