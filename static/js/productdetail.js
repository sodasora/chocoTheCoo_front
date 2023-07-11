import {
    getProductDetailAPIView,
    deleteProductDetailAPIView,
    addToCartAPI,
    addToLikeAPI,
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
    } else if (response.status == 422) {
        alert("판매자 사용자만 팔로우 할 수 있습니다.")
    } else if (response.status == 400) {
        alert("스스로를 팔로우 할 수 없습니다.")
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
    document.getElementById("followerCount").innerText = `follower : ${information.follower_count}`
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

    const context = document
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
    // 품절(2)일 경우 품절관련 표시
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

    // 삭제(6)상품일 경우 삭제관련 표시
    if (response.item_state == 6) {
        // 이미지 soldout 표시
        const soldoutImage = document.createElement("img");
        soldoutImage.setAttribute("src", "/static/images/품절.png");
        soldoutImage.setAttribute("class", "delete");
        productImage.appendChild(soldoutImage)
        // 재고량 삭제표시
        productAmount.innerText = "삭제상품"
        // 장바구니 버튼 숨기기
        document.getElementById('cart-box').style = 'display: none;';
        document.getElementById('product-delete-content').style = 'display: block;';
        // 수정하기 삭제하기 버튼 숨기기
        document.getElementById('edit-btn').style = 'display: none;';
        document.getElementById('delete-btn').style = 'display: none;';
        // 복구하기 버튼 보이기
        document.getElementById('restore-btn').style = 'display: inline-block;';
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
            deleteProductDetailAPIView(productId);
        }
        if (response.status == 204) {
            alert("상품 삭제 완료!")
            window.location.href = "sellerpage.html";
        } else {
            alert("상품 삭제 실패!")
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
    const reviewItems = document.createElement('div');
    reviewItems.classList.add('review-items');
    reviewItems.id = `reviewItem_${element.id}`;

    const reviewLeftBox = document.createElement('div');
    reviewLeftBox.classList.add('review-left-box');

    const reviewImageTag = document.createElement('img');
    reviewImageTag.src = review_image;
    reviewImageTag.classList.add('review-image-tag');
    reviewImageTag.id = `review_modal_image${element.id}`;

    const reviewRightBox = document.createElement('div');
    reviewRightBox.classList.add('review-right-box');

    const reviewOwnerBox = document.createElement('div');
    reviewOwnerBox.classList.add('review-owner-box');

    const reviewOwnerImage = document.createElement('div');
    reviewOwnerImage.classList.add('review-owner-image');
    reviewOwnerImage.style.backgroundImage = `url(${profile_image})`;

    const reviewOwnerNickName = document.createElement('span');
    reviewOwnerNickName.classList.add('review-owner-nick-name');
    reviewOwnerNickName.innerText = element.user.nickname;

    const reviewLikeBox = document.createElement('div');
    reviewLikeBox.classList.add('review-like-box');

    const reviewLikeCount = document.createElement('span');
    reviewLikeCount.classList.add('review-like-count');
    reviewLikeCount.id = `reviewLikeCount_${element.id}`;
    reviewLikeCount.innerText = element.review_liking_people_count;

    const reviewLikeButton = document.createElement('div');
    reviewLikeButton.classList.add('review-like-button');
    reviewLikeButton.style.backgroundImage = `url(${like_image})`;
    reviewLikeButton.id = `reviewLikeButton_${element.id}`;

    const reviewContentBox = document.createElement('div');
    reviewContentBox.classList.add('review-content-box');

    const reviewContentLeftBox = document.createElement('div');
    reviewContentLeftBox.classList.add('review-content-left-box');

    const reviewTitle = document.createElement('input');
    reviewTitle.classList.add('review-title');
    reviewTitle.type = 'text';
    reviewTitle.value = element.title;
    reviewTitle.id = `reviewTitle_${element.id}`;
    reviewTitle.readOnly = true;

    const reviewHidden = document.createElement('input');
    reviewHidden.type = 'hidden';
    reviewHidden.value = element.id;
    reviewHidden.id = `reviewHidden_${element.id}`;
    reviewHidden.readOnly = true;

    const reviewContentRightBox = document.createElement('div');
    reviewContentRightBox.classList.add('review-content-right-box');

    const reviewStarBox = document.createElement('div');
    reviewStarBox.classList.add('review-star-box');
    reviewStarBox.innerHTML = `${star}`;

    const reviewInformationBox = document.createElement('div');
    reviewInformationBox.classList.add('review-information-box');

    const reviewCreateAt = document.createElement('span');
    reviewCreateAt.classList.add('review-create-at');
    reviewCreateAt.innerText = element.updated_at;

    const reviewDetailButton = document.createElement('button');
    reviewDetailButton.type = 'button';
    reviewDetailButton.classList.add('review-detail-button');
    reviewDetailButton.id = `reviewDetail_${element.id}`;
    reviewDetailButton.innerText = '상세보기';

    reviewLikeBox.appendChild(reviewLikeCount);
    reviewLikeBox.appendChild(reviewLikeButton);
    reviewContentLeftBox.appendChild(reviewTitle);
    reviewContentLeftBox.appendChild(reviewHidden);
    reviewContentRightBox.appendChild(reviewStarBox);
    reviewInformationBox.appendChild(reviewCreateAt);
    reviewInformationBox.appendChild(reviewDetailButton);
    reviewOwnerImage.appendChild(reviewOwnerNickName);
    reviewOwnerBox.appendChild(reviewOwnerImage);
    reviewOwnerBox.appendChild(reviewOwnerNickName);
    reviewOwnerBox.appendChild(reviewLikeBox);
    reviewContentBox.appendChild(reviewContentLeftBox);
    reviewContentBox.appendChild(reviewContentRightBox);
    reviewRightBox.appendChild(reviewOwnerBox);
    reviewRightBox.appendChild(reviewContentBox);
    reviewRightBox.appendChild(reviewInformationBox);
    reviewLeftBox.appendChild(reviewImageTag);
    reviewItems.appendChild(reviewLeftBox);
    reviewItems.appendChild(reviewRightBox);

    review_list.appendChild(reviewItems);
}


export async function closeReview(element) {
    let star = '';
    for (let i = 0; i < element.star; i++) {
        star += '<img class="review-star" src="/static/images/별점.png">';
    }

    const review_image = element.image == null ? '/static/images/review_default.png' : element.image
    const profile_image = element.user.profile_image == null ? '/static/images/default.jpg' : element.user.profile_image
    const like_image = element.is_like == false ? '/static/images/좋아요x.png' : '/static/images/좋아요.png'

    const reviewItems = document.createElement('div');
    reviewItems.classList.add('review-items');
    reviewItems.id = `reviewItem_${element.id}`;

    const reviewLeftBox = document.createElement('div');
    reviewLeftBox.classList.add('review-left-box');

    const reviewImageTag = document.createElement('img');
    reviewImageTag.src = `${review_image}`;
    reviewImageTag.classList.add('review-image-tag');

    reviewLeftBox.appendChild(reviewImageTag);
    reviewItems.appendChild(reviewLeftBox);

    const reviewRightBox = document.createElement('div');
    reviewRightBox.classList.add('review-right-box');

    const reviewOwnerBox = document.createElement('div');
    reviewOwnerBox.classList.add('review-owner-box');

    const reviewOwnerImage = document.createElement('div');
    reviewOwnerImage.style.backgroundImage = `url(${profile_image})`;
    reviewOwnerImage.classList.add('review-owner-image');

    const reviewOwnerNickName = document.createElement('span');
    reviewOwnerNickName.classList.add('review-owner-nick-name');
    reviewOwnerNickName.textContent = element.user.nickname;

    const reviewLikeBox = document.createElement('div');
    reviewLikeBox.classList.add('review-like-box');

    const reviewLikeCount = document.createElement('span');
    reviewLikeCount.id = `reviewLikeCount_${element.id}`;
    reviewLikeCount.classList.add('review-like-count');
    reviewLikeCount.textContent = element.review_liking_people_count;

    const reviewLikeButton = document.createElement('div');
    reviewLikeButton.id = `reviewLikeButton_${element.id}`;
    reviewLikeButton.classList.add('review-like-button');
    reviewLikeButton.style.backgroundImage = `url(${like_image})`;

    reviewLikeBox.appendChild(reviewLikeCount);
    reviewLikeBox.appendChild(reviewLikeButton);

    reviewOwnerBox.appendChild(reviewOwnerImage);
    reviewOwnerBox.appendChild(reviewOwnerNickName);
    reviewOwnerBox.appendChild(reviewLikeBox);

    const reviewContentBox = document.createElement('div');
    reviewContentBox.classList.add('review-content-box');

    const reviewContentLeftBox = document.createElement('div');
    reviewContentLeftBox.classList.add('review-content-left-box');

    const reviewTitle = document.createElement('input');
    reviewTitle.classList.add('review-title');
    reviewTitle.type = 'text';
    reviewTitle.value = `${element.title}`;
    reviewTitle.id = `reviewTitle_${element.id}`;
    reviewTitle.readOnly = true;
    reviewContentLeftBox.appendChild(reviewTitle);

    const reviewHidden = document.createElement('input');
    reviewHidden.type = 'hidden';
    reviewHidden.value = `${element.id}`;
    reviewHidden.id = `reviewHidden_${element.id}`;
    reviewHidden.readOnly = true;
    reviewContentLeftBox.appendChild(reviewHidden);

    const reviewContentRightBox = document.createElement('div');
    reviewContentRightBox.classList.add('review-content-right-box');

    const reviewStarBox = document.createElement('div');
    reviewStarBox.classList.add('review-star-box');
    reviewStarBox.innerHTML = `${star}`;

    reviewContentRightBox.appendChild(reviewStarBox);

    reviewContentBox.appendChild(reviewContentLeftBox);
    reviewContentBox.appendChild(reviewContentRightBox);

    const reviewInformationBox = document.createElement('div');
    reviewInformationBox.classList.add('review-information-box');

    const reviewCreateAt = document.createElement('span');
    reviewCreateAt.classList.add('review-create-at');
    reviewCreateAt.textContent = element.updated_at;

    const reviewDetailButton = document.createElement('button');
    reviewDetailButton.type = 'button';
    reviewDetailButton.id = `reviewDetail_${element.id}`;
    reviewDetailButton.classList.add('review-detail-button');
    reviewDetailButton.textContent = '상세보기';

    reviewInformationBox.appendChild(reviewCreateAt);
    reviewInformationBox.appendChild(reviewDetailButton);

    reviewRightBox.appendChild(reviewOwnerBox);
    reviewRightBox.appendChild(reviewContentBox);
    reviewRightBox.appendChild(reviewInformationBox);

    reviewItems.appendChild(reviewLeftBox);
    reviewItems.appendChild(reviewRightBox);

    const reviewItem = document.getElementById(`reviewItem_${element.id}`)
    reviewItem.replaceWith(reviewItems)
    reviewItem.style.height = "10rem";

    reviewDetailButton.addEventListener("click", function () {
        getReviewDetailData(element)
    });

    reviewLikeButton.addEventListener("click", function () {
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

    const reviewDetailContainer = document.createElement('div')
    reviewDetailContainer.classList.add('reviewDetailContainer')
    const reviewDetailTopContainer = document.createElement('div')
    reviewDetailTopContainer.classList.add('reviewDetailTopContainer')
    const reviewDetailImageBox = document.createElement('div')
    reviewDetailImageBox.classList.add('reviewDetailImageBox')
    reviewDetailImageBox.style.backgroundImage = `url(${review_image})`
    reviewDetailImageBox.setAttribute('id', `review_detail_image_${element.id}`)
    const reviewDetailTitleContainer = document.createElement('div')
    reviewDetailTitleContainer.classList.add('reviewDetailTitleContainer')
    const reviewDetailOwnerInformationBox = document.createElement('div')
    reviewDetailOwnerInformationBox.classList.add('reviewDetailOwnerInformationBox')
    const reviewDetailProfileGroup = document.createElement('div')
    reviewDetailProfileGroup.classList.add('reviewDetailProfileGroup')
    const reviewDetailProfileImage = document.createElement('div')
    reviewDetailProfileImage.classList.add('reviewDetailProfileImage')
    reviewDetailProfileImage.style.backgroundImage = `url(${profile_image})`
    const reviewDetailNickname = document.createElement('div')
    reviewDetailNickname.classList.add('reviewDetailNickname')
    reviewDetailNickname.textContent = element.user.nickname
    const reviewDetailLikeGroup = document.createElement('div')
    reviewDetailLikeGroup.classList.add('reviewDetailLikeGroup')
    const reviewDetailLikeCount = document.createElement('span')
    reviewDetailLikeCount.classList.add('reviewDetailLikeCount')
    reviewDetailLikeCount.setAttribute('id', `reviewDetailLikeCount_${element.id}`)
    reviewDetailLikeCount.textContent = element.review_liking_people_count
    const reviewDetailLikeButton = document.createElement('div')
    reviewDetailLikeButton.classList.add('reviewDetailLikeButton')
    reviewDetailLikeButton.style.backgroundImage = `url(${like_image})`
    reviewDetailLikeButton.setAttribute('id', `reviewDetailLike_${element.id}`)
    const reviewDetailTitleBox = document.createElement('div')
    reviewDetailTitleBox.classList.add('reviewDetailTitleBox')
    const reviewDetailTitle = document.createElement('div')
    reviewDetailTitle.classList.add('reviewDetailTitle')
    const reviewDetailTitleSpan = document.createElement('span')
    reviewDetailTitleSpan.textContent = element.title
    const reviewDetailStarBox = document.createElement('div')
    reviewDetailStarBox.classList.add('reviewDetailStarBox')
    const reviewDetailStar = document.createElement('div')
    reviewDetailStar.innerHTML = star
    const reviewDetailCreated_at = document.createElement('span')
    reviewDetailCreated_at.classList.add('reviewDetailCreated_at')
    reviewDetailCreated_at.textContent = element.updated_at
    const reviewDetailBottomContainer = document.createElement('div')
    reviewDetailBottomContainer.classList.add('reviewDetailBottomContainer')
    const reviewDetailContext = document.createElement('div')
    reviewDetailContext.classList.add('reviewDetailContext')
    const reviewDetailContextSpan = document.createElement('span')
    reviewDetailContextSpan.textContent = element.content
    const reviewDetailControlContainer = document.createElement('div')
    reviewDetailControlContainer.classList.add('reviewDetailControlContainer')
    const reviewEvaluationBox = document.createElement('div')
    reviewEvaluationBox.classList.add('review-evaluation-box')
    const reviewEvaluation1 = document.createElement('div')
    reviewEvaluation1.classList.add('review-evaluation')
    reviewEvaluation1.textContent = `배송 : ${element.delivery_evaluation}`
    const reviewEvaluation2 = document.createElement('div')
    reviewEvaluation2.classList.add('review-evaluation', 'review-evaluation-center')
    reviewEvaluation2.textContent = `서비스 : ${element.service_evaluation}`
    const reviewEvaluation3 = document.createElement('div')
    reviewEvaluation3.classList.add('review-evaluation')
    reviewEvaluation3.textContent = `재구매 의향 : ${element.feedback_evaluation}`
    const reviewControlBox = document.createElement('div')
    reviewControlBox.classList.add('review-control-box')
    const editReviewInformation = document.createElement('button')
    editReviewInformation.classList.add('review-control-button')
    editReviewInformation.setAttribute('id', `editReviewInformation_${element.id}`)
    editReviewInformation.textContent = '수정'
    const closeReviewDetailInformation = document.createElement('button')
    closeReviewDetailInformation.classList.add('review-control-button')
    closeReviewDetailInformation.setAttribute('id', `closeReviewDetailInformation_${element.id}`)
    closeReviewDetailInformation.textContent = '접기'

    reviewDetailContainer.appendChild(reviewDetailTopContainer)
    reviewDetailContainer.appendChild(reviewDetailBottomContainer)
    reviewDetailContainer.appendChild(reviewDetailControlContainer)
    reviewDetailTopContainer.appendChild(reviewDetailImageBox)
    reviewDetailTopContainer.appendChild(reviewDetailTitleContainer)
    reviewDetailTitleContainer.appendChild(reviewDetailOwnerInformationBox)
    reviewDetailTitleContainer.appendChild(reviewDetailTitleBox)
    reviewDetailTitleContainer.appendChild(reviewDetailStarBox)
    reviewDetailOwnerInformationBox.appendChild(reviewDetailProfileGroup)
    reviewDetailOwnerInformationBox.appendChild(reviewDetailLikeGroup)
    reviewDetailProfileGroup.appendChild(reviewDetailProfileImage)
    reviewDetailProfileGroup.appendChild(reviewDetailNickname)
    reviewDetailLikeGroup.appendChild(reviewDetailLikeCount)
    reviewDetailLikeGroup.appendChild(reviewDetailLikeButton)
    reviewDetailTitleBox.appendChild(reviewDetailTitle)
    reviewDetailTitle.appendChild(reviewDetailTitleSpan)
    reviewDetailStarBox.appendChild(reviewDetailStar)
    reviewDetailStarBox.appendChild(reviewDetailCreated_at)
    reviewDetailBottomContainer.appendChild(reviewDetailContext)
    reviewDetailContext.appendChild(reviewDetailContextSpan)
    reviewDetailControlContainer.appendChild(reviewEvaluationBox)
    reviewDetailControlContainer.appendChild(reviewControlBox)
    reviewEvaluationBox.appendChild(reviewEvaluation1)
    reviewEvaluationBox.appendChild(reviewEvaluation2)
    reviewEvaluationBox.appendChild(reviewEvaluation3)
    reviewControlBox.appendChild(editReviewInformation)
    reviewControlBox.appendChild(closeReviewDetailInformation)

    const reviewItem = document.getElementById(`reviewItem_${element.id}`)
    reviewItem.innerHTML = ''
    reviewItem.appendChild(reviewDetailContainer)
    reviewItem.style.height = "30rem";

    // const closeReviewDetailInformation = document.getElementById(`closeReviewDetailInformation_${element.id}`);
    closeReviewDetailInformation.addEventListener("click", function () {
        closeReview(element)
    });

    // const reviewDetailLike = document.getElementById(`reviewDetailLike_${element.id}`);
    reviewDetailLikeButton.addEventListener("click", function () {
        reviewLike(element);
    });

    // const review_detail_image = document.getElementById(`review_detail_image_${element.id}`)
    reviewDetailImageBox.addEventListener("click", function () {
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
        likes.innerText = response_json.wish_list
    }
    else if (response.status == 200) {
        likeBtn.setAttribute("src", "/static/images/좋아요x.png")
        likes.innerText = response_json.wish_list
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
    const reviewViewBtn = document.getElementById("reviewView");
    reviewViewBtn.addEventListener("click", function (e) {
        reviewViewBtn.classList.add("is-current");
        detailViewBtn.classList.remove("is-current");
        sellerpageBtn.classList.remove("is-current");
        reviewView();
    })
    const detailViewBtn = document.getElementById("detailView");
    detailViewBtn.addEventListener("click", function (e) {
        detailViewBtn.classList.add("is-current")
        reviewViewBtn.classList.remove("is-current");
        sellerpageBtn.classList.remove("is-current");
        productInformationView();
    })
    const sellerpageBtn = document.getElementById("sellerpage");
    sellerpageBtn.addEventListener("click", function (e) {
        sellerpageBtn.classList.add("is-current")
        reviewViewBtn.classList.remove("is-current");
        detailViewBtn.classList.remove("is-current");
        sellerpageView();
    })
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
