import { 
  getProductslist, 
  viewProductslist, 
  getSellerProductListAPIView, 
  sellerFollowAPI, 
  BACK_BASE_URL, 
  FRONT_BASE_URL, 
  getSellerPermissionAPIView, 
  payload,
  getUserInformationAPI
} from './api.js';

const urlParams = new URLSearchParams(window.location.search);
let sellerId = urlParams.get('seller');
if (!sellerId){ // 판매자가 자신의 스토어를 조회할 때 
  sellerId = payload.user_id // 로그인한 유저id
}

// 판매자 정보 보기
export async function sellerProfileView() {
  const seller = await getSellerPermissionAPIView(sellerId);
  // console.log(seller)
  const follow_button = document.getElementById("seller-follow-button");
  // 팔로우 유무에 따라 표시
  seller.is_like == false ? follow_button.innerText = "Follow" : follow_button.innerText = "Unfollow"
  // 스토어 이미지 없을 시 기본 이미지
  const company_img = seller.company_img == null ? "/static/images/store.gif" : seller.company_img;
  const sellerProfile = document.getElementById("user-image");
  sellerProfile.setAttribute("src", `${company_img}`);
  const name = seller.business_owner_name;
  const brand = seller.company_name;
  const contact = seller.contact_number;
  const following = seller.followings_count;
  document.getElementById("user-name").innerText = name;
  document.getElementById("user-brand").innerText = brand;
  document.getElementById("user-contact").innerText = contact;
  document.getElementById("user-follow").innerText = following;
  follow_button.addEventListener("click", function () {
    sellerFollow(sellerId)
});
}

export async function sellerFollow(user_id) {
  const response = await sellerFollowAPI(user_id);
  const response_json = await response.json()
  if (response.status == 404) {
      alert("판매자 정보가 삭제되었거나, 로그인이 필요합니다.")
  } else if (response.status == 401) {
      alert("로그인이 필요합니다.")
      window.location.replace(`${FRONT_BASE_URL}/login.html`)
  } else if (response.status == 400) {
      alert(response_json.err)
  } else {

      document.getElementById("user-follow").innerText = response_json.followings
      const follow_button = document.getElementById("seller-follow-button")
      response.status == 200 ? follow_button.innerText = "Follow" : follow_button.innerText = "Unfollow"
  }

}

export async function productDetail(product_id) {
  window.location.href = `${FRONT_BASE_URL}/productdetail.html?product_id=${product_id}`
}

//등록한 상품들 전체 보기
export async function sellerPageAPI() {
  try {
    // 판매자 스토어 페이지 판별
    const getParams = window.location.search;
    const userParams = getParams.split("=")[1];
    let seller_id = userParams
    if (!seller_id){ // 판매자가 자신의 스토어를 조회할 때
      seller_id = payload.user_id // 로그인한 유저id
    }
    const product = await getSellerProductListAPIView(seller_id);
    if (product.count != 0) {
      if ((product.next == null) & (product.previous == null)) {
        viewProductslist(product);
      } else {
        getProductslist(product);
      }
    } else {
      const container = document.querySelector(".container")
      const content = document.createElement("div")
      content.setAttribute("style", "font-family: 'S-CoreDream-3Light';font-size: 2vw; font-weight:bold; color:white;")
      content.innerText = "등록한 상품이 없습니다."
      container.appendChild(content)
    }
  } catch (error) {
    console.error(error)
  }
}

window.onload = async function () {
  sellerProfileView()
  sellerPageAPI()
}