import {
    BACK_BASE_URL,
    FRONT_BASE_URL,
    getProductDetailAPIView,
    getReviewView,
    deletetProductDetailAPIView,
    getSellerInformationAPI,
} from './api.js';

export async function goEditReview(product_id, review_id) {
    window.location.href = `${FRONT_BASE_URL}/writereview.html?product_id=${product_id}&review_id=${review_id}`;
}


// 상품 정보보기
export async function viewProductDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('product_id');
    const response = await getProductDetailAPIView(productId);
    console.log(response)

    const productTitle = document.getElementById("product-title")
    const productImage = document.getElementById("product-image")
    const productPrice = document.getElementById("product-price")
    const productAmount = document.getElementById("product-amount");
    const productContent = document.getElementById("product-content")

    productTitle.innerText = response.name
    productContent.innerText = response.content
    productPrice.innerText = response.price.toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' })
    productAmount.innerText = "수량:  " + response.amount + " 개";
    const newImage = document.createElement("img");
    newImage.setAttribute('id', 'imagePut')

    if (response.image != null) {
        newImage.setAttribute("src", `${response.image}`)
        productImage.appendChild(newImage)
    } else {
        newImage.setAttribute("src", "/static/images/기본이미지.gif");
        productImage.appendChild(newImage)
    }



}

// 상품 수정하기
export async function goEditProduct(product_id) {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('product_id');

    window.location.href = `${FRONT_BASE_URL}/productregistration.html?product_id=${productId}`;
}

// 상품 삭제하기
export async function deleteProduct() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('product_id');

    try {
        deletetProductDetailAPIView(productId);

    } catch (error) {
        console.error(error);
    }
}


// 후기 조회
export async function showReview() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('product_id');

        const reviews = await getReviewView(productId);

        console.log(reviews);

        const review_list = document.getElementById("review-List");
        console.log(review_list);
        reviews.forEach((review) => {

            const newCol = document.createElement("div");
            newCol.setAttribute("class", "col");
            newCol.setAttribute("id", "review-card");

            const newCard = document.createElement("div");
            newCard.setAttribute("class", "card");
            newCard.setAttribute("id", "review-info");

            newCard.onclick = function () {
                getReviewView(review.id);
            };

            const img = document.createElement("img");
            img.setAttribute("class", "card-img-top");

            if (review.image) {
                img.setAttribute(
                    "src",
                    `${review.image}`
                );
            } else {
                img.setAttribute("src", '/static/images/기본이미지.gif')
            }

            newCard.appendChild(img);
            review_list.appendChild(newCol);

            const newCardBody = document.createElement("div");
            newCardBody.setAttribute("class", "card-body");
            newCard.appendChild(newCardBody);

            const newCardTitle = document.createElement("h5");
            newCardTitle.setAttribute("class", "card-title");
            newCardTitle.setAttribute("id", "review-title");
            newCardTitle.innerText = review.title;
            newCardBody.appendChild(newCardTitle);

            const newCardText = document.createElement("p");
            newCardText.setAttribute("class", "card-text");
            newCardText.setAttribute("id", "review-star");
            newCardText.innerText = "별점 : " + review.star;
            newCard.appendChild(newCardText)

            const newCardFooter = document.createElement("p");
            newCardFooter.setAttribute("class", "card-footer");
            newCardFooter.setAttribute("id", "review-content");
            newCardFooter.innerText = review.content;
            newCard.appendChild(newCardFooter)
            newCol.appendChild(newCard);

            const payload = localStorage.getItem("payload");
            const payload_parse = JSON.parse(payload);
            const user_id = payload_parse.user_id //로그인한 유저id

            if (review.user == user_id) {
                // 수정하기 버튼 생성
                const editReviewButton = document.createElement('button')
                editReviewButton.innerHTML = "수정하기"
                editReviewButton.setAttribute("id", `${review.id}th-item-update-button`)
                editReviewButton.addEventListener("click", function () {
                    goEditReview(productId, review.id);
                })
                newCard.appendChild(editReviewButton)
                newCol.appendChild(newCard);
            }

        }
        );

    } catch (error) {
        console.error(error)
    }


}

export async function reviewView() {

}


export async function getSellerInformation() {
    const response = await getSellerInformationAPI()
    if (response.status == 200) {

    }
}

export async function sellerpage() {

}



export async function setEventListener() {
    // html 요소 이벤트 리스너 추가
    document.getElementById("delete-btn").addEventListener("click", deleteProduct)
    document.getElementById("edit-btn").addEventListener("click", goEditProduct)
    // document.getElementById("detailView").addEventListener("click", detailView)
    document.getElementById("reviewView").addEventListener("click", reviewView)
    document.getElementById("sellerpage").addEventListener("click", sellerpage)
}



window.onload = async function () {
    viewProductDetail()
    setEventListener()
    showReview()
    getSellerInformation()
}