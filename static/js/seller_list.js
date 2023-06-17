import { getSellerProductListAPIView, getSellerOrderListView, getProductDetailAPIView } from './api.js';

// 상품목록 페이지네이션
async function paginationView_product(product) {
    const contents = document.getElementById("product-list");
    const buttons = document.getElementById("product-buttons");
    // console.log("상품확인", product);

    // 페이지네이션 페이지 설정
    const numOfContent = product.length;
    const maxContent = 10; //한 페이지에 보이는 수
    const maxButton = 5; //보이는 최대 버튼 수
    const maxPage = Math.ceil(numOfContent / maxContent);
    let page = 1;
    const makeContent = (id) => {
        if (!product[id].image) {
            product[id].image = "/static/images/기본상품.png" // 상품이미지 없으면 기본이미지 대체
        }
        if (!product[id].stars) {
            product[id].stars = "리뷰없음" // 리뷰없으면 표시
        }
        const content = document.createElement("tr");
        content.setAttribute("onclick", `상품정보상세보기로이동함수(${product[id]})`);
        content.innerHTML = `
        <td><text>${product[id].created_at.substr(0, 10)}</text></td>
        <td><text>${product[id].name}</text></td>
        <td><div class="product-img" style="background-image: url(${product[id].image});"></div></td>
        <td><text>${(product[id].price).toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' })}</text></td>
        <td><text>${product[id].amount}</text></td>
        <td><text>${product[id].sales}</text></td>
        <td><text><div id=star-score></div>${product[id].stars}</text></td>
        <td><text>${product[id].likes}</text></td>
        `;
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
        while (contents.hasChildNodes()) {
            contents.removeChild(contents.lastChild);
        }
        // 글의 최대 개수를 넘지 않는 선에서, 화면에 maxContent개의 글 생성
        for (let id = (page - 1) * maxContent + 1; id <= page * maxContent && id <= numOfContent; id++) {
            contents.appendChild(makeContent(id - 1));
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
        console.log(buttons,"여기여기")
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
}

// 주문목록 페이지네이션
async function paginationView_order(order) {
    const contents = document.getElementById("order-list");
    const buttons = document.getElementById("order-buttons");
    // console.log("주문확인", order);

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
        content.setAttribute("onclick", `상품정보상세보기로이동함수(${order[id]})`);
        content.innerHTML = `
        <td><text>${order[id].created_at.substr(2, 8)}<br>${order[id].created_at.substr(11, 8)}</text></td>
        <td><text>${order[id].name}</text></td>
        <td><div class="product-img" style="background-image: url(${order[id].image});"></div></td>
        <td>
        <text>
        <select onchange="바뀌는함수(this.value)" tabindex="-1">
            <option value="">${order[id].order_status.name}</option>
            <option value="2">주문확인중</option>
            <option value="3">배송준비중</option>
            <option value="4">배송중</option>
        </select>
        </text>
        </td>
        <td><text>${order[id].amount}</text></td>
        <td><text>${order[id].price.toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' })}</text></td>
        <td><text>${(order[id].amount * order[id].price).toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' })}</text></td>
        <td>
        <text>${order[id].bill.address} ${order[id].bill.detail_address}</text>
        <text>(${order[id].bill.postal_code})</text>
        <text>${order[id].bill.recipient}</text>
        </td>
        `;
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
        while (contents.hasChildNodes()) {
            contents.removeChild(contents.lastChild);
        }
        // 글의 최대 개수를 넘지 않는 선에서, 화면에 maxContent개의 글 생성
        for (let id = (page - 1) * maxContent + 1; id <= page * maxContent && id <= numOfContent; id++) {
            contents.appendChild(makeContent(id - 1));
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
}


// ↓상품 목록 가져오기 관련 코드↓ //

const payload = localStorage.getItem("payload");
const payload_parse = JSON.parse(payload);
const user_id = payload_parse.user_id //로그인한 유저id



// 로그인한 판매자의 전체 상품 목록 불러오기
const seller_products = await getSellerProductListAPIView(user_id)
console.log('seller_products', seller_products)

// 로그인한 판매자의 전체 주문 목록 불러오기
const seller_orders = await getSellerOrderListView(user_id)
console.log('seller_orders',seller_orders)

// 상품목록 Json 배열에 데이터 추가하기
for (let i = 0; i < seller_orders.length; i++) {
    // 상품리스트에서 상품이미지 조회 - 상품이미지는 post 요청으로 넘어오지 않으므로 Product 에서 조회
    const product = await getProductDetailAPIView(seller_orders[i].product_id);
    seller_orders[i]['image'] = product.image;
}

// ↑상품 목록 가져오기 관련 코드↑ //

// 상품 목록, 주문 목록 페이지네이션 실행
paginationView_product(seller_products)
paginationView_order(seller_orders)
