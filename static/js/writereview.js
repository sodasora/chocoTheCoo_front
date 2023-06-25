
import { writeReviewAPI, showReviewDetailViewAPI, editReviewViewAPI, BACK_BASE_URL, FRONT_BASE_URL } from './api.js';


// 후기 작성 
export async function writeReview() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('product_id');


    console.log(productId)
    // const products = await  getProductListAPIView();

    const name = document.getElementById("review-title").value;
    const star = document.getElementById("give-star").value;
    const image = document.getElementById("formFile").files[0];
    const content = document.getElementById("review-content").value;

    const formdata = new FormData();



    formdata.append('title', name)
    formdata.append('content', content)
    formdata.append('star', star)
    console.log(formdata)
    if (image) {
        formdata.append('image', image)
    }

    for (const pair of formdata.entries()) {
        console.log(pair[0] + ':', pair[1]);
    }

    try {
        const response = await writeReviewAPI(productId, formdata);

    } catch (error) {
        console.error(error);
    }

}

// 이전 리뷰들 불러오기 : showReviewDetailViewAPI에서 정보 받아오기
export async function loadDefault() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('product_id');
    const reviewId = urlParams.get('review_id');

    const review = await showReviewDetailViewAPI(productId, reviewId);

    const title = document.getElementById("review-title");
    const content = document.getElementById("review-content");
    const star = document.getElementById("give-star");

    console.log(review.title);
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

    const title = document.getElementById("review-title").value;
    const content = document.getElementById("review-content").value;
    const star = document.getElementById("give-star").value;

    const image = document.getElementById("formFile").files[0];


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

// 이미지 미리보기 함수
export function readURL(input) {
    // 사용자가 등록한 이미지 미리보기 기능 제공
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById('preView').src = e.target.result;
        };
        reader.readAsDataURL(input.files[0]);
    }
}


export async function setEventListener() {
    const urlParams = new URLSearchParams(window.location.search);
    const reviewId = urlParams.get('review_id');
    // html 요소 이벤트 리스너 추가

    if (reviewId) {
        document.getElementById("update-submit").addEventListener("click", editReview)
        document.getElementById("reviewsubmitbutton").style.visibility = "hidden"
    } else {
        document.getElementById("reviewsubmitbutton").addEventListener("click", writeReview)
        document.getElementById("update-submit").style.visibility = "hidden"
    }
    // 이미지 미리보기
    document.getElementById("formFile").addEventListener("change",function (event) { readURL(event.target); })
}

window.onload = async function () {
    setEventListener()
    loadDefault()
}