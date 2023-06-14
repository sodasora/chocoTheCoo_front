import { BACK_BASE_URL, getSellerPermissionAPIView } from './api.js';
import { seller_products, seller_orders } from './seller_list.js';

//########## ↓ 정보 정의 ↓ ##########//
// 1) 누적판매량 total_sales_count
let total_sales_count = 0
for (const seller_product of seller_products) {
    total_sales_count += seller_product.sales_count
}
for (let i = 0; i < seller_products.length; i++) {
    seller_products[i]['total_sales_count'] = total_sales_count;
}
// 2) 총 등록상품 수 total_product_count
const total_product_count = seller_products.length

// 3) 총 발송완료주문
let total_sent_order = seller_products.filter(function (order) {
    return order.stats_name === "발송완료";
});
total_sent_order = total_sent_order.length

// 4) 총 미발송주문
let total_unsent_order = seller_orders.filter(function (order) {
    return order.status_name === "주문확인중" || order.status_name === "상품준비중";
});
total_unsent_order = total_unsent_order.length

// 5) 브랜드 좋아요(찜) - 미구현, 필드 추가 필요

// 6) 상품 총 좋아요(찜)
let total_product_wish = 0
for (const seller_product of seller_products) {
    total_product_wish += seller_product.wish_count
}

// 7) 평균평점
let total_star_score = 0
let is_score_products = seller_products.filter(function (product) {
    return product.star; //평점 존재하는 상품만 필터
});
for (const is_score_product of is_score_products) {
    total_star_score += is_score_product.star
}
let avg_star_score = total_star_score / is_score_products.length

// 8) 최고평점
let max_star_score = Math.max(...is_score_products.map(product => product.star));
//########## ↑ 정보 정의 ↑ ##########//


//########## ↓ 상단-현황박스 정보 입력 ↓ ##########//
// 1) 누적판매량
const sales_total_count = document.getElementById('sales_total_count')
sales_total_count.innerText = total_sales_count

// 2) 등록상품
const product_total_count = document.getElementById('product_total_count')
product_total_count.innerText = total_product_count

// 3) 발송완료주문
const sent_order = document.getElementById('sent_order')
sent_order.innerText = total_sent_order

// 4) 미발송주문
const unsent_order = document.getElementById('unsent_order')
unsent_order.innerText = total_unsent_order

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
    console.log("요기요기", seller_data)

    if (seller_data['company_img']) {
        document.getElementById("company-img").setAttribute("src", `${BACK_BASE_URL}` + seller_data['company_img'])
    }

    document.getElementById("company-name").innerText = seller_data["company_name"]
    document.getElementById("owner-name").innerText = seller_data["business_owner_name"]
}
sellerProfile()



// 그래프 애니메이션 함수
const barAnimation = (bars, index, currentValue, targetValue, duration, updateInterval) => {
    const increment = (targetValue - currentValue) / (duration / updateInterval);
    let currentWidth = currentValue;

    const interval = setInterval(() => {
        currentWidth += increment;
        bars[index].style.width = currentWidth + '%';

        if (Math.abs(currentWidth - targetValue) < Math.abs(increment)) {
            // 목표값에 도달한 경우
            bars[index].style.width = targetValue + '%';
            clearInterval(interval);
        }
    }, updateInterval);
};


//########## ↓ 하단-상품리스트 불러오기 ↓ ##########//
// 상품리스트 불러오기
function listView_product(product, type) {
    const contents = document.getElementById(`${type}_under-column-dox`);
    contents.innerHTML = '';
    console.log("contents", contents);
    console.log("상품확인1", product);
    console.log("type", type);

    const makeContent = (id) => {
        if (!product[id].image) {
            product[id].image = "/static/images/기본상품.png" // 상품이미지 없으면 기본이미지 대체
        }
        // 판매비중
        let ratio = Math.round(product[id].sales_count / product[id].total_sales_count * 1000) / 10
        if (!ratio) { // 판매비중이 없다면 0%
            ratio = 0
        }
        const content = document.createElement("div");
        content.setAttribute("class", 'under-column');
        content.innerHTML = `
        <text>${id + 1}. ${product[id].name}</text>
        <img style="width: 50px;" src="${product[id].image}" alt="상품이미지">
        <text style="font-size: 20px; float:inline-end">${product[id].sales_count}개</text>
        <div class="graph">
        <div>
        <div class="${type} bar"></div>
        <text style="font-size: 20px;">${ratio}%</text>
        </div>
        </div>
        `;
        return content;
    };

    //막대그래프 효과
    const bars = document.querySelectorAll(`.${type}.bar`); // 특정 class 선택
    console.log('bars', bars);
    const animationDuration = 1000; // 애니메이션 지속 시간 (ms)
    const updateInterval = 50000; // 갱신 주기 (ms)

    for (let index = 0; index < product.length; index++) {
        contents.appendChild(makeContent(index));
        // 각 막대에 대해 애니메이션 실행
        const currentValue = 0;
        const targetValue = seller_products[index].sales_count / seller_products[index].total_sales_count * 100
        barAnimation(bars, index, currentValue, targetValue, animationDuration, updateInterval);
    }





}
listView_product(seller_products, 'sells')
listView_product(seller_products, 'orders')
listView_product(seller_products, 'likes')
listView_product(seller_products, 'stars')
//########## ↑ 하단-상품리스트 불러오기 ↑ ##########//



