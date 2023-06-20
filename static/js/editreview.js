import {BACK_BASE_URL, FRONT_BASE_URL,  showReviewDetailViewAPI, editReviewViewAPI} from './api.js';


const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('product_id');
const reviewId = urlParams.get('review_id');

export async function loadDefault(){
    const review = await showReviewDetailViewAPI(productId, reviewId);
    
    const title = document.getElementById("update-title");
    const content = document.getElementById("update-content");
    const star = document.getElementById("give-star");

    title.value = review.title;
    content.value = review.content;
    star.value = review.star;

}

export async function editReview() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('product_id');
    const reviewId = urlParams.get('review_id');
    
    const review = await showReviewDetailViewAPI(productId, reviewId);
    console.log(review.content)
    
    const title = document.getElementById("update-title").value;
    // title = review.title;

    const content = document.getElementById("update-content").value;
    // content = review.content;
    
    const star = document.getElementById("give-star").value;
    // star = review.star;
    
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


    // const submitButton = document.getElementById("update-submit");
    // submitButton.addEventListener("click", async function () {
    try {
        editReviewViewAPI(productId, reviewId, formdata);
        
    } catch (error) {
        console.error(error);
    }
    
}

export async function setEventListener() {
    // html 요소 이벤트 리스너 추가
    document.getElementById("update-submit").addEventListener("click", editReview)
    // document.getElementById("preview").addEventListener("click", getVerificationCode)
}

window.onload = async function () {
    loadDefault();
    setEventListener();
}
