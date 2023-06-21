import {BACK_BASE_URL, FRONT_BASE_URL,  showReviewDetailViewAPI, editReviewViewAPI} from './api.js';


const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('product_id');
const reviewId = urlParams.get('review_id');

// 이전 리뷰들 불러오기 : showReviewDetailViewAPI에서 정보 받아오기
export async function loadDefault(){
    const review = await showReviewDetailViewAPI(productId, reviewId);
    
    const title = document.getElementById("update-title");
    const content = document.getElementById("update-content");
    const star = document.getElementById("give-star");

    title.value = review.title;
    content.value = review.content;
    star.value = review.star;

}
// 수정한 리뷰 api.js의 editReviewAPI에 전송
export async function editReview() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('product_id');
    const reviewId = urlParams.get('review_id');
    
    const review = await showReviewDetailViewAPI(productId, reviewId);
    console.log(review.content)
    
    const title = document.getElementById("update-title").value;
    const content = document.getElementById("update-content").value;
    const star = document.getElementById("give-star").value;
    
    const image = document.getElementById("formFileMultiple").files[0];
    
    
    const formdata = new FormData();
    
    console.log(title, content, star);
    formdata.append('title', title);
    formdata.append('content', content);
    formdata.append('star', star);
    if (image) {
        formdata.append('image', image)
    }
    
    for (const pair of formdata.entries()) {
        console.log(pair[0] + ':', pair[1]);
    }
    
    console.log(formdata);


    try {
        const response = await editReviewViewAPI(productId, reviewId, formdata);
        
    } catch (error) {
        console.error(error);
    }
    
}

export async function setEventListener() {
    // html 요소 이벤트 리스너 추가
    document.getElementById("update-submit").addEventListener("click", editReview)
}

window.onload = async function () {
    loadDefault();
    setEventListener();
}
