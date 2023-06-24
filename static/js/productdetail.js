import { getProductDetailAPIView, getReviewView, deletetProductDetailAPIView, addToCartAPI, addToLikeAPI, BACK_BASE_URL, FRONT_BASE_URL } from './api.js';

export async function goEditReview(product_id, review_id) {
    window.location.href = `${FRONT_BASE_URL}/writereview.html?product_id=${product_id}&review_id=${review_id}`;
}
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('product_id');

// 상품 정보보기
export async function viewProductDetail() {
    const response = await getProductDetailAPIView(productId);
    console.log(response)

    const productStar = document.getElementById('productStar');
    const productTitle = document.getElementById("product-title")
    const productImage = document.getElementById("product-image")
    const productPrice = document.getElementById("product-price")
    const productAmount = document.getElementById("product-amount");
    // const productContent = document.getElementById("product-content")
    const productLike = document.getElementById("productLike")
    const star = response.product_information.stars
    if (star) {
        productStar.innerText = "⭐".repeat(star);
    }
    else {
        productStar.innerText = "아직 등록된 리뷰가 없습니다"
        productStar.style.fontSize = "0.7em"
    }
    const likes = response.product_information.likes
    if (likes) {
        productLike.innerText = likes
    }
    else { productLike.innerText = 0 }

    productTitle.innerText = response.name
    // productContent.innerText = response.content
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
export async function goEditProduct() {
    window.location.href = `${FRONT_BASE_URL}/productregistration.html?product_id=${productId}`;
}

// 상품 삭제하기
export async function deleteProduct() {

    try {
        const deleteConfirm = confirm("정말 삭제하시겠습니까?")
        if (deleteConfirm) {
            deletetProductDetailAPIView(productId);
        }

    } catch (error) {
        console.error(error);
    }
}


// 후기 조회
export async function showReview() {
    try {
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


async function addToCart() {
    const itemsCount = document.getElementById("cartCount").value
    console.log(itemsCount)
    const response = await addToCartAPI(productId, itemsCount)
    alert("장바구니에 추가되었습니다.")
}

async function addToLike() {
    const likes = document.getElementById("productLike")
    const likesCount = document.getElementById("productLike").innerHTML
    const likeBtn = document.getElementById("addToLike")
    const response = await addToLikeAPI(productId)

    if (response.status == 201) {
        likeBtn.setAttribute("src", "/static/images/좋아요.png")
        likes.innerHTML = parseInt(likesCount) + 1
    }
    else if (response.status == 204) {
        likeBtn.setAttribute("src", "/static/images/좋아요x.png")
        likes.innerHTML = parseInt(likesCount) - 1
    }
    else {
        console.log(response.status)
    }
}


export async function setEventListener() {
    // html 요소 이벤트 리스너 추가
    document.getElementById("delete-btn").addEventListener("click", deleteProduct)
    document.getElementById("edit-btn").addEventListener("click", goEditProduct)
    document.getElementById("addToLike").addEventListener("click", addToLike)
    document.getElementById("addToCart").addEventListener("click", addToCart)

}



window.onload = async function () {
    viewProductDetail()
    showReview()
    setEventListener()
}