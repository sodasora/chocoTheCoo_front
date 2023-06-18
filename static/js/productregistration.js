import { BACK_BASE_URL,  FRONT_BASE_URL, registProductAPIView} from './api.js'

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


window.onload = async function() {
    setEventListener()
}
    