import {
    getProductDetailAPIView,
    getReviewView,
    deletetProductDetailAPIView,
    addToCartAPI,
    addToLikeAPI,
    BACK_BASE_URL,
    FRONT_BASE_URL,
    payload,
    reviewLikeAPI,
} from './api.js';

export async function goEditReview(product_id, review_id) {
    window.location.href = `${FRONT_BASE_URL}/writereview.html?product_id=${product_id}&review_id=${review_id}`;
}

const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('product_id');


export async function goSellerPage() {

}


export async function setSellerInformation(information) {
    const company_img = information.company_img == null ? "/static/images/pepe.jpg" : information.company_img
    document.getElementById("seller-company_img").style.backgroundImage = `url(${company_img})`
    document.getElementById("seller-company_name").innerText = information.company_name
    document.getElementById("seller-business_owner_name").innerText = information.business_owner_name
    document.getElementById("seller-contact_number").innerText = information.contact_number
}



// 상품 정보보기
export async function viewProductDetail() {
    const response = await getProductDetailAPIView(productId);

    const productStar = document.getElementById('productStar');
    const productTitle = document.getElementById("product-title")
    const productImage = document.getElementById("product-image")
    const productPrice = document.getElementById("product-price")
    const productAmount = document.getElementById("product-amount");
    const productContent = document.getElementById("productContent")
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
    // 리뷰 정보 불러오기
    await showReview(response.product_reviews)
    // 판매자 정보 불러오기
    await setSellerInformation(response.seller)
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




export async function reviewLike(review) {

    const response = await reviewLikeAPI(review.id)
    if (response.status == 404) {
        alert("리뷰글이 삭제되었거나, 로그인이 필요합니다.")
    } else if (response.status == 401) {
        alert("로그인이 필요합니다.")
        window.location.replace(`${FRONT_BASE_URL}/login.html`)

    } else {
        const like_image = response.status == 200 ? '/static/images/좋아요x.png' : '/static/images/좋아요.png';
        document.getElementById(`reviewLikeButton_${review.id}`).style.backgroundImage = `url(${like_image})`;
        const response_json = await response.json()
        document.getElementById(`reviewLikeCount_${review.id}`).innerText = response_json.liking_people
    }
}



export async function getReviewData(element) {
    const review_list = document.getElementById("review-List")
    let star = '';
    for (let i = 0; i < element.star; i++) {
        star += '<img class="review-star" src="/static/images/별점.png">';
    }

    const review_image = element.image == null ? '/static/images/store.gif' : element.image
    const profile_image = element.user.profile_image == null ? '/static/images/avatar.png' : element.user.profile_image
    const like_image = element.is_like == false ? '/static/images/좋아요x.png' : '/static/images/좋아요.png'

    review_list.innerHTML += `
    <div class="review-items" id=reviewItem_${element.id}>
        <div class="review-left-box">
            <img src="${review_image}" class="review-image-tag">
        </div>
        <div class="review-right-box">
            <div class="review-owner-box">
            <div class="review-owner-image" style="background-image: url(${profile_image});">
            </div>
                <span class="review-owenr-nick-name">
                    ${element.user.nickname}
                </span>
                <div class="review-like-box">
                    <span class="review-like-count" id=reviewLikeCount_${element.id} >${element.review_liking_people_count}</span>
                    <div class="review-like-button" style="background-image: url(${like_image});" id=reviewLikeButton_${element.id}>
                    </div>
                </div>
            </div>
            <div class="review-content-box">
                <div class="review-content-left-box">
                    <input class="review-title" type="text" value="${element.title}" readonly id="reviewTitle_${element.id}">
                    <input  type="hidden" value="${element.id}" readonly id="reviewHidden_${element.id}">
                </div>
                <div class="review-content-right-box">
                    <div class="review-star-box">
                        ${star}
                    </div>
                </div>
            </div>
            <div class="review-information-box">
                <span class="review-create-at">${element.updated_at}</span>
                <button type="button" class="review-detail-button" id=reviewDetail_${element.id}> 상세보기 </button>
            </div>
        </div>
    </div>
    `
}


export async function closeReview(element) {
    let star = '';
    for (let i = 0; i < element.star; i++) {
        star += '<img class="review-star" src="/static/images/별점.png">';
    }

    const review_image = element.image == null ? '/static/images/store.gif' : element.image
    const profile_image = element.user.profile_image == null ? '/static/images/avatar.png' : element.user.profile_image
    const like_image = element.is_like == false ? '/static/images/좋아요x.png' : '/static/images/좋아요.png'

    const reviewData = `
    <div class="review-items" id=reviewItem_${element.id}>
        <div class="review-left-box">
            <img src="${review_image}" class="review-image-tag">
        </div>
        <div class="review-right-box">
            <div class="review-owner-box">
            <div class="review-owner-image" style="background-image: url(${profile_image});">
            </div>
                <span class="review-owenr-nick-name">
                    ${element.user.nickname}
                </span>
                <div class="review-like-box">
                    <span class="review-like-count" id=reviewLikeCount_${element.id} >${element.review_liking_people_count}</span>
                    <div class="review-like-button" style="background-image: url(${like_image});" id=reviewLikeButton_${element.id}>
                    </div>
                </div>
            </div>
            <div class="review-content-box">
                <div class="review-content-left-box">
                    <input class="review-title" type="text" value="${element.title}" readonly id="reviewTitle_${element.id}">
                    <input  type="hidden" value="${element.id}" readonly id="reviewHidden_${element.id}">
                </div>
                <div class="review-content-right-box">
                    <div class="review-star-box">
                        ${star}
                    </div>
                </div>
            </div>
            <div class="review-information-box">
                <span class="review-create-at">${element.updated_at}</span>
                <button type="button" class="review-detail-button" id=reviewDetail_${element.id}> 상세보기 </button>
            </div>
        </div>
    </div>
    `

    const reviewItem = document.getElementById(`reviewItem_${element.id}`)
    reviewItem.innerHTML = reviewData
    reviewItem.style.height = "10rem";

    const reviewDetailButton = document.getElementById(`reviewDetail_${element.id}`);
    reviewDetailButton.addEventListener("click", function () {
        getReviewDetailData(element)
    });
}


export async function getReviewDetailData(element) {
    let star = '';
    for (let i = 0; i < element.star; i++) {
        star += '<img class="review-detail-star" src="/static/images/별점.png">';
    }



    const review_image = element.image == null ? '/static/images/store.gif' : element.image
    const profile_image = element.user.profile_image == null ? '/static/images/avatar.png' : element.user.profile_image
    const like_image = element.is_like == false ? '/static/images/좋아요x.png' : '/static/images/좋아요.png'

    const reviewDetailInnerHTML = `
    <div class="reviewDetailContainer">
    <div class="reviewDetailTopContainer">
        <div class="reviewDetailImageBox" style="background-image: url(${review_image});">
        </div>
        <div class="reviewDetailTitleContainer">
            <div class="reviewDetailOwnerInformationBox">
                <div class="reviewDetailProfileGroup">
                    <div class="reviewDetailProfileImage" style="background-image: url(${profile_image});"></div>
                    <div class="reviewDetailNickname">${element.user.nickname}</div>
                </div>
                <div class="reviewDetailLikeGroup">
                    <span class="reviewDetailLikeCount">${element.review_liking_people_count}</span>
                    <div class="reviewDetailLikeButton" style="background-image: url(${like_image});"></div>
                </div>
            </div>
            <div class="reviewDetailTitleBox">
                <div class="reviewDetailTitle"><span>${element.title}</span></div>
            </div>
            <div class="reviewDetailStarBox">
                ${star}
                <span class="reviewDetailCreated_at">${element.updated_at}</span>
            </div>
        </div>
    </div>
    <div class="reviewDetailBottomContainer">
        <div class="reviewDetailContext"><span>${element.content}</span></div>
    </div>
    <div class="reviewDetailControlContainer">
        <div class="review-control-box">
            <button class="review-control-button" id="editReviewInformation_${element.id}">수정</button>
            <button class="review-control-button" id="closeReviewDetailInformation_${element.id}">접기</button>
        </div>
    </div>
</div>
`;


    const reviewItem = document.getElementById(`reviewItem_${element.id}`)
    reviewItem.innerHTML = reviewDetailInnerHTML
    reviewItem.style.height = "30rem";

    const closeReviewDetailInformation = document.getElementById(`closeReviewDetailInformation_${element.id}`);
    closeReviewDetailInformation.addEventListener("click", function () {
        closeReview(element)
    });

    if (payload != null) {
        if (payload.user_id == element.user.id) {
            const editReviewInformation = document.getElementById(`editReviewInformation_${element.id}`);
            editReviewInformation.addEventListener("click", async function () {
                goEditReview(element.product, element.id)
            });
        } else {
            document.getElementById(`editReviewInformation_${element.id}`).style.display = "none"
        }
    }

}

// 전체 후기 조회
export async function showReview(reviews) {
    try {

        await reviews.forEach((element) => {
            getReviewData(element)

        });

        await reviews.forEach((element) => {
            const reviewLikeButton = document.getElementById(`reviewLikeButton_${element.id}`);
            reviewLikeButton.addEventListener("click", function () {
                reviewLike(element);
            });
        })

        await reviews.forEach((element) => {
            const reviewDetailButton = document.getElementById(`reviewDetail_${element.id}`);
            reviewDetailButton.addEventListener("click", function () {
                getReviewDetailData(element)
            });
        });


    } catch (error) {
        console.error(error)
    }


}


export async function getSellerInformation() {
    const response = await getSellerInformationAPI()
    if (response.status == 200) {

    }
}

export async function sellerpage() {

}

async function addToCart() {
    const itemsCount = document.getElementById("cartCount").value
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

async function setDisplayView() {
    const nav_items = document.querySelectorAll(".option-container")
    nav_items.forEach((item) => {
        item.style.display = "none"
    })
}

export async function reviewView() {
    setDisplayView()
    document.getElementById("review-List").style.display = "block"
}

export async function productInformationView() {
    setDisplayView()
    document.getElementById("productInformation").style.display = "block"
}

export async function sellerpageView() {
    setDisplayView()
    document.getElementById("sellerInformationContainer").style.display = "block"
}

export async function setEventListener() {
    // html 요소 이벤트 리스너 추가
    document.getElementById("delete-btn").addEventListener("click", deleteProduct)
    document.getElementById("edit-btn").addEventListener("click", goEditProduct)
    document.getElementById("addToLike").addEventListener("click", addToLike)
    document.getElementById("addToCart").addEventListener("click", addToCart)
    document.getElementById("reviewView").addEventListener("click", reviewView)
    document.getElementById("detailView").addEventListener("click", productInformationView)
    document.getElementById("sellerpage").addEventListener("click", sellerpageView)
    document.getElementById("seller-company_img").addEventListener("click", goSellerPage)
}


window.onload = async function () {
    viewProductDetail()
    setEventListener()
}