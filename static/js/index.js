import { BACK_BASE_URL, FRONT_BASE_URL, getProductslist, viewProductslist, getCategoryView, getProductListAPIView, searchWhatAPI } from './api.js'

export async function goSearch(url) {
    // 현재 url에 새로 요청받은 url 추가하기 위한 변수 선언 
    const currentUrl = new URL(window.location.href);
    const newUrlParams = new URLSearchParams(url);
    
    let shouldReload = false;
    
    // 현재 url에서 category, search, ordering이 없으면 
    // key와 value로 저장
    for (const [key, value] of newUrlParams.entries()) {
        if (currentUrl.searchParams.get(key) === value) {
            shouldReload = true;
        } else {
            currentUrl.searchParams.set(key, value);
        }
    }
    // 만약, url에 category, search, ordering 있으면
    // url 추가하지 않고 value만 수정되어 리로드 실행
    if (shouldReload) {
        window.location.reload();
    } else {
        window.location.href = `${FRONT_BASE_URL}/index.html?${currentUrl.searchParams.toString()}`;
    }
}


export async function categoryview() {
    const categories = await getCategoryView();
    const categorySelect = document.getElementById("categorymenu");
    const categoryBox = document.createElement("div");
    categoryBox.setAttribute("class", "category-box")

    categories.forEach(category => {
        const categoryItem = document.createElement("a");
        categoryItem.setAttribute("id", `${category.id}`);
        categoryItem.innerText = `🍫${category.name}\n`
        categoryBox.appendChild(categoryItem);
        categorySelect.appendChild(categoryBox);
        const categoryId = 'category='+ `${category.id}`;
        categoryItem.addEventListener("click", () => {
            searchAnythingAPI(categoryId)
        });
    });
}



export async function categoryview_mobile() {
    const categories = await getCategoryView();
    const categorySelect = document.getElementById("categorymenu-mobile");
    const categoryBox = document.createElement("div");
    categoryBox.setAttribute("class", "category-box-mobile")

    categories.forEach(category => {
        const categoryItem = document.createElement("a");
        categoryItem.setAttribute("id", `${category.id}`);
        categoryItem.innerText = `🍫${category.name}\n`
        categoryBox.appendChild(categoryItem);
        categorySelect.appendChild(categoryBox);

        categoryItem.addEventListener("click", () => {
            goSearch('category='+category.id);
        });
    });
}


export async function keywordSeachView_mobile() {
    const answer = document.getElementById("search-keyword-mobile");
    const keyword = answer.value;
    goSearch(keyword)
}

// 카테고리, 키워드검색, 정렬 goSearch로 보내기 
export async function searchAnythingAPI(categoryId) {
    const urlParams = new URLSearchParams(window.location.search);

    const answer = document.getElementById("search-keyword");
    const keyword = answer.value;

    const orderingBox = document.getElementById("orderingBox");
    const order = orderingBox.value;
    let url = "";

    // 카테고리 클릭시, categoryId가 매개변수로 불러와짐 
    // 클릭 안했을 땐, 전체 상품 보여줘야 하니까 아무것도 안들어감
    if(categoryId){
        url += categoryId;
    } else {
        url += "";
    }
    

    // 검색창 입력어로 검색 : 키워드가 URL에 있을때
    if (keyword) {
        url += (url.length > 0 ? '&' : '') + `search=${keyword}`;
    }

    // 정렬이 입력되어있을 때
    if (order) {
        url += (url.length > 0 ? '&' : '') + `ordering=${order}`;
    }

    goSearch(url);
    
}

// 카테고리, 키워드검색, 정렬 모바일버전 
export async function searchAnythingAPI_mobile() {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryId = urlParams.get("category");
    const ordering = urlParams.get("ordering");

    const answer = document.getElementById("search-keyword-mobile");
    const keyword = answer.value;

    const orderingBox = document.getElementById("orderingBox");
    const order = orderingBox.value;

    let url = "";

    // 카테고리 클릭시, categoryId가 매개변수로 불러와짐 
    // 클릭 안했을 땐, 전체 상품 보여줘야 하니까 아무것도 안들어감
    if(categoryId){
        url += categoryId;
    } else {
        url += "";
    }
    

    // 검색창 입력어로 검색 : 키워드가 URL에 있을때
    if (keyword) {
        url += (url.length > 0 ? '&' : '') + `search=${keyword}`;
    }

    // 정렬이 입력되어있을 때
    if (order) {
        url += (url.length > 0 ? '&' : '') + `ordering=${order}`;
    }

    goSearch(url);
}
// 카테고리, 키워드검색, 정렬 상품들 보여주기(알잘딱깔센으로..!) 
export async function showSearchAnythingProduct() {
    const urlParams = new URLSearchParams(window.location.search);
    const keyword = urlParams.get('search');
    const categoryId = urlParams.get("category");
    const order = urlParams.get("ordering");
    let url = "";
    // 카테고리 검색 카테고리 ID가 url에 있을때
    if (categoryId) {
        url += (url.length > 0 ? '&' : '') + `category=${categoryId}`;
    }
    // 검색창 입력어로 검색 : 키워드가 url에 있을때
    if (keyword) {
        url += (url.length > 0 ? '&' : '') + `search=${keyword}`;
    }

    if (order) {
        url += (url.length > 0 ? '&' : '') + `ordering=${order}`;
    }
    return url;

}



export async function setEventListener() {
    // 정렬버튼 눌렀을때 실행됨
    document.getElementById("orderingBox").addEventListener("change", () => {
        searchAnythingAPI();
    });
    // 검색어 엔터 누르면 이동
    document.getElementById("search-keyword").addEventListener("keydown", (event) => {
        if (event.key == "Enter") {
            searchAnythingAPI()
        }
    })
    document.getElementById("search-btn").addEventListener("click", searchAnythingAPI);
    // 구매자 체크리스트    
    // 체크리스트 출석체크
    document.getElementById("go-mypage").addEventListener("click", function () {
        window.location.href = "mypage.html";
    });
    // 체크리스트 포인트 충전
    document.getElementById("go-mypoint").addEventListener("click", function () {
        window.location.href = "pointcharge.html";
    });
    // 체크리스트 구독
    document.getElementById("go-subscribe").addEventListener("click", function () {
        window.location.href = "subscriptioninfo.html";
    });
    // 체크리스트 채팅
    document.getElementById("go-chat").addEventListener("click", function () {
        window.location.href = "chatindex.html";
    });
    // 체크리스트 결제
    document.getElementById("go-cart").addEventListener("click", function () {
        window.location.href = "cart.html";
    });
    // 체크리스트 구매내역 확인
    document.getElementById("go-bill").addEventListener("click", function () {
        window.location.href = "bill.html";
    });
    // 체크리스트 
    document.getElementById("go-bill").addEventListener("click", function () {
        window.location.href = "bill.html";
    });
    // 판매자 체크리스트
    // 체크리스트 판매자 권한 신청
    document.getElementById("go-seller").addEventListener("click", function () {
        window.location.href = "seller.html";
    });
    // 체크리스트 판매자 상품 등록
    document.getElementById("go-addproduct").addEventListener("click", function () {
        window.location.href = "productregistration.html";
    });
    // 체크리스트 product-list체크
    document.getElementById("go-productlist").addEventListener("click", function () {
        window.location.href = "seller_productlist.html";
    });
    // 체크리스트 order-list체크
    document.getElementById("go-orderlist").addEventListener("click", function () {
        window.location.href = "seller_orderlist.html";
    });
    // 체크리스트 배송상태 체크
    document.getElementById("go-statistics").addEventListener("click", function () {
        window.location.href = "seller_orderlist.html";
    });
    // 체크리스트 판매자 statistics 체크
    document.getElementById("go-statistics").addEventListener("click", function () {
        window.location.href = "seller.html";
    });
    // 체크리스트 order-list체크
    document.getElementById("go-storepage").addEventListener("click", function () {
        window.location.href = "sellerpage.html";
    });
    // CBTI
    document.getElementById("go-CBTI").addEventListener("click", function () {
        window.location.href = "cbti.html";
    });
    // 회원가입
    document.getElementById("go-signup").addEventListener("click", function () {
        window.location.href = "signup.html";
    });
    // 로그인
    document.getElementById("go-login").addEventListener("click", function () {
        window.location.href = "login.html";
    });
    // go-edituser
    document.getElementById("go-edituser").addEventListener("click", function () {
        window.location.href = "user_detail_page.html"
    });
}

export async function setEventListener_mobile() {
    document.getElementById("search-btn-mobile").addEventListener("click", keywordSeachView_mobile);
}

window.onload = async function () {
    categoryview();
    setEventListener();
    categoryview_mobile();
    setEventListener_mobile();
    applySelectedOptions();
    // const product = await getProductListAPIView();
    const choco = document.getElementById("chocobanner");
    const url = await showSearchAnythingProduct();

    choco.addEventListener("click", function () {
        window.location.href = "subscriptioninfo.html";

    })

    const product = await searchWhatAPI(url);

    if ((product.next == null) & (product.previous == null)) {
        viewProductslist(product);
    } else {
        getProductslist(product);
    }
}

function applySelectedOptions() {
    const orderingChoice = document.getElementById("orderingChoice")
    const urlParams = new URLSearchParams(window.location.search);
    const ordering = urlParams.get("ordering");
    if (ordering == null) {
        orderingChoice.innerText = "최신순"
    } else {
        const selectOptions = {
            "sales": "orderingSale",
            "stars": "orderingStar",
            "popularity": "orderingLike",
            "cheap": "orderingCheap",
            "expensive": "orderingExpensive"
        }
        const currentSelect = document.getElementById(`${selectOptions[ordering]}`)
        orderingChoice.innerText = currentSelect.text;
    }
}

async function setLocalStorage(response) {
    const response_json = await response.json();
    if (response.status === 200) {
        localStorage.setItem("access", response_json.access);
        localStorage.setItem("refresh", response_json.refresh);
        const base64Url = response_json.access.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split("")
                .map(function (c) {
                    return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
                })
                .join("")
        );
        localStorage.setItem("payload", jsonPayload);
        window.location.reload();
    } else {
        alert(response_json["error"]);
        window.location.replace(`${FRONT_BASE_URL}/login.html`)
    }
}

async function getKakaoToken(kakao_code) {
    // Resource Server로부터 응답받은 accesstoken을 백엔드 서버로 발송
    const response = await fetch(`${BACK_BASE_URL}/api/users/kakao/login/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ code: kakao_code })
    });
    setLocalStorage(response);
}

async function getGoogleToken(google_token) {
    const response = await fetch(`${BACK_BASE_URL}/api/users/google/login/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ access_token: google_token })
    });
    setLocalStorage(response);
}

async function getNaverToken(naver_code, state) {
    const response = await fetch(`${BACK_BASE_URL}/api/users/naver/login/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ naver_code: naver_code, state: state })
    });
    setLocalStorage(response);
}

if (localStorage.getItem("payload")) {
} else if (location.href.split("=")[1]) {
    const code = new URLSearchParams(window.location.search).get("code");
    const state = new URLSearchParams(window.location.search).get("state");
    const hashParams = new URLSearchParams(window.location.hash.substr(1));
    const google_token = hashParams.get("access_token");
    if (code) {
        if (state) {
            getNaverToken(code, state);
        } else {
            getKakaoToken(code);
        }
    } else if (google_token) {
        getGoogleToken(google_token);
    }
}