export const FRONT_BASE_URL = "http://127.0.0.1:5500"
export const BACK_BASE_URL = "http://127.0.0.1:8000"
export const REDIRECT_URI = `${FRONT_BASE_URL}/index.html`
export const access_token = localStorage.getItem("access")
export const payload = JSON.parse(localStorage.getItem("payload"))

// 로그인
export async function handleLoginAPI() {
	const email = document.getElementById("email").value;
	const password = document.getElementById("password").value;
	const response = await fetch(`${BACK_BASE_URL}/api/users/login/`, {
		headers: {
			"content-type": "application/json"
		},
		method: "POST",
		body: JSON.stringify({
			email: email,
			password: password
		})
	});
	return response;
}

// 날짜에 대한 포인트 기록내역
export async function getPointView(day) {
	const response_point = await fetch(`${BACK_BASE_URL}/api/users/points/${day}/`, {
		headers: {
			'content-type': 'application/json',
			"Authorization": `Bearer ${access_token}`,
		},
		method: 'GET',
	})
	return response_point
}

// 날짜에 대한 포인트 통계
export async function getPointStaticView(day) {
	const response_point = await fetch(`${BACK_BASE_URL}/api/users/points/${day}/statistic/`, {
		headers: {
			'content-type': 'application/json',
			"Authorization": `Bearer ${access_token}`,
		},
		method: 'GET',
	})
	return response_point
}


// 출석포인트
export async function postPointAttendanceView() {
	const response_point = await fetch(`${BACK_BASE_URL}/api/users/attendance/`, {
		headers: {
			'content-type': 'application/json',
			"Authorization": `Bearer ${access_token}`,
		},
		method: 'POST',
	})
	return response_point
}

//텍스트리뷰 포인트
export async function postTextPointView() {
	const response_point = await fetch(`${BACK_BASE_URL}/api/users/text/`, {
		headers: {
			'content-type': 'application/json',
			"Authorization": `Bearer ${access_token}`,
		},
		method: 'POST',
	})
	return response_point;
}

//포토리뷰 포인트
export async function postPhotoPointView() {
	const response_point = await fetch(`${BACK_BASE_URL}/api/users/photo/`, {
		headers: {
			'content-type': 'application/json',
			"Authorization": `Bearer ${access_token}`,
		},
		method: 'POST',
	})
	return response_point;
}

// 포인트 충전 checkoutview
export async function postPointCheckoutView(amount, type) {
	const response_point = await fetch(`${BACK_BASE_URL}/api/users/payment/checkout/`, {
		headers: {
			'content-type': 'application/json',
			"Authorization": `Bearer ${access_token}`,
		},
		method: 'POST',
		body: JSON.stringify({
			"amount": amount,
			"type": type
		})
	})
	return response_point.json();
}

// 포인트 충전 validation
export async function postPointValidationView(merchant_id, imp_id, amount) {
	const response_point = await fetch(`${BACK_BASE_URL}/api/users/payment/validation/`, {
		headers: {
			'content-type': 'application/json',
			"Authorization": `Bearer ${access_token}`,
		},
		method: 'POST',
		body: JSON.stringify({
			"merchant_id": merchant_id,
			"imp_id": imp_id,
			"amount": amount
		})
	})
	return response_point.json();
}


// 프로필 정보 가져오기
export async function getUserProfileAPIView() {
	const user_id = payload.user_id
	const response_data = await fetch(`${BACK_BASE_URL}/api/users/profile/${user_id}/`, {
		headers: {
			'content-type': 'application/json',
			"Authorization": `Bearer ${access_token}`,
		},
		method: 'GET',
	})
	return response_data.json();
}

// 구독 정보 가져오기
export async function getSubscribeView() {
	const response_data = await fetch(`${BACK_BASE_URL}/api/users/subscribe/`, {
		headers: {
			'content-type': 'application/json',
			"Authorization": `Bearer ${access_token}`,
		},
		method: 'GET',
	})
	if (response_data.status == 200) {
		return response_data.json();
	} else {
		return [];
	}
}

// 구독 정보 해지(재등록)
export async function patchSubscribeView() {
	const response_data = await fetch(`${BACK_BASE_URL}/api/users/subscribe/`, {
		headers: {
			'content-type': 'application/json',
			"Authorization": `Bearer ${access_token}`,
		},
		method: 'PATCH',
	})
	return response_data;
}

// 첫 구독하기
export async function postSubscribeView() {
	const response_data = await fetch(`${BACK_BASE_URL}/api/users/subscribe/`, {
		headers: {
			'content-type': 'application/json',
			"Authorization": `Bearer ${access_token}`,
		},
		method: 'POST',
	})
	return response_data.status;
}

// 구독결제포인트
export async function postPointServiceView() {
	const response_data = await fetch(`${BACK_BASE_URL}/api/users/service/`, {
		headers: {
			'content-type': 'application/json',
			"Authorization": `Bearer ${access_token}`,
		},
		method: 'POST',
	})
	return response_data.status;
}


// 내가 쓴 리뷰 가져오기
export async function getMyReviewView() {
	const user_id = payload.user_id
	const response_data = await fetch(`${BACK_BASE_URL}/api/products/mypage/reviews/${user_id}/`, {
		headers: {
			'content-type': 'application/json',
			"Authorization": `Bearer ${access_token}`,
		},
		method: 'GET',
	})
	return response_data.json();
}

export async function getVerificationCodeAPI(email) {
	// 인증 코드 발급 받기
	const response = await fetch(`${BACK_BASE_URL}/api/users/get/auth_code/`, {
		headers: {
			'content-type': 'application/json',
		},
		method: 'PUT',
		body: JSON.stringify({
			"email": email,
		})
	})
	return response
}

export async function setUserInformationAPI() {
	// 비밀번호 수정 및 비활성 계정 활성화
	const email = document.getElementById("email").value
	const verificationCode = document.getElementById("verificationCode").value
	const password = document.getElementById("password").value
	const response = await fetch(`${BACK_BASE_URL}/api/users/`, {
		headers: {
			'content-type': 'application/json',
		},
		method: 'PATCH',
		body: JSON.stringify({
			"email": email,
			"verification_code": verificationCode,
			"password": password
		})
	})
	return response
}

export async function handleSignupAPI(email, nickname, password) {
	// 회원 가입
	const response = await fetch(`${BACK_BASE_URL}/api/users/`, {
		headers: {
			'content-type': 'application/json',
		},
		method: 'POST',
		body: JSON.stringify({
			"email": email,
			"nickname": nickname,
			"password": password
		})
	})
	return response

}


export async function VerificationCodeSubmitAPI(email, verificationCode) {
	// 회원 가입시 이메일 인증
	const response = await fetch(`${BACK_BASE_URL}/api/users/`, {
		headers: {
			'content-type': 'application/json',
		},
		method: 'PUT',
		body: JSON.stringify({
			"email": email,
			"verification_code": verificationCode,
		})
	})
	return response
}

export async function getUserInformationAPI() {
	// 사용자 정보 불러오기
	const response = await fetch(`${BACK_BASE_URL}/api/users/`, {
		headers: {
			'content-type': 'application/json',
			"Authorization": `Bearer ${access_token}`,
		},
		method: 'GET',
	})
	return response
}

export async function updateProfileInformationAPI(information) {
	// 사용자 프로필 정보 수정
	const user_id = information.user_id
	const nickname = information.nickName
	const bio = information.bio
	const profile_image = information.profile_image

	const formdata = new FormData();
	formdata.append('nickname', nickname)
	formdata.append('introduction', bio)
	if (profile_image) {
		formdata.append('profile_image', profile_image)
	}
	const response = await fetch(`${BACK_BASE_URL}/api/users/profile/${user_id}/`, {
		headers: {
			"Authorization": `Bearer ${access_token}`
		},
		method: 'PATCH',
		body: formdata
	})
	return response
}

export async function updateUserInformationAPI(information) {
	// 유저 상세 정보 수정 API
	const response = await fetch(`${BACK_BASE_URL}/api/users/profile/${information.user_id}/`, {
		headers: {
			'content-type': 'application/json',
			"Authorization": `Bearer ${access_token}`
		},
		method: 'PATCH',
		body: JSON.stringify({
			"email": information.email,
			"password": information.password,
			"new_password": information.new_password
		})
	})
	return response
}

export async function addressSubmitAPI(information) {
	const response = await fetch(`${BACK_BASE_URL}/api/users/create/delivery/${information.user_id}/`, {
		headers: {
			'content-type': 'application/json',
			"Authorization": `Bearer ${access_token}`
		},
		method: 'POST',
		body: JSON.stringify({
			recipient: information.recipient,
			postal_code: information.postcode,
			address: information.address,
			detail_address: information.detailAddress
		})
	})
	return response
}

export async function addressUpdateAPI(information) {
	// 배송 정보 수정 API
	const response = await fetch(`${BACK_BASE_URL}/api/users/delivery/${information.delivery_id}/`, {
		headers: {
			'content-type': 'application/json',
			"Authorization": `Bearer ${access_token}`
		},
		method: 'PUT',
		body: JSON.stringify({
			recipient: information.recipient,
			postal_code: information.postcode,
			address: information.address,
			detail_address: information.detailAddress
		})
	})
	return response
}

export async function addressDeleteAPI(delivery_id) {
	// 배송 정보 삭제 API
	const response = await fetch(`${BACK_BASE_URL}/api/users/delivery/${delivery_id}/`, {
		headers: {
			'content-type': 'application/json',
			"Authorization": `Bearer ${access_token}`
		},
		method: 'DELETE',
	})
	return response
}


export async function createSellerInformationAPI(information) {
	// 판매자 정보 생성 및 권한 신청
	const response = await fetch(`${BACK_BASE_URL}/api/users/seller/`, {
		headers: {
			'content-type': 'application/json',
			"Authorization": `Bearer ${access_token}`
		},
		method: 'POST',
		body: JSON.stringify({
			business_owner_name: information.business_owner_name,
			company_name: information.company_name,
			contact_number: information.contact_number,
			business_number: information.business_number,
			bank_name: information.bank_name,
			account_holder: information.account_holder,
			account_number: information.account_number,
		})
	})
	return response
}

export async function updateSellerInformationAPI(information) {
	// 판매자 정보 수정
	const response = await fetch(`${BACK_BASE_URL}/api/users/seller/`, {
		headers: {
			'content-type': 'application/json',
			"Authorization": `Bearer ${access_token}`
		},
		method: 'PUT',
		body: JSON.stringify({
			business_owner_name: information.business_owner_name,
			company_name: information.company_name,
			contact_number: information.contact_number,
			business_number: information.business_number,
			bank_name: information.bank_name,
			account_holder: information.account_holder,
			account_number: information.account_number,
		})
	})
	return response
}

export async function deleteSellerInformationAPI() {
	// 판매자 정보 삭제
	const response = await fetch(`${BACK_BASE_URL}/api/users/seller/`, {
		headers: {
			"Authorization": `Bearer ${access_token}`
		},
		method: 'DELETE',
	})

	return response
}

export async function deleteUserInformationAPI(user_id) {
	// 판매자 정보 삭제
	const response = await fetch(`${BACK_BASE_URL}/api/users/profile/${user_id}/`, {
		headers: {
			"Authorization": `Bearer ${access_token}`
		},
		method: 'DELETE',
	})

	return response
}

// 장바구니 삭제
export async function deleteCartItem(cart_item_id) {
	const response = await fetch(`${BACK_BASE_URL}/api/users/carts/?cart_id=${cart_item_id}`, {
		method: 'DELETE',
		headers: {
			"Authorization": `Bearer ${access_token}`,
			"Content-Type": "application/json"
		}
	})
	if (response.status == 204) {
		window.location.reload();
	}
	else {
		console.log(response.status);
	}
}

// 결제 후 장바구니 삭제
export async function deleteCartItemAll(queryString, bill_id) {
	const response = await fetch(`${BACK_BASE_URL}/api/users/carts/?${queryString}`, {
		method: 'DELETE',
		headers: {
			"Authorization": `Bearer ${access_token}`,
			"Content-Type": "application/json"
		}
	})
	if (response.status == 204) {
		window.location.href = "/bill_detail.html" + "?ordered=true" + `&bill_id=${bill_id}`;
	}
	else {
		console.log(response.status);
	}
}

// 장바구니 상품 수량 변경
export async function changeCartItemAmount(cart_item_id, amount) {
	const response = await fetch(`${BACK_BASE_URL}/api/users/carts/${cart_item_id}/`, {
		method: 'PATCH',
		headers: {
			"Authorization": `Bearer ${access_token}`,
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			"amount": amount
		})
	})

	if (response.status == 200) {
		const response_json = await response.json();
		window.location.reload();
		return response_json;
	}
	else {
		console.log(response.status);
	}
}

// 장바구니 목록 조회
export async function getCartList() {
	const response = await fetch(`${BACK_BASE_URL}/api/users/carts/`, {
		method: 'GET',
		headers: {
			"Authorization": `Bearer ${access_token}`,
		}
	})

	if (response.status == 200) {
		const response_json = await response.json();
		return response_json;
	} else {
		console.log(response.status);
	}
}

// 상품 등록하기
export async function registProductAPIView(formdata) {
	const response = await fetch(`${BACK_BASE_URL}/api/products/`, {
		method: 'POST',
		headers: {
			"Authorization": `Bearer ${access_token}`,
		},
		body: formdata
	});
	if (response.status === 201) {
		alert('상품등록 완료!')
		window.location.replace(`${FRONT_BASE_URL}/sellerpage.html`)
	} else {
		alert('상품 등록 실패')
	}

	return response.json();
}

// 상품 정보 전체 불러오기
// # 상품 전체 조회
export async function getProductListAPIView() {
	const response = await fetch(`${BACK_BASE_URL}/api/products/`, {
		headers: {
			"Authorization": `Bearer ${access_token}`,
		},
		method: "GET",
	});

	return response.json();
}

// 특정 판매자의 상품 정보 전체 불러오기
// # 특정 판매자의 상품 전체 조회
export async function getSellerProductListAPIView(user_id) {
	const response = await fetch(`${BACK_BASE_URL}/api/products/seller/${user_id}/`, {
		headers: {
			"Authorization": `Bearer ${access_token}`,
		},
		method: "GET",
	});
	return response.json();
}


// 상품별 상세 정보 가져오기
// # 상품 상세 조회
export async function getProductDetailAPIView(product_id) {
	const response = await fetch(`${BACK_BASE_URL}/api/products/${product_id}/`, {
		headers: {
			"Authorization": `Bearer ${access_token}`,
		},
		method: "GET",
	});
	return response.json();
}

// 상품별 상세 정보 가져오기
// 상품 수정 하기 
export async function editProductDetailAPIView(product_id, formdata) {
	const response = await fetch(`${BACK_BASE_URL}/api/products/${product_id}/`, {
		headers: {
			"Authorization": `Bearer ${access_token}`,
		},
		method: "PUT",
		body: formdata
	});
	if (response.status == 200) {
		alert('상품 수정 완료!')
		window.location.href = `${FRONT_BASE_URL}/sellerpage.html`;
	} else {
		alert('상품 수정 실패')
	}
	return response.json();
}


//  싱픔뱔 상세 정보 가져오기
// # 상품 삭제하기
export async function deletetProductDetailAPIView(product_id) {
	const response = await fetch(`${BACK_BASE_URL}/api/products/${product_id}/`, {
		headers: {
			"Authorization": `Bearer ${access_token}`,
		},
		method: "DELETE",
	});
	if (response.status == 204) {
		alert("상품 삭제 완료!")
		window.location.href = "sellerpage.html";
	} else {
		alert("상품 삭제 실패!")
	}
	return response.json();
}

// 전체 주문 목록 불러오기
// # 전체 주문 목록 조회
export async function getAllOrderListView() {
	const response = await fetch(`${BACK_BASE_URL}/api/users/orders/products/`, {
		headers: {
			"Authorization": `Bearer ${access_token}`,
		},
		method: "GET",
	});
	return response.json();
}

// 상품별 주문 목록 불러오기
// # 주문 목록 조회
export async function getOrderListView(product_id) {
	const response = await fetch(`${BACK_BASE_URL}/api/users/orders/products/${product_id}/`, {
		headers: {
			"Authorization": `Bearer ${access_token}`,
		},
		method: "GET",
	});
	return response.json();
}

// 판매자별 주문 목록 불러오기
// # 판매자별 주문 목록 조회
export async function getSellerOrderListView(user_id) {
	const response = await fetch(`${BACK_BASE_URL}/api/users/orders/products/seller/${user_id}/`, {
		headers: {
			"Authorization": `Bearer ${access_token}`,
		},
		method: "GET",
	});
	return response.json();
}

// 찜 등록 유저 불러오기
// # 상품 찜  등록 및 취소, 찜 등록한 유저의 간략한 정보 불러오기
export async function getWishListAPIView(product_id) {
	const response = await fetch(`${BACK_BASE_URL}/api/users/wish/${product_id}/`, {
		headers: {
			"Authorization": `Bearer ${access_token}`,
		},
		method: "GET",
	});
	return response.json();
}

// 특정 상품의 리뷰 등록하기
export async function writeReviewAPI(product_id, formdata) {
	const response = await fetch(`${BACK_BASE_URL}/api/products/${product_id}/reviews/`, {
		method: 'POST',
		headers: {
			"Authorization": `Bearer ${access_token}`,
		},
		body: formdata
	});
	if (response.status == 201) {
		window.location.reload();
	} else {
		alert("리뷰 등록 실패!")
	}
	return response.json();
}
// 특정 상품의 전체 리뷰 불러오기
// # 리뷰 조회, 생성
export async function getReviewView(product_id) {
	const response = await fetch(`${BACK_BASE_URL}/api/products/${product_id}/reviews/`, {
		headers: {
			"Authorization": `Bearer ${access_token}`,
		},
		method: "GET",
	});
	return response.json();
}
// 특정 상품의 특정 리뷰 불러 오기
// 이전 리뷰 불러오기

export async function showReviewDetailViewAPI(product_id, review_id) {
	const response = await fetch(`${BACK_BASE_URL}/api/products/${product_id}/reviews/${review_id}/`, {
		headers: {
			"Authorization": `Bearer ${access_token}`,
		},
		method: "GET",
	});
	return response.json();
}
// 특정 상품의 특정 리뷰 불러오기
// # 리뷰 수정
export async function editReviewViewAPI(product_id, review_id, formdata) {
	const response = await fetch(`${BACK_BASE_URL}/api/products/${product_id}/reviews/${review_id}/`, {
		headers: {
			"Authorization": `Bearer ${access_token}`,
		},
		method: "PUT",
		body: formdata
	});
	if(response.status == 200){
		alert("리뷰 수정 성공!")
		window.location.href=`${FRONT_BASE_URL}/productdetail.html?product_id=${product_id}`;
	} else {
		alert("리뷰 수정 실패!")
	}
	return response.json();
}

// 주문상태 이름 조회
// # 주문 상태 조회
export async function getStatusView(status_id) {
	const response = await fetch(`${BACK_BASE_URL}/api/users/orders/products/${status_id}/`, {
		headers: {
			"Authorization": `Bearer ${access_token}`,
		},
		method: "GET",
	});
	return response.json();
}

// 판매자 정보 조회
export async function getSellerPermissionAPIView(user_id) {
	const response = await fetch(`${BACK_BASE_URL}/api/users/seller/permissions/${user_id}/`, {
		headers: {
			"Authorization": `Bearer ${access_token}`,
		},
		method: "GET",
	});
	return response.json();
}


// 체크한 카트 정보만 주문으로 넘겨주기
export async function getCheckedCart(queryString) {
	const response = await fetch(`${BACK_BASE_URL}/api/users/carts/?${queryString}`, {
		headers: {
			'content-type': 'application/json',
			"Authorization": `Bearer ${access_token}`,
		},
		method: 'GET',
	});
	if (response.status === 200) {
		const response_json = response.json();
		return response_json;
	}
	else {
		alert("잘못된 요청입니다.")
		window.history.back();
	}
}

// 주문내역 생성
export async function makeBills(delivery_id) {
	const response = await fetch(`${BACK_BASE_URL}/api/users/bills/`, {
		headers: {
			'content-type': 'application/json',
			"Authorization": `Bearer ${access_token}`,
		},
		method: 'POST',
		body: JSON.stringify({
			delivery_id: delivery_id
		})
	})
	const response_json = await response.json();
	console.log(response_json)
	return response_json
}


// 주문들 생성
export async function makeOrders(queryString, bill_id) {
	const response = await fetch(`${BACK_BASE_URL}/api/users/bills/${bill_id}/orders/?${queryString}`, {
		headers: {
			'content-type': 'application/json',
			"Authorization": `Bearer ${access_token}`
		},
		method: 'POST'
	})
	if (response.status == 201) {
		deleteCartItemAll(queryString, bill_id);
	}
	else if (response.status == 404) {
		alert("잘못된 상품 정보입니다.")
		window.history.back();
	}
	else if (response.status == 400) {
		alert("잘못된 URL입니다. 장바구니부터 다시 시도해주세요.")
		window.history.back();
	}
}

export async function setCustomsCodeAPI(information) {
	// 통관번호 등록 및 수정
	const user_id = information.user_id
	const response = await fetch(`${BACK_BASE_URL}/api/users/profile/${user_id}/`, {
		headers: {
			'content-type': 'application/json',
			"Authorization": `Bearer ${access_token}`
		},
		method: 'PATCH',
		body: JSON.stringify({
			customs_code: information.customs_code

		})
	})
	return response
}


export async function getAuthNumberAPI(information) {
	// 휴대폰 번호 등록과 수정 및 인증 번호 발급 받기
	const response = await fetch(`${BACK_BASE_URL}/api/users/phone/verification/`, {
		headers: {
			'content-type': 'application/json',
			"Authorization": `Bearer ${access_token}`
		},
		method: 'PUT',
		body: JSON.stringify({
			phone_number: information.phone_number

		})
	})
	return response
}
export async function submitVerificationNumbersAPI(information) {
	// 휴대폰 인증 번호 제출
	const response = await fetch(`${BACK_BASE_URL}/api/users/phone/verification/`, {
		headers: {
			'content-type': 'application/json',
			"Authorization": `Bearer ${access_token}`
		},
		method: 'PATCH',
		body: JSON.stringify({
			verification_numbers: information.verification_numbers

		})
	})
	return response
}


export async function getBillDetail(bill_id) {
	// 구매 내역 상세 조회
	const response = await fetch(`${BACK_BASE_URL}/api/users/bills/${bill_id}/`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			"Authorization": "Bearer " + localStorage.getItem("access")
		},
	})

	if (response.status == 200) {
		const response_json = await response.json();
		console.log(response_json);
		return response_json;
	} else {
		console.log(response.status);
	}
}

export async function getBillList() {
	// 구매 내역 목록 조회
	const response = await fetch(`${BACK_BASE_URL}/api/users/bills/`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			"Authorization": "Bearer " + localStorage.getItem("access")
		}
	})

	if (response.status == 200) {
		const response_json = await response.json();
		console.log(response_json);
		return response_json;
	} else {
		console.log(response.status);
	}
}

export async function billToCart(orderItem) {
	// 구매내역에서 장바구니 추가하기
	const response = await fetch(`${BACK_BASE_URL}/api/users/bills/cart/`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			"Authorization": `Bearer ${access_token}`
		},
		body: JSON.stringify({
			order_items: orderItem
		})
	})
	if (response.status == 200) {
		const response_json = await response.json();
		console.log(response.status);
		console.log(response_json);
	}
}
