import { BACK_BASE_URL, FRONT_BASE_URL, searchProductAPI, searchWhatAPI, sameCategoryProductView, getProductslist, viewProductslist, getCategoryView, getProductListAPIView } from './api.js'

export async function goSearch(url) {
    window.location.href = `${FRONT_BASE_URL}/mobile-index.html?url=${url}`;
}

export async function goEditReview(keyword) {
    window.location.href = `${FRONT_BASE_URL}/mobile-index.html?search=${keyword}`;
}

export async function categoryview() {
    const categories = await getCategoryView();
    const categorySelect = document.getElementById("categorymenu");
    const categoryBox = document.createElement("div");
    categoryBox.setAttribute("class", "category-box")

    categories.forEach(category => {
        const categoryItem = document.createElement("a");
        categoryItem.setAttribute("id", `${category.id}`);
        categoryItem.setAttribute("href", `mobile-index.html?category_id=${category.id}`);
        categoryItem.innerText = `🍫${category.name}\n`
        categoryBox.appendChild(categoryItem);
        categorySelect.appendChild(categoryBox);
    });
}

export async function keywordSeachView() {
    const answer = document.getElementById("search-keyword");
    const keyword = answer.value;
    goEditReview(keyword)
}

export async function showSameCategory() {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryId = urlParams.get('category_id');
    console.log(categoryId);
    const response = await sameCategoryProductView(categoryId);

    const product = response.results;
    if ((product.next == null) & (product.previous == null)) {
        viewProductslist(response)
    } else {
        getProductslist(response)
    }

}

export async function showSearchKeywordProduct() {
    const urlParams = new URLSearchParams(window.location.search);
    const keyword = urlParams.get('search');
    const products = await searchProductAPI(keyword);
    const product = products.results;

    console.log(product)
    if ((product.next == null) & (product.previous == null)) {
        viewProductslist(products)
    } else {
        getProductslist(products)
    }
}

export async function searchAnythingAPI() {
    const urlParams = new URLSearchParams(window.location.search);
    const url = new URLSearchParams();

    const categoryId = urlParams.get('category_id');
    const categories = await getCategoryView();

    const products = await searchProductAPI(keyword);
    const product = products.results;

    const search = document.getElementById("search");
    const keyword = urlParams.get('search');

    const ordering = document.getElementById("ordering")

    // 카테고리 검색 카테고리 ID가 url에 있을때
    if (categoryId) {
        categories.forEach(category => {

            url += `category=${categoryId}`
        });
    }
    // 검색창 입력어로 검색 : 키워드가 url에 있을때
    else if (keyword) {
        search.addEventListener("click", function () {

            url += `search=${keyword}`
        })
    }
    // 정렬 : 정렬 규칙이 url에 있을 때 
    else if (ordering) {
        ordering.addEventListener("click", function () {

            url += `ordering=${ordering}`
            window.location.href = url
        });
    }

    goSearch(url)
}

export async function setEventListener() {
    document.getElementById("search-btn").addEventListener("click", keywordSeachView);
}

window.onload = async function () {
    categoryview()
    setEventListener()
    const product = await getProductListAPIView();
    // console.log(product)
    const choco = document.getElementById("chocobanner")
    choco.addEventListener("click", function () {
        window.location.href = "subscriptioninfo.html";
    })

    const urlParams = new URLSearchParams(window.location.search);
    const categoryId = urlParams.get('category_id');
    const search = urlParams.get('search');
    if (categoryId) {
        showSameCategory()
    } else if (search) {
        showSearchKeywordProduct()
    } else if ((product.next == null) & (product.previous == null)) {
        viewProductslist(product);
    } else {
        getProductslist(product);
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
        window.history.back();
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