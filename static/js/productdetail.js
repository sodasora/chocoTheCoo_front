import {
    getProductDetailAPIView,
    deletetProductDetailAPIView,
    addToCartAPI,
    addToLikeAPI,
    BACK_BASE_URL,
    FRONT_BASE_URL,
    payload,
    reviewLikeAPI,
    sellerFollowAPI,
} from './api.js';


export async function goEditReview(product_id, review_id) {
    window.location.href = `${FRONT_BASE_URL}/writereview.html?product_id=${product_id}&review_id=${review_id}`;
}

const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('product_id');


export async function goSellerPage(user_id) {
    const url = `${FRONT_BASE_URL}/sellerpage.html?seller=${user_id}`
    window.location.href = url;
}

export async function sellerFollow(user_id) {
    const response = await sellerFollowAPI(user_id);
    const response_json = await response.json()
    if (response.status == 404) {
        alert("판매자 정보가 삭제되었거나, 로그인이 필요합니다.")
    } else if (response.status == 401) {
        alert("로그인이 필요합니다.")
        window.location.replace(`${FRONT_BASE_URL}/login.html`)
    } else if (response.status == 400) {
        alert(response_json.err)
    } else {

        document.getElementById("followerCount").innerText = `follower : ${response_json.followings}`
        const follow_button = document.getElementById("seller-follow-button")
        response.status == 200 ? follow_button.innerText = "Follow" : follow_button.innerText = "Unfollow"
    }

}
export async function setSellerInformation(information) {
    const follow_button = document.getElementById("seller-follow-button")
    const company_img = information.company_img == null ? "/static/images/store.gif" : information.company_img
    const sellerProfile = document.getElementById("seller-company_img")
    sellerProfile.style.backgroundImage = `url(${company_img})`
    document.getElementById("seller-company_name").innerText = information.company_name
    document.getElementById("seller-business_owner_name").innerText = information.business_owner_name
    document.getElementById("seller-contact_number").innerText = information.contact_number
    document.getElementById("followerCount").innerText = `follower : ${information.followings_count}`
    information.is_follow == false ? follow_button.innerText = "Follow" : follow_button.innerText = "Unfollow"

    sellerProfile.addEventListener("click", function () {
        goSellerPage(information.user)
    });
    follow_button.addEventListener("click", function () {
        sellerFollow(information.user)
    });

}

let myChart;

export async function getChart(information, evaluation) {

    var context = document
        .getElementById('myChart')
        .getContext('2d');

    if (myChart) {
        // 이전 차트의 데이터 값이 남아있으면 삭제
        myChart.destroy();
    }

    myChart = new Chart(context, {
        type: 'pie', // 차트의 형태
        data: { // 차트에 들어갈 데이터
            labels: [
                //x 축
                information.good, information.normal, information.bad,
            ],
            datasets: [
                { //데이터
                    label: 'test1', //차트 제목
                    fill: false, // line 형태일 때, 선 안쪽을 채우는지 안채우는지
                    data: [
                        evaluation.good, evaluation.normal, evaluation.bad,
                    ],
                    backgroundColor: [
                        //색상
                        'rgba(255, 99, 132)',
                        'rgba(54, 162, 235)',
                        'rgba(255, 206, 86)',
                    ],
                    borderColor: [
                        //경계선 색상
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                    ],
                    borderWidth: 1 //경계선 굵기
                }
            ]
        },
        options: {
            aspectRatio: 2,
            cutoutPercentage: 2,
            scales: {
                yAxes: [
                    {
                        ticks: {
                            beginAtZero: true,
                            display: false,
                        },
                        gridLines: {
                            display: false,
                            drawBorder: false,
                        },
                    }
                ],
            }
        }
    });
}

export async function setChartButton() {
    const nav_items = document.querySelectorAll(".chart-button")
    nav_items.forEach((item) => {
        item.style.backgroundColor = "antiquewhite"
        item.style.color = "black"
    })
}

export async function setChart(delivery_evaluation, feedback_evaluation, service_evaluation) {
    const delivery_information = {
        good: "빨라요 😁",
        normal: "보통 😐",
        bad: "느려요 😥",
    }
    const service_information = {
        good: "친절 해요 😁",
        normal: "보통 😐",
        bad: "불친절 해요 😥",
    }
    const feedback_information = {
        good: "재구매 의사 있어요 😁",
        normal: "좀 더 생각해 봐야 될 것 같아요 😐",
        bad: "재구매 의사 없어요 😥",
    }
    document.getElementById("deliveryEvaluation").addEventListener("click", function () {
        setChartButton()
        getChart(delivery_information, delivery_evaluation)
        document.getElementById("deliveryEvaluation").style.backgroundColor = "#522F18"
        document.getElementById("deliveryEvaluation").style.color = "white"

    })
    document.getElementById("serviceEvaluation").addEventListener("click", function () {
        setChartButton()
        getChart(service_information, service_evaluation)
        document.getElementById("serviceEvaluation").style.backgroundColor = "#522F18"
        document.getElementById("serviceEvaluation").style.color = "white"

    })
    document.getElementById("feedbackEvaluation").addEventListener("click", function () {
        setChartButton()
        getChart(feedback_information, feedback_evaluation)
        document.getElementById("feedbackEvaluation").style.backgroundColor = "#522F18"
        document.getElementById("feedbackEvaluation").style.color = "white"

    })
    getChart(delivery_information, delivery_evaluation)
}

// 상품 정보보기
export async function viewProductDetail() {
    const response = await getProductDetailAPIView(productId);
    const productStar = document.getElementById('productStar');
    const productStarText = document.getElementById('avgStar');
    const productTitle = document.getElementById("product-title")
    const productImage = document.getElementById("product-image")

    const productPrice = document.getElementById("product-price")
    const productAmount = document.getElementById("product-amount");
    const productContent = document.getElementById("productContent")
    const productLike = document.getElementById("productLike")
    const star = response.product_information.stars
    if (star) {
        productStar.innerText = "⭐"
        productStarText.innerText = star;
    }
    else {
        productStarText.innerText = "0.0"
    }
    const likes = response.product_information.likes
    if (likes) {
        productLike.innerText = likes
    }
    else { productLike.innerText = 0 }
    const like_image = response.in_wishlist == false ? '/static/images/좋아요x.png' : '/static/images/좋아요.png'
    const likeBtn = document.getElementById("addToLike")
    likeBtn.setAttribute("src", like_image)

    productTitle.innerText = response.name
    productContent.innerText = response.content
    productPrice.innerText = response.price.toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' })
    productAmount.innerText = "수량:  " + response.amount + " 개";
    const newImage = document.createElement("img");
    newImage.setAttribute('id', 'imagePut');


    if (response.image != null) {
        newImage.setAttribute("src", `${response.image}`)
        productImage.appendChild(newImage)
    } else {
        newImage.setAttribute("src", "/static/images/기본이미지.gif");
        productImage.appendChild(newImage)
    }
    // 품절일 경우 품절관련 표시
    if (response.item_state == 2) {
        // 이미지 soldout 표시
        const soldoutImage = document.createElement("img");
        soldoutImage.setAttribute("src", "/static/images/soldout.png");
        soldoutImage.setAttribute("class", "soldout");
        productImage.appendChild(soldoutImage)
        // 재고량 품절표시
        productAmount.innerText = "품절"
        // 장바구니 버튼 숨기기
        document.getElementById('cart-box').style = 'display: none;';
        document.getElementById('product-soldout-content').style = 'display: block;';
    }

    // 리뷰 정보 불러오기
    await showReview(response.product_reviews)
    // 판매자 정보 불러오기
    await setSellerInformation(response.seller)

    await setChart(response.delivery_evaluation, response.feedback_evaluation, response.service_evaluation)

    if (payload != null && payload.user_id == response.seller.user) {
        document.getElementById("productControlBox").style.display = "block"
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


export async function closeModal() {
    document.getElementById("modal").style.display = "none"
}

export async function showReviewDetailImage(review_image) {
    document.getElementById("modal").style.display = "flex"
    document.getElementById("modal").style.backgroundImage = `url(${review_image})`;
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
        const response_json = await response.json()
        const reviewLikeButton = document.getElementById(`reviewLikeButton_${review.id}`)
        const reviewDetailLike = document.getElementById(`reviewDetailLike_${review.id}`);

        if (reviewLikeButton == null) {
            reviewDetailLike.style.backgroundImage = `url(${like_image})`;
            document.getElementById(`reviewDetailLikeCount_${review.id}`).innerText = response_json.liking_people
        } else {
            reviewLikeButton.style.backgroundImage = `url(${like_image})`;
            document.getElementById(`reviewLikeCount_${review.id}`).innerText = response_json.liking_people
        }
    }
}



export async function getReviewData(element) {
    const review_list = document.getElementById("review-List")
    let star = '';
    for (let i = 0; i < element.star; i++) {
        star += '<img class="review-star" src="/static/images/별점.png">';
    }
    const review_image = element.image == null ? '/static/images/review_default.png' : element.image
    const profile_image = element.user.profile_image == null ? '/static/images/default.jpg' : element.user.profile_image
    const like_image = element.is_like == false ? '/static/images/좋아요x.png' : '/static/images/좋아요.png'

    review_list.innerHTML += `
    <div class="review-items" id=reviewItem_${element.id}>
        <div class="review-left-box">
            <img src="${review_image}" class="review-image-tag" id="review_modal_image${element.id}">
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

    const review_image = element.image == null ? '/static/images/review_default.png' : element.image
    const profile_image = element.user.profile_image == null ? '/static/images/default.jpg' : element.user.profile_image
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

    const reviewDetailLike = document.getElementById(`reviewLikeButton_${element.id}`);
    reviewDetailLike.addEventListener("click", function () {
        reviewLike(element);
    });
}


export async function getReviewDetailData(element) {
    let star = '';
    for (let i = 0; i < element.star; i++) {
        star += '<img class="review-detail-star" src="/static/images/별점.png">';
    }
    const review_image = element.image == null ? '/static/images/review_default.png' : element.image
    const profile_image = element.user.profile_image == null ? '/static/images/default.jpg' : element.user.profile_image
    const like_image = element.is_like == false ? '/static/images/좋아요x.png' : '/static/images/좋아요.png'

    const reviewDetailInnerHTML = `
    <div class="reviewDetailContainer">
    <div class="reviewDetailTopContainer">
        <div class="reviewDetailImageBox" style="background-image: url(${review_image});" id="review_detail_image_${element.id}">
        </div>
        <div class="reviewDetailTitleContainer">
            <div class="reviewDetailOwnerInformationBox">
                <div class="reviewDetailProfileGroup">
                    <div class="reviewDetailProfileImage" style="background-image: url(${profile_image});"></div>
                    <div class="reviewDetailNickname">${element.user.nickname}</div>
                </div>
                <div class="reviewDetailLikeGroup">
                    <span class="reviewDetailLikeCount" id="reviewDetailLikeCount_${element.id}">${element.review_liking_people_count}</span>
                    <div class="reviewDetailLikeButton" style="background-image: url(${like_image});" id="reviewDetailLike_${element.id}"></div>
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
        <div class="review-evaluation-box">
            <div class="review-evaluation">
            배송 : ${element.delivery_evaluation}
            </div>
            <div class="review-evaluation review-evaluation-center">
            서비스 : ${element.service_evaluation}
            </div>
            <div class="review-evaluation">
            재구매 의향 : ${element.feedback_evaluation}
            </div>
        </div>
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

    const reviewDetailLike = document.getElementById(`reviewDetailLike_${element.id}`);
    reviewDetailLike.addEventListener("click", function () {
        reviewLike(element);
    });

    const review_detail_image = document.getElementById(`review_detail_image_${element.id}`)
    review_detail_image.addEventListener("click", function () {
        showReviewDetailImage(review_image);
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


// export async function getSellerInformation() {
//     const response = await getSellerInformationAPI()
//     if (response.status == 200) {

//     }
// }

async function addToCart() {
    if (payload == null) {
        alert("로그인이 필요합니다.")
        window.location.replace(`${FRONT_BASE_URL}/login.html`)
    }

    const itemsCount = document.getElementById("cartCount").value
    addToCartAPI(productId, itemsCount)
}


async function addToLike() {
    const likes = document.getElementById("productLike")
    const likeBtn = document.getElementById("addToLike")
    const response = await addToLikeAPI(productId)
    const response_json = await response.json()

    if (response.status == 404) {
        alert("상품 정보를 찾을 수 없거나, 로그인이 필요합니다.")
    } else if (response.status == 401) {
        alert("로그인이 필요합니다.")
        window.location.replace(`${FRONT_BASE_URL}/login.html`)
    } else if (response.status == 201) {
        likeBtn.setAttribute("src", "/static/images/좋아요.png")
        likes.innerHTML = response_json.wish_list
    }
    else if (response.status == 200) {
        likeBtn.setAttribute("src", "/static/images/좋아요x.png")
        likes.innerHTML = response_json.wish_list
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
    document.getElementById("modal-close-button").addEventListener("click", closeModal)
}


window.onload = async function () {
    if (productId == null) {
        alert("상품 정보를 찾을 수 없습니다.")
        window.location.replace(`${FRONT_BASE_URL}/index.html`)
    } else {
        viewProductDetail()
        setEventListener()
    }
}
