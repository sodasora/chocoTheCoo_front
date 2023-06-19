import { getProductDetailAPIView ,writeReviewAPI, getReviewView,deletetProductDetailAPIView ,BACK_BASE_URL, FRONT_BASE_URL} from './api.js';


// 상품 정보보기
export async function viewProductDetail() {
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

    if(response.image != null){
        newImage.setAttribute("src", `${response.image}`)
        productImage.appendChild(newImage)
    }else{
        newImage.setAttribute("src", "/static/images/기본이미지.gif");
        productImage.appendChild(newImage)
    }
    
    const updateButton = document.getElementById("edit-btn")
    updateButton.setAttribute("onclick", "editProductDetail(productId)")
   
}


// 상품 삭제하기
export async function deleteProduct() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('product_id');

    try {
        deletetProductDetailAPIView(productId);
        
    } catch (error) {
        console.error(error);
    }
}

// 후기 작성 
export async function writeReview(){

    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('product_id');

    const name = document.getElementById("review-title").value;
    const star = document.getElementById("give-star").value;
    const image = document.getElementById("formFile").files[0];
    const content = document.getElementById("review-content").value;
    
    
    const formdata = new FormData();


    
    formdata.append('title', name)
    formdata.append('content', content)
    formdata.append('star', star)
    
    if(image){
        formdata.append('image', image)
    }
    
    for (const pair of formdata.entries()) {
    console.log(pair[0] + ':', pair[1]);
    }
    

    try {
        writeReviewAPI(productId, formdata);
        
    } catch (error) {
        console.error(error);
    }
}

// 후기 조회
export async function showReview(){
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('product_id');
        const reviews = await getReviewView(productId);
        console.log(reviews);
    
        const review_list = document.getElementById("review-List");
        console.log(review_list);
        reviews.forEach((review) => {
          const newCol = document.createElement("div");
          newCol.setAttribute("class", "col");
          
          const newCard = document.createElement("div");
          newCard.setAttribute("class", "card");
          newCard.setAttribute("id", review.id);
          
          newCard.onclick = function() {
            getReviewView(review.id);
          };
    
          const img = document.createElement("img");
          img.setAttribute("class", "card-img-top");
    
          if(review.image){
              img.setAttribute(
                  "src",
                  `${review.image}`
                );
          }else{
              img.setAttribute("src",'/static/images/기본이미지.gif')
          }
          
          newCard.appendChild(img);
          review_list.appendChild(newCol);
    
          const newCardBody = document.createElement("div");
          newCardBody.setAttribute("class", "card-body");
          newCard.appendChild(newCardBody);
    
          const newCardTitle = document.createElement("h5");
          newCardTitle.setAttribute("class", "card-title");
          newCardTitle.innerText = review.name;
          newCardBody.appendChild(newCardTitle);
    
          const newCardText = document.createElement("p");
          newCardText.setAttribute("class", "card-text");
          newCardText.innerText ="별점 : "+ review.star;
          newCard.appendChild(newCardText)
          
          const newCardFooter = document.createElement("p");
          newCardFooter.setAttribute("class", "card-footer");
          newCardFooter.innerText = review.content;
          newCard.appendChild(newCardFooter)
          newCol.appendChild(newCard);
        });
      } catch (error) {
        console.error(error)
      }
    

}


export async function setEventListener() {
    // html 요소 이벤트 리스너 추가
    document.getElementById("reviewsubmitbutton").addEventListener("click", writeReview)
    document.getElementById("delete-btn").addEventListener("click", deleteProduct)
}



window.onload = async function () {
    viewProductDetail()
    setEventListener() 
    showReview()
 
    
}