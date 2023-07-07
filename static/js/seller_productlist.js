import { FRONT_BASE_URL, getAllProductListAPIView, editProductDetailAPIView, productDetail, deleteProductDetailAPIView } from './api.js';


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

        const content = document.createElement("tr");

        const createdAtTd = document.createElement('td');
        const createdAtText = document.createTextNode(product[id].created_at.substr(0, 10));
        createdAtTd.appendChild(createdAtText);

        const nameTd = document.createElement('td');
        const nameText = document.createTextNode(product[id].name);
        nameTd.appendChild(nameText);

        const productImgTd = document.createElement('td');
        productImgTd.style = "position:relative;";
        const productImgDiv = document.createElement('div');
        productImgDiv.classList.add('product-img');
        productImgDiv.style.backgroundImage = `url(${product[id].image})`;
        productImgTd.appendChild(productImgDiv)

        // 이미지 확대보기
        const productImgDivZoom = document.createElement("div");
        productImgDivZoom.classList.add("product-img-zoom");
        productImgDivZoom.style.backgroundImage = `url(${product[id].image})`;
        productImgDivZoom.style.cursor = `pointer`;
        productImgDivZoom.onclick = function () { // 해당 상품 상세보기로 이동
            productDetail(product[id].id);
        };
        productImgTd.appendChild(productImgDivZoom)

        // 이미지 확대보기 Zoom 효과주기
        productImgTd.addEventListener("mouseover", function () {
            productImgDivZoom.style.display = "flex";
            productImgDiv.style.display = "none";
        })
        productImgTd.addEventListener("mouseleave", function () {
            productImgDivZoom.style.display = "none";
            productImgDiv.style.display = "inline-block";
        })



        const priceTd = document.createElement('td');
        const priceText = document.createTextNode((product[id].price).toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' }));
        priceTd.appendChild(priceText);

        const amountTd = document.createElement('td');
        const amountSpan = document.createElement('span');
        let amountText = document.createTextNode((product[id].amount).toLocaleString());




        // 품절(2)일 경우 표시 변경
        if (product[id].item_state == 2) {
            // 제목 취소선 표시
            nameTd.style = "text-decoration: line-through;"
            // 수량 품절표시
            amountText = document.createTextNode("품절");
            amountTd.style = 'font-weight: bold;';
            // 상품이미지 품절표시
            const soldoutImg = document.createElement("img");
            soldoutImg.setAttribute('src', '/static/images/soldout.png');
            soldoutImg.setAttribute('class', 'soldout');
            productImgDiv.appendChild(soldoutImg);
            // 상품확대이미지 품절표시
            const soldoutImgZoom = document.createElement("img");
            soldoutImgZoom.setAttribute('src', '/static/images/soldout.png');
            soldoutImgZoom.setAttribute('class', 'soldoutZoom');
            productImgDivZoom.appendChild(soldoutImgZoom);
            // 삭제된 상품(6)일 경우 표시 변경
        } else if (product[id].item_state == 6) {
            // 제목 취소선 표시
            nameTd.style = "text-decoration: red line-through;"
            // 수량 삭제표시
            amountText = document.createTextNode("삭제상품");
            amountTd.style = 'font-weight: bold;';
            // 가격 삭제표시
            priceTd.style = "text-decoration: red line-through;"
            // 상품이미지 삭제표시
            const deleteImg = document.createElement("img");
            deleteImg.setAttribute('src', '/static/images/품절.png');
            deleteImg.setAttribute('class', 'delete');
            productImgDiv.appendChild(deleteImg);
            // 상품확대이미지 삭제표시
            const deleteImgZoom = document.createElement("img");
            deleteImgZoom.setAttribute('src', '/static/images/품절.png');
            deleteImgZoom.setAttribute('class', 'deleteZoom');
            productImgDivZoom.appendChild(deleteImgZoom);
        }
        amountSpan.appendChild(amountText);
        amountTd.appendChild(amountSpan);

        // 재고수량 마우스호버 효과주기
        amountSpan.addEventListener("mouseover", function () {
            amountSpan.style = 'font-weight: bold;';
            amountSpan.style.cursor = 'pointer';
        })
        amountSpan.addEventListener("mouseleave", function () {
            amountSpan.style = 'font-weight: none;';
            amountSpan.style.cursor = 'none';
        })

        // 재고수량 수정버튼 생성
        const amountDiv = document.createElement('div');
        amountDiv.style = "text-align: center; justify-content: center;";
        const amountInput = document.createElement('input');
        amountInput.setAttribute('value', product[id].amount);
        amountInput.setAttribute('type', 'number');
        amountInput.setAttribute('step', '10');
        amountInput.setAttribute('min', '0');
        amountInput.setAttribute('max', '1000');
        const inboundBtn = document.createElement('button');
        inboundBtn.setAttribute('class', 'amountBtn');
        inboundBtn.setAttribute('type', 'button');
        inboundBtn.innerText = "변경";
        amountDiv.appendChild(amountInput);
        amountDiv.appendChild(inboundBtn);

        // 상품복구버튼 생성
        const restoreDiv = document.createElement('div');
        const restoreBtn = document.createElement('button');
        restoreBtn.setAttribute('class', 'amountBtn');
        restoreBtn.setAttribute('type', 'button');
        restoreBtn.innerText = "상품복구";

        // 상품삭제버튼 생성
        const deleteDiv = document.createElement('div');
        const deleteBtn = document.createElement('button');
        deleteBtn.setAttribute('class', 'amountBtn');
        deleteBtn.setAttribute('type', 'button');
        deleteBtn.innerText = "상품삭제";
        deleteDiv.appendChild(deleteBtn);

        // 취소버튼 생성
        const cancelBtn = document.createElement('button');
        cancelBtn.setAttribute('class', 'amountBtn');
        cancelBtn.setAttribute('type', 'button');
        cancelBtn.innerText = "취소";



        if (product[id].item_state == 6) { // 삭제(6)상태
            amountSpan.addEventListener("click", function () { // 해당 상품 상품복구버튼 활성화
                restoreDiv.appendChild(restoreBtn);
                restoreDiv.appendChild(cancelBtn);
                amountTd.appendChild(restoreDiv)
                restoreDiv.style.display = "block";
            });
        } else if (product[id].item_state == 2) { // 품절(2)상태
            amountSpan.addEventListener("click", function () { // 해당 상품 재고변경,상품삭제버튼 활성화
                restoreDiv.appendChild(deleteBtn);
                amountTd.appendChild(restoreDiv)
                restoreDiv.style.display = "block";
                amountDiv.appendChild(cancelBtn);
                amountTd.appendChild(amountDiv)
                amountDiv.style.display = "block";
            });
        } else {
            amountSpan.addEventListener("click", function () { // 해당 상품 재고변경 활성화
                amountDiv.appendChild(cancelBtn);
                amountTd.appendChild(amountDiv)
                amountDiv.style.display = "block";
            });
        }

        inboundBtn.addEventListener("click", async function () { // 변경버튼 - 해당 상품 재고변경 비활성화
            const productId = product[id].id
            const formdata = new FormData()
            formdata.append('name', product[id].name)
            formdata.append('content', product[id].content)
            formdata.append('price', product[id].price)
            formdata.append('amount', amountInput.value)
            const response = await editProductDetailAPIView(productId, formdata)
            if (response.status == 200) {
                alert(`재고수량이 ${amountInput.value}개로 변경되었습니다.`)
                window.location.reload();
            }
        });
        deleteBtn.addEventListener("click", async function () { // 삭제버튼 - 해당 상품 삭제상태로 변경
            const productId = product[id].id
            const response = await deleteProductDetailAPIView(productId)
            if (response.status == 204) {
                alert(`${product[id].name} 상품이 삭제되었습니다.`)
                window.location.reload();
            }
        });
        restoreBtn.addEventListener("click", async function () { // 복구버튼 - 해당 상품 판매상태로 복구
            const productId = product[id].id
            const formdata = new FormData()
            formdata.append('name', product[id].name)
            formdata.append('content', product[id].content)
            formdata.append('price', product[id].price)
            formdata.append('amount', 0) // 재고량 0으로 복구
            formdata.append('item_state', 2) // 품절(2)상태로 복구
            const response = await editProductDetailAPIView(productId, formdata)
            if (response.status == 200) {
                alert(`${product[id].name} 상품이 복구되었습니다. 재고량을 수정해주세요.`)
                window.location.reload();
            }
        });
        cancelBtn.addEventListener("click", function () { // 취소버튼 - 해당 상품 재고변경 비활성화
            restoreDiv.style.display = "none";
            deleteDiv.style.display = "none";
            amountDiv.style.display = "none";
        });



        const salesTd = document.createElement('td');
        const salesText = document.createTextNode((product[id].sales).toLocaleString());
        salesTd.appendChild(salesText);

        const scoreTd = document.createElement('td');
        const starScoreDiv = document.createElement('div');
        starScoreDiv.id = 'star-score';
        scoreTd.appendChild(starScoreDiv);
        if (product[id].stars) {
            const scoreText = document.createTextNode(`⭐${(product[id].stars).toFixed(1)}`);
            scoreTd.appendChild(scoreText);
        } else {
            const scoreText = document.createTextNode("리뷰없음")
            scoreTd.appendChild(scoreText);
        }

        const likesTd = document.createElement('td');
        const likesImg = document.createElement('img');
        likesImg.src = 'static/images/좋아요.png';
        likesImg.alt = '브랜드좋아요';
        likesImg.style.width = '20px';
        likesTd.appendChild(likesImg);
        const likesText = document.createTextNode(product[id].likes);
        likesTd.appendChild(likesText);

        content.appendChild(createdAtTd);
        content.appendChild(nameTd);
        content.appendChild(productImgTd);
        content.appendChild(priceTd);
        content.appendChild(amountTd);
        content.appendChild(salesTd);
        content.appendChild(scoreTd);
        content.appendChild(likesTd);

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

    // 상품이 없을 경우 표시
    if (numOfContent == 0) {
        buttons.innerText = "등록된 상품이 없습니다."
    }
}



// ↓상품 목록 가져오기 관련 코드↓ //
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


// 로그인한 판매자의 전체 상품 목록 불러오기
const seller_products = await getAllProductListAPIView(user_id)

// ↑상품 목록 가져오기 관련 코드↑ // 

// 상품 목록 페이지네이션 실행
if (seller_products.length > 0) {
    const productfilter = document.getElementById("filter")
    seller_products.sort((a, b) => (a.created_at < b.created_at ? 1 : -1)); // "상품등록일" 최신순 정렬
    
    productfilter.addEventListener("change", (e) => {
        if (e.target.value == 'recent') { // 최신 등록순
            const seller_products_filter = seller_products.sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
            paginationView_product(seller_products_filter)
        } else if (e.target.value == 'old') { // 오래된순
            const seller_products_filter = seller_products.sort((a, b) => (a.created_at > b.created_at ? 1 : -1));
            paginationView_product(seller_products_filter)
        } else if (e.target.value == 'sales') { // 판매순
            const seller_products_filter = seller_products.sort((a, b) => (a.sales < b.sales ? 1 : -1));
            paginationView_product(seller_products_filter)
        } else if (e.target.value == 'amount') { // 재고수량 오름차순 + '판매중(1)' 상태
            seller_products.sort((a, b) => (a.amount > b.amount ? 1 : -1));
            const seller_products_filter = seller_products.filter(function (product) {
                return [1].includes(product.item_state)
            });
            paginationView_product(seller_products_filter)
        } else if (e.target.value == 'delete') { // 삭제(6)상품만 보기
            const seller_products_filter = seller_products.filter(function (product) {
                return [6].includes(product.item_state)
            });
            paginationView_product(seller_products_filter)
        } else if (e.target.value == 'soldout') { // 품절(2)상품만 보기
            const seller_products_filter = seller_products.filter(function (product) {
                return [2].includes(product.item_state)
            });
            paginationView_product(seller_products_filter)
        }
    });
    paginationView_product(seller_products)
}
