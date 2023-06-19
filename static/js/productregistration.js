import { BACK_BASE_URL,  FRONT_BASE_URL, registProductAPIView, getSellerPermissionAPIView} from './api.js'


export async function registProduct() {
    
 
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

       registProductAPIView(formdata);
        
        
    } catch (error) {
        console.error(error);
    }
}

export async function setEventListener() {
    // html 요소 이벤트 리스너 추가
    document.getElementById("registrate").addEventListener("click", registProduct)
    // document.getElementById("preview").addEventListener("click", getVerificationCode)
}


// 판매자정보
async function sellerProfile() {
    const payload = localStorage.getItem("payload");
    const payload_parse = JSON.parse(payload);
    const user_id = payload_parse.user_id //로그인한 유저id

    const seller_data = await getSellerPermissionAPIView(user_id)
    console.log("판매자정보", seller_data)

    let today = new Date();
    let year = today.getFullYear();
    let month = String(today.getMonth() + 1).padStart(2, '0'); //두자리되도록 앞에0채우기
    let date = String(today.getDate()).padStart(2, '0'); //두자리되도록 앞에0채우기
    today = `${year}-${month}-${date}`;
    // console.log("today", today)

    


    if (seller_data['company_img']) { //로고 이미지가 존재한다면
        document.getElementById("company-img").setAttribute("src", `${BACK_BASE_URL}` + seller_data['company_img'])
    }
    document.getElementById("company-name").innerText = seller_data["company_name"]
    document.getElementById("owner-name").innerText = seller_data["business_owner_name"]
}
sellerProfile()

window.onload = async function() {
    setEventListener()
}
    