import { getProductDetailAPIView , BACK_BASE_URL, FRONT_BASE_URL} from './api.js';

window.onload = async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('product_id');
 
    console.log(productId)

    const response = await getProductDetailAPIView(productId);
    console.log(response)

    const productTitle =document.getElementById("product-title")
    const productImage =document.getElementById("product-image")
    const productContent =document.getElementById("product-content")

    productTitle.innerText = response.name
    productContent.innerText = response.content

    const newImage = document.createElement("img");
    

    
    // productImage.appendChild(newImage)
    
    if(response.image != null){
        newImage.setAttribute("src", `${response.image}`)
        productImage.appendChild(newImage)
    }else{
        newImage.setAttribute("src", "/static/images/기본이미지.gif");
        productImage.appendChild(newImage)
    }
   
    
}