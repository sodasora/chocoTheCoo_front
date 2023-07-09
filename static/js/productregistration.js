import { BACK_BASE_URL, FRONT_BASE_URL, getCategoryView, registProductAPIView, getProductDetailAPIView, editProductDetailAPIView, getSellerPermissionAPIView, payload } from './api.js'

const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('product_id');




export async function categoryview() {
    const categories = await getCategoryView();

    const categorySelect = document.getElementById(`category-select`);

    categories.forEach(category => {
        const option = document.createElement(`option`);
        option.value = category.id;
        option.textContent = category.name;
        // option.setAttribute(`id`, );
        categorySelect.appendChild(option);
    });
}
// 상품등록하기
export async function registProduct() {
    const payload = localStorage.getItem("payload");
    const payload_parse = JSON.parse(payload);
    const seller_id = payload_parse.user_id //로그인한 유저id

    const name = document.getElementById("name").value;
    const content = document.getElementById("content").value;
    const image = document.getElementById("formFile").files[0];
    const price = document.getElementById("price").value;
    const amount = document.getElementById("amount").value;
    const category = document.getElementById("category-select").value;

    // 유효성 검사 추가
    if (!name || !content || !price || !amount ) {
        alert("모든 필드를 입력하셔야합니다! 입력 안한 부분은 없는지 확인해주세요~❤");
        return;
    }

    const formdata = new FormData();

    formdata.append('name', name)
    formdata.append('content', content)
    formdata.append('price', price)
    formdata.append('amount', amount)
    formdata.append('seller_id', seller_id)
    formdata.append('category', category)

    if (image) {
        formdata.append('image', image)
    }

    try {
        registProductAPIView(formdata, seller_id);
    } catch (error) {
        console.error(error);
    }
}

// 이미지 미리보기
// 이미지 미리보기 js 함수
export function readURL(input) {
    // 사용자가 등록한 프로필 이미지 미리보기 기능 제공
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById('profileView').src = e.target.result;
        };
        reader.readAsDataURL(input.files[0]);
    } else {
        document.getElementById('profileView').src = "/static/images/pepe.jpg";
    }
}

//상품 수정하기
// 이전 상품 정보 불러오기
export async function loadDefault() {
    const product = await getProductDetailAPIView(productId);

    const name = document.getElementById("name");
    const content = document.getElementById("content");
    const price = document.getElementById("price");
    const amount = document.getElementById("amount");
    const category = document.getElementById("category-select");

    name.value = product.name;
    content.value = product.content;
    price.value = product.price;
    amount.value = product.amount;
    category.value = product.category;
}


//상품 수정하기
// 수정된 상품 정보 저장
export async function editProductSubmit() {
    const name = document.getElementById("name").value;
    const content = document.getElementById("content").value;
    const image = document.getElementById("formFile").files[0];
    const price = document.getElementById("price").value;
    const amount = document.getElementById("amount").value;

    const formdata = new FormData();


    formdata.append('name', name)
    formdata.append('content', content)
    formdata.append('price', price)
    formdata.append('amount', amount)

    if (image) {
        formdata.append('image', image)
    }


    try {
        const response = await editProductDetailAPIView(productId, formdata);
        if (response.status == 200) {
            alert('상품 수정 완료!')
            window.location.href = `${FRONT_BASE_URL}/sellerpage.html`;
        } else {
            alert('상품 수정 실패')
        }
    } catch (error) {
        console.error(error);
    }

}

export async function setEventListener() {

    // html 요소 이벤트 리스너 추가
    document.getElementById("registrate").addEventListener("click", registProduct)
    // document.getElementById("preview").addEventListener("click", getVerificationCode)
    if (productId) {
        document.getElementById("registrate").style.visibility = "hidden";
        document.getElementById("edit").addEventListener("click", editProductSubmit)
    } else {
        document.getElementById("edit").style.visibility = "hidden";

    }
    // html 아이디 불러오기
    document.getElementById("formFile").addEventListener("change", function (event) { readURL(event.target); });

}


window.onload = async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('product_id');
    if (payload == null) {
        alert("로그인이 필요 합니다.")
        window.location.replace(`${FRONT_BASE_URL}/login.html`)
    } else if (payload.is_seller == false) {
        alert("판매 활동 권한이 없습니다.")
        window.location.replace(`${FRONT_BASE_URL}/user_detail_page.html`)
    } else if (productId) {
        loadDefault()
    }
    setEventListener()
    categoryview()

}
