import { BACK_BASE_URL, getSellerProductListAPIView, getSellerOrderListView, getSellerPermissionAPIView, getProductDetailAPIView } from './api.js';

const payload = localStorage.getItem("payload");
const payload_parse = JSON.parse(payload);
const user_id = payload_parse.user_id //로그인한 유저id

// 로그인한 판매자의 전체 상품 목록 불러오기
const seller_products = await getSellerProductListAPIView(user_id)
// console.log('seller_products',seller_products)

// 로그인한 판매자의 전체 주문 목록 불러오기
const seller_orders = await getSellerOrderListView(user_id)
// console.log('seller_orders', seller_orders)

// 로그인한 판매자의 전체 주문 목록에서 발송대기중인 상태 필터
const seller_orders_unsent = seller_orders.filter(function (order) {
    return 1 < order.order_status.id && order.order_status.id <= 3;
});
// console.log('seller_orders_unsent', seller_orders_unsent)

// 상품목록 Json 배열에 데이터 추가하기
for (let i = 0; i < seller_orders.length; i++) {
    // 상품리스트에서 상품이미지 조회 - 상품이미지는 post 요청으로 넘어오지 않으므로 Product 에서 조회
    const product = await getProductDetailAPIView(seller_orders[i].product_id);
    seller_orders[i]['image'] = product.image;
}


//########## ↓ 정보 정의 ↓ ##########//
// 1) 총 누적판매량 total_sales
let total_sales = 0
for (const seller_product of seller_products) {
    total_sales += seller_product.sales
}
for (let i = 0; i < seller_products.length; i++) {
    seller_products[i]['total_sales'] = total_sales;
}
// 2) 총 등록상품 수 total_product_count
const total_product_count = seller_products.length


// 5) 브랜드 좋아요(찜) - 미구현, 필드 추가 필요

// 6) 상품 총 좋아요(찜)
let total_product_wish = 0
for (const seller_product of seller_products) {
    total_product_wish += seller_product.likes
}

// 7) 평균평점
let total_star_score = 0
let is_score_products = seller_products.filter(function (product) {
    return product.stars; //평점 존재하는 상품만 필터
});
for (const is_score_product of is_score_products) {
    total_star_score += is_score_product.stars
}
let avg_star_score = total_star_score / is_score_products.length

// 8) 최고평점
let max_star_score = Math.max(...is_score_products.map(product => product.star));
//########## ↑ 정보 정의 ↑ ##########//


//########## ↓ 상단-현황박스 정보 입력 ↓ ##########//
// 1) 총 누적판매량
const sales_total_count = document.getElementById('sales_total_count')
sales_total_count.innerText = total_sales

// 2) 등록상품
const product_total_count = document.getElementById('product_total_count')
product_total_count.innerText = total_product_count


// 5) 브랜드 좋아요(찜) - 미구현, 필드 추가 필요
const seller_wish = document.getElementById('seller_wish')
seller_wish.innerText = "X"

// 6) 상품 총 좋아요(찜)
const product_wish = document.getElementById('product_wish')
product_wish.innerText = total_product_wish

// 7) 평균평점
const avg_star = document.getElementById('avg_star')
if (avg_star_score) {
    avg_star.innerText = avg_star_score
}
else {
    avg_star.innerText = "X"
}
// 8) 최고평점
const max_star = document.getElementById('max_star')
if (avg_star_score) {
    max_star.innerText = max_star_score
}
else {
    max_star.innerText = "X"
}
//########## ↑ 상단-현황박스 정보 입력 ↑ ##########//


// 판매자정보
async function sellerProfile() {
    const payload = localStorage.getItem("payload");
    const payload_parse = JSON.parse(payload);
    const user_id = payload_parse.user_id //로그인한 유저id

    const seller_data = await getSellerPermissionAPIView(user_id)
    console.log("판매자정보", seller_data)

    const firstday= seller_data["created_at"].substr(0,10)

    // 오늘날짜 형식 맞추기 0000-00-00
    let today = new Date();
    let year = today.getFullYear();
    let month = String(today.getMonth() + 1).padStart(2, '0'); //두자리되도록 앞에0채우기
    let date = String(today.getDate()).padStart(2, '0'); //두자리되도록 앞에0채우기
    today = `${year}-${month}-${date}`;
    // console.log("today", today)

    // 판매자등록부터 오늘까지의 일수 차이
    let startDate = new Date(firstday);
    let endDate = new Date(today);
    let timeDiff = Math.abs(endDate.getTime() - startDate.getTime());
    const term = Math.ceil(timeDiff / (1000 * 3600 * 24))+1;

    document.getElementById("total_profit").innerText = seller_data["total_profit"].toLocaleString({ style: 'currency', currency: 'KRW' })
    document.getElementById("month_profits").innerText = seller_data["month_profits"].toLocaleString({ style: 'currency', currency: 'KRW' })
    document.getElementById("month_growth_rate").innerText = seller_data["month_growth_rate"]
    document.getElementById("month_sent").innerText = seller_data["month_sent"]
    document.getElementById("month_sent_charge").innerText = (seller_data["month_sent"] * 3000).toLocaleString({ style: 'currency', currency: 'KRW' }) //배송비 3000원
    document.getElementById("firstday").innerText = firstday
    document.getElementById("today").innerHTML = `<text id="today" class="status-text">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;~${today}</text>` 
    document.getElementById("term").innerHTML = `<text  id="term" class="unit-text">초코더쿠와 함께한 기간: ${term}일</text>` 
    
    document.getElementById("unpaid_sent").innerText = seller_data["unpaid_sent"]
    document.getElementById("unsent").innerText = seller_data["unsent"]


    if (seller_data['company_img']) { //로고 이미지가 존재한다면
        document.getElementById("company-img").setAttribute("src", `${BACK_BASE_URL}` + seller_data['company_img'])
    }
    document.getElementById("company-name").innerText = seller_data["company_name"]
    document.getElementById("owner-name").innerText = seller_data["business_owner_name"]
}
sellerProfile()


//########## ↓ 하단-상품리스트 불러오기 ↓ ##########//
// 상품리스트 불러오기 함수
function listView_product(product, type) {
    const contents = document.getElementById(`${type}_under-column-dox`);
    contents.innerHTML = '';
    console.log("상품확인", product);
    // console.log("type", type);

    const makeContent = (id) => {
        if (!product[id].image) {
            product[id].image = "/static/images/기본상품.png" // 상품이미지 없으면 기본이미지 대체
        }
        // 판매비중
        let ratio = Math.round(product[id].sales / product[id].total_sales * 1000) / 10
        if (!ratio) { // 판매비중이 없다면 0%
            ratio = 0
        }
        const content = document.createElement("div");
        content.setAttribute("class", 'under-column');
        content.innerHTML = `
        <text>${id + 1}. ${product[id].name}</text>
        <img style="width: 50px;" src="${product[id].image}" alt="상품이미지">
        <text style="font-size: 20px; float:inline-end">${product[id].sales}개</text>
        <div class="graph">
        <div>
        <div class="${type} bar" style="width: ${ratio*0.8}%;"></div>
        <text style="font-size:large; ">${ratio}%</text>
        </div>
        </div>
        `;
        return content;
    };

    for (let index = 0; index < product.length; index++) {
        contents.appendChild(makeContent(index));
    }
}


// 주문리스트 불러오기 함수
function listView_order(order, type) {
    const contents = document.getElementById(`${type}_under-column-dox`);
    contents.innerHTML = '';
    console.log("주문확인", order);
    // console.log("type", type);

    const makeContent = (id) => {
        if (!order[id].image) {
            order[id].image = "/static/images/기본상품.png" // 상품이미지 없으면 기본이미지 대체
        }
        const content = document.createElement("div");
        content.setAttribute("class", 'under-column');
        content.innerHTML = `
        <img style="width: 50px;" src="${order[id].image}" alt="상품이미지">
        <text>${id + 1}. ${order[id].name}</text>
        <text style="font-size: 20px; float:inline-end">${order[id].amount}개</text>
        <br>
        <text style="font-weight: bold;">${order[id].order_status.name}</text>
        <text>: ${order[id].created_at.substr(2, 8)}</text>
        `;
        return content;
    };

    for (let index = 0; index < order.length; index++) {
        contents.appendChild(makeContent(index));
    }
}

// 상품리스트 불러오기
listView_product(seller_products, 'sells')
listView_product(seller_products, 'likes')
listView_product(seller_products, 'stars')
// 주문리스트 불러오기
listView_order(seller_orders_unsent, 'orders')

//########## ↑ 하단-상품리스트 불러오기 ↑ ##########//


// // 그래프 애니메이션 함수
// const barAnimation = (bars, index, currentValue, targetValue, duration, updateInterval) => {
//     const increment = (targetValue - currentValue) / (duration / updateInterval);
//     let currentWidth = currentValue;

//     const interval = setInterval(() => {
//         currentWidth += increment;
//         bars[index].style.width = currentWidth + '%';

//         if (Math.abs(currentWidth - targetValue) < Math.abs(increment)) {
//             // 목표값에 도달한 경우
//             bars[index].style.width = targetValue + '%';
//             clearInterval(interval);
//         }
//     }, updateInterval);
// };

// //막대그래프 효과
// const bars = await document.querySelectorAll(`.sells.bar`); // 특정 class 선택
// console.log('bars', bars);
// const animationDuration = 1000; // 애니메이션 지속 시간 (ms)
// const updateInterval = 50000; // 갱신 주기 (ms)

//     for (let index = 0; index < seller_products.length; index++) {
//         // 각 막대에 대해 애니메이션 실행
//         const currentValue = 0;
//         const targetValue = seller_products[index].sales / seller_products[index].total_sales * 100
//         barAnimation(bars, index, currentValue, targetValue, animationDuration, updateInterval);
//     }



