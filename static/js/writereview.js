
import { writeReviewAPI, showReviewDetailViewAPI, editReviewViewAPI, BACK_BASE_URL, FRONT_BASE_URL, payload } from './api.js';
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('product_id');

// 후기 작성 
export async function writeReview() {
    // const products = await  getProductListAPIView();

    const name = document.getElementById("review-title").value;
    const star = document.getElementById("give-star").value;
    const image = document.getElementById("formFile").files[0];
    const content = document.getElementById("review-content").value;
    const delivery_evaluation = document.getElementById("delivery_evaluation").value;
    const service_evaluation = document.getElementById("service_evaluation").value;
    const feedback_evaluation = document.getElementById("feedback_evaluation").value;

    if (name == '') {
        alert("리뷰 제목을 입력해 주세요.")
    } else if (content == '') {
        alert("리뷰 내용을 입력해 주세요.")
    } else {
        const formdata = new FormData();
        formdata.append('title', name)
        formdata.append('content', content)
        formdata.append('star', star)
        formdata.append('delivery_evaluation', delivery_evaluation)
        formdata.append('service_evaluation', service_evaluation)
        formdata.append('feedback_evaluation', feedback_evaluation)
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
    title.value = review.title;
    content.value = review.content;
    star.value = review.star;
    document.getElementById("delivery_evaluation").value = review.delivery_evaluation
    document.getElementById("service_evaluation").value = review.service_evaluation
    document.getElementById("feedback_evaluation").value = review.feedback_evaluation

    if (review.image != null) {
        document.getElementById("preViewItem").style.display = "flex"
        document.getElementById('preView').setAttribute("src", review.image)
    }

}

// 수정한 리뷰 api.js의 editReviewAPI에 전송
export async function editReview() {
    const title = document.getElementById("review-title").value;
    const content = document.getElementById("review-content").value;
    if (title == '') {
        alert("리뷰 제목을 입력해 주세요.")
    } else if (content == '') {
        alert("리뷰 내용을 입력해 주세요.")
    } else {
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('product_id');
        const reviewId = urlParams.get('review_id');
        const star = document.getElementById("give-star").value;
        const image = document.getElementById("formFile").files[0];
        const delivery_evaluation = document.getElementById("delivery_evaluation").value;
        const service_evaluation = document.getElementById("service_evaluation").value;
        const feedback_evaluation = document.getElementById("feedback_evaluation").value;
        const formdata = new FormData();
        formdata.append('title', title);
        formdata.append('content', content);
        formdata.append('star', star);
        formdata.append('delivery_evaluation', delivery_evaluation)
        formdata.append('service_evaluation', service_evaluation)
        formdata.append('feedback_evaluation', feedback_evaluation)
        if (image) {
            formdata.append('image', image)
        }
        try {
            const response = await editReviewViewAPI(productId, reviewId, formdata);

        } catch (error) {
            console.error(error);
        }
    }
}

// 이미지 미리보기 함수
export function readURL(input) {
    const fileType = input.files[0].type;
    const ImageTypes = ["image/gif", "image/jpeg", "image/png"];
    if (!ImageTypes.includes(fileType)) {
        alert("지원되지 않는 파일 형식입니다. 이미지 파일을 선택해 주세요.");
        input.value = ''
    }
    else if (input.files && input.files[0]) {
        document.getElementById("preViewItem").style.display = "flex"
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
    document.getElementById("formFile").addEventListener("change", function (event) { readURL(event.target); })
}

window.onload = async function () {
    if (payload == null) {
        alert("로그인이 필요 합니다.")
        window.location.replace(`${FRONT_BASE_URL}/login.html`)
    } else if (productId == null) {
        alert("상품 정보를 찾을 수 없습니다.")
        window.location.replace(`${FRONT_BASE_URL}/index.html`)
    }

    setEventListener()
    loadDefault()

}