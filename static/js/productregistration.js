import { BACK_BASE_URL,  FRONT_BASE_URL, registProductAPIView, getProductDetailAPIView, editProductDetailAPIView, getSellerPermissionAPIView} from './api.js'

const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('product_id');

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
    
    const formdata = new FormData();

    console.log(name, content, price, amount)
    console.log(image)
    
    formdata.append('name', name)
    formdata.append('content', content)
    formdata.append('price', price)
    formdata.append('amount', amount)
    formdata.append('seller_id', seller_id)
    if(image){
        formdata.append('image', image)
    }
    
    for (const pair of formdata.entries()) {
    console.log(pair[0] + ':', pair[1]);
    }
    

    try {

       registProductAPIView(formdata);
        
        
    } catch (error) {
        console.error(error);
    }
}
// 이미지 미리보기
// 이미지 미리보기 js 함수
export function readURL(input) {
    // 사용자가 등록한 프로필 이미지 미리보기 기능 제공
    if (input.files && input.files[0]) {
        var reader = new FileReader();
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
export async function loadDefault(){
    const product = await getProductDetailAPIView(productId);

    const name = document.getElementById("name");
    const content = document.getElementById("content");
    const price = document.getElementById("price");
    const amount = document.getElementById("amount");

    name.value = product.name;
    content.value = product.content;
    price.value = product.price;
    amount.value = product.amount;
}


//상품 수정하기
// 수정된 상품 정보 저장
export async function editProductSubmit(){
    const name = document.getElementById("name").value;
    const content = document.getElementById("content").value;
    const image = document.getElementById("formFile").files[0];
    const price = document.getElementById("price").value;
    const amount = document.getElementById("amount").value;

    const formdata = new FormData();

    console.log(name, content, price, amount)
    console.log(image)
    
    formdata.append('name', name)
    formdata.append('content', content)
    formdata.append('price', price)
    formdata.append('amount', amount)

    if(image){
        formdata.append('image', image)
    }
    
    for (const pair of formdata.entries()) {
    console.log(pair[0] + ':', pair[1]);
    }
    

    try {

        const response = await editProductDetailAPIView(productId, formdata);
        console.log(response);
        
        
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


window.onload = async function() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('product_id');
    if(productId){
        loadDefault()
    }
    setEventListener()

}
    