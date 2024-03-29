export const FRONT_BASE_URL = "http://127.0.0.1:5500"
export const BACK_BASE_URL = "http://127.0.0.1:8000"
// export const BACK_BASE_URL = "http://127.0.0.1"
// export const BACK_BASE_URL = "https://backend.chocothecoo.com"

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
			"payment_type": type
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
export async function getUserProfileAPIView(user_id) {
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


// 내가 쓴 리뷰 가져오기
export async function getMyReviewView() {
	const response_data = await fetch(`${BACK_BASE_URL}/api/products/mypage/reviews/`, {
		headers: {
			'content-type': 'application/json',
			"Authorization": `Bearer ${access_token}`,
		},
		method: 'GET',
	})
	return response_data.json();
}

export async function getEmailVerificationCodeAPI(email) {
	// 이메일 수정
	const response = await fetch(`${BACK_BASE_URL}/api/users/update/information/`, {
		headers: {
			'content-type': 'application/json',
			"Authorization": `Bearer ${access_token}`
		},
		method: 'POST',
		body: JSON.stringify({
			email: email
		})
	})
	return response
}

export async function submitChangeEamilInformationAPI(information) {
	// 이메일 수정
	const response = await fetch(`${BACK_BASE_URL}/api/users/update/information/`, {
		headers: {
			'content-type': 'application/json',
			"Authorization": `Bearer ${access_token}`
		},
		method: 'PUT',
		body: JSON.stringify({
			verification_code: information.verification_code
		})
	})
	return response
}

export async function getVerificationCodeAPI(email) {
	// 인증 코드 발급 받기
	const response = await fetch(`${BACK_BASE_URL}/api/users/get/auth_code/`, {
		headers: {
			'content-type': 'application/json',
		},
		method: 'POST',
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
	const response = await fetch(`${BACK_BASE_URL}/api/users/get/auth_code/`, {
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
	const response = await fetch(`${BACK_BASE_URL}/api/users/get/auth_code/`, {
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
	const response = await fetch(`${BACK_BASE_URL}/api/users/update/information/`, {
		headers: {
			"Authorization": `Bearer ${access_token}`
		},
		method: 'PATCH',
		body: formdata
	})
	return response
}

export async function updateUserInformationAPI(information) {
	// 유저 상세 정보 수정 API (비밀번호)
	const response = await fetch(`${BACK_BASE_URL}/api/users/`, {
		headers: {
			'content-type': 'application/json',
			"Authorization": `Bearer ${access_token}`
		},
		method: 'PUT',
		body: JSON.stringify({
			"password": information.password,
			"new_password": information.new_password
		})
	})
	return response
}

export async function addressSubmitAPI(information) {
	// 배송 정보 추가
	const response = await fetch(`${BACK_BASE_URL}/api/users/delivery/`, {
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
	const company_img = information.company_img
	const formdata = new FormData();
	formdata.append('business_owner_name', information.business_owner_name,)
	formdata.append('company_name', information.company_name,)
	formdata.append('contact_number', information.contact_number,)
	formdata.append('business_number', information.business_number,)
	formdata.append('bank_name', information.bank_name,)
	formdata.append('account_holder', information.account_holder,)
	formdata.append('account_number', information.account_number,)
	if (company_img) {
		formdata.append('company_img', company_img)
	}

	// 판매자 정보 수정
	const response = await fetch(`${BACK_BASE_URL}/api/users/seller/`, {
		headers: {
			"Authorization": `Bearer ${access_token}`
		},
		method: 'POST',
		body: formdata,
	})
	return response
}

export async function updateSellerInformationAPI(information) {
	// 판매자 정보 수정
	const company_img = information.company_img
	const formdata = new FormData();
	formdata.append('business_owner_name', information.business_owner_name,)
	formdata.append('company_name', information.company_name,)
	formdata.append('contact_number', information.contact_number,)
	formdata.append('business_number', information.business_number,)
	formdata.append('bank_name', information.bank_name,)
	formdata.append('account_holder', information.account_holder,)
	formdata.append('account_number', information.account_number,)
	if (company_img) {
		formdata.append('company_img', company_img)
	}

	// 판매자 정보 수정
	const response = await fetch(`${BACK_BASE_URL}/api/users/seller/`, {
		headers: {
			"Authorization": `Bearer ${access_token}`
		},
		method: 'PUT',
		body: formdata,
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

export async function deleteUserInformationAPI() {
	// 휴면 계정으로 전환
	const response = await fetch(`${BACK_BASE_URL}/api/users/`, {
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
		alert("주문이 완료되었습니다. 구매포인트 적립은 구매확정 후 이루어집니다.");
		window.location.href = `/bill_detail.html?bill_id=${bill_id}`;
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
	const response_json = await response.json();
	if (response.status == 200) {
		return response_json;
	} else if (response.status == 400) {
		alert(response_json)
		window.location.href = `${FRONT_BASE_URL}/user_detail_page.html`;
	} else {
		console.log(response.status);
	}
}


// 상품 등록하기
export async function registProductAPIView(formdata, seller) {
	const response = await fetch(`${BACK_BASE_URL}/api/products/`, {
		method: 'POST',
		headers: {
			"Authorization": `Bearer ${access_token}`,
		},
		body: formdata
	});
	if (response.status === 201) {
		alert('상품등록 완료!')
		window.location.replace(`${FRONT_BASE_URL}/sellerpage.html?seller=${seller}`)
	} else {
		alert('카테고리가 입력되지 않아 상품 등록에 실패했습니다.');
	}

	return response.json();
}

// 상품 정보 전체 불러오기
// # 상품 전체 조회
export async function getProductListAPIView() {
	const response = await fetch(`${BACK_BASE_URL}/api/products/`, {
		method: "GET",
	});

	return response.json();
}

// 특정 판매자의 상품 정보 전체 불러오기
// # 특정 판매자의 상품 전체 조회
export async function getSellerProductListAPIView(seller_id) {
	const response = await fetch(`${BACK_BASE_URL}/api/products/?user_id=${seller_id}`, {
		method: "GET",
	});
	return response.json();
}

// 특정 판매자의 상품 정보 페이지네이션 없이 전체 불러오기
// # 특정 판매자의 상품 페이지네이션 없이 전체 조회
export async function getAllProductListAPIView(user_id) {
	const response = await fetch(`${BACK_BASE_URL}/api/products/seller/${user_id}/all/`, {
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
	let response = ''
	if (access_token == null) {
		response = await fetch(`${BACK_BASE_URL}/api/products/${product_id}/`, {
			method: "GET",
		});
	} else {
		response = await fetch(`${BACK_BASE_URL}/api/products/${product_id}/`, {
			headers: {
				"Authorization": `Bearer ${access_token}`,
			},
			method: "GET",
		});
	}
	if (response.status == 404) {
		alert("상품 정보를 찾을 수 없습니다.")
		window.location.replace(`${FRONT_BASE_URL}/index.html`)
	}

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
	return response;
}


//  상품별 상세 정보 가져오기
// # 상품 삭제하기
export async function deleteProductDetailAPIView(product_id) {
	const response = await fetch(`${BACK_BASE_URL}/api/products/${product_id}/`, {
		headers: {
			"Authorization": `Bearer ${access_token}`,
		},
		method: "DELETE",
	});
	return response;
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
export async function getSellerOrderListView() {
	const response = await fetch(`${BACK_BASE_URL}/api/users/orders/products/`, {
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
		alert("리뷰 등록 성공!")
		window.location.href = `${FRONT_BASE_URL}/productdetail.html?product_id=${product_id}`;
	} else if (response.status == 406) {
		alert("해당 상품 리뷰를 이미 작성했습니다.")
		window.location.href = `${FRONT_BASE_URL}/productdetail.html?product_id=${product_id}`;
	} else if (response.status == 404) {
		alert("판매자가 삭제한 상품입니다 ㅠㅠ")
		window.location.href = `${FRONT_BASE_URL}/mypage.html`
	} else if (response.status == 400) {
		alert("구매 이력이 없습니다")
		window.location.href = `${FRONT_BASE_URL}/mypage.html`
	} else {
		alert("리뷰 등록 실패!")
	}
	return response.json();
}
// 특정 상품의 전체 리뷰 불러오기
// # 리뷰 조회, 생성
export async function getReviewView(product_id) {
	const response = await fetch(`${BACK_BASE_URL}/api/products/${product_id}/reviews/`, {
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
	if (response.status == 200) {
		alert("리뷰 수정 성공!")
		window.location.href = `${FRONT_BASE_URL}/productdetail.html?product_id=${product_id}`;
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
	let response = ""
	if (access_token == null) {
		response = await fetch(`${BACK_BASE_URL}/api/users/seller/permissions/${user_id}/`, {
			method: "GET",
		});
	} else {
		response = await fetch(`${BACK_BASE_URL}/api/users/seller/permissions/${user_id}/`, {
			headers: {
				"Authorization": `Bearer ${access_token}`,
			},
			method: "GET",
		});
	}
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
export async function makeBills(delivery_id = null, delivery_data = null) {
	let data;
	if (delivery_data) {
		data = JSON.stringify({
			new_delivery: delivery_data.new_delivery,
			save_delivery: delivery_data.save_delivery,
			recipient: delivery_data.recipient,
			postal_code: delivery_data.postcode,
			address: delivery_data.address,
			detail_address: delivery_data.detailAddress
		})
	} else if (delivery_id !== null) {
		data = JSON.stringify({
			delivery_id: delivery_id
		})
	}
	const response = await fetch(`${BACK_BASE_URL}/api/users/bills/`, {
		headers: {
			'content-type': 'application/json',
			"Authorization": `Bearer ${access_token}`,
		},
		method: 'POST',
		body: data
	})
	if (response.status == 201) {
		const response_json = await response.json()
		return response_json
	} else if (response.status == 404) {
		alert("배송지 정보가 부정확합니다!")
	} else if (response.status == 400) {
		const message_list = [
			'핸드폰 인증이 필요합니다.',
			'배송 정보를 다섯개 이상 등록 하셨습니다.',
			'우편 번호가 올바르지 않습니다.',
			'주소지 정보가 올바르지 않습니다.'
		]
		alert(message_list[Number(response_json.non_field_errors)])
	}
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
	const response_json = await response.json()

	if (response.status == 201) {
		deleteCartItemAll(queryString, bill_id);
	} else if (response_json.err == "no_cart") {
		alert("장바구니 정보를 다시 확인해주세요")
		window.history.back();
	} else if (response_json.err == "incorrect_product") {
		alert("상품 정보가 부정확합니다")
		window.history.back();
	} else if (response_json.err == "insufficient_balance") {
		alert("결제를 위한 포인트가 부족합니다")
		window.history.back();
	} else if (response_json.err == "out_of_stock") {
		alert("구매하려는 수량이 상품의 재고보다 많습니다")
		window.history.back();
	}
}

export async function setCustomsCodeAPI(information) {
	// 통관번호 등록 및 수정
	const user_id = information.user_id
	const response = await fetch(`${BACK_BASE_URL}/api/users/`, {
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


//채팅방 만들기
export async function postChatindexAPI(name, desc, password) {
	const response = await fetch(`${BACK_BASE_URL}/chat/room/`, {
		headers: {
			'content-type': 'application/json',
			"Authorization": `Bearer ${access_token}`
		},
		method: 'POST',
		body: JSON.stringify({
			"name": name,
			"desc": desc,
			"password": password
		})
	})
	return response.status
}

//모든 채팅방 정보 가져오기
export async function getChatindexAPI() {
	const response = await fetch(`${BACK_BASE_URL}/chat/`, {
		headers: {
			'content-type': 'application/json',
			"Authorization": `Bearer ${access_token}`
		},
		method: 'GET',
	})
	return response.json()
}


// 채팅방 삭제하기
export async function deleteChatroom(room_id) {
	const response = await fetch(`${BACK_BASE_URL}/chat/room/${room_id}/`, {
		headers: {
			'content-type': 'application/json',
			"Authorization": `Bearer ${access_token}`
		},
		method: 'DELETE',
	})
	return response.status
}


// 채팅방 속 채팅 기록 가져오기
export async function getChatLogAPI(id) {
	const response = await fetch(`${BACK_BASE_URL}/chat/${id}/`, {
		headers: {
			'content-type': 'application/json',
			"Authorization": `Bearer ${access_token}`
		},
		method: 'GET',
	})
	if (response.status != 200) {
		alert("로그인이 필요 합니다.")
		window.location.replace(`${FRONT_BASE_URL}/login.html`)
	}
	return response.json()
}

// 채팅방 정보 불러오기
export async function getChatroominfo(room_id) {
	const response = await fetch(`${BACK_BASE_URL}/chat/room/${room_id}/`, {
		headers: {
			'content-type': 'application/json',
			"Authorization": `Bearer ${access_token}`
		},
		method: 'GET',
	})
	if (response.status == 404) {
		alert("채팅방 을 찾을 수 없습니다.")
		window.location.replace(`${FRONT_BASE_URL}/index.html`)
	}
	return response.json()
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
		return response_json;
	} else {
		console.log(response.status);
	}
}

export async function billToCart(bill_id) {
	// 구매내역에서 장바구니 추가하기
	const response = await fetch(`${BACK_BASE_URL}/api/users/carts/`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			"Authorization": `Bearer ${access_token}`
		},
		body: JSON.stringify({
			bill_id: bill_id
		})
	})
	if (response.status == 200) {
		const toastElement = document.getElementById("toast");
		toastElement.style.display = "block";
		setTimeout(() => {
			toastElement.style.display = "none";
		}, 2000);
	}
}

export async function OrderItemToCart(orderItemId) {
	// 구매내역에서 장바구니 추가하기
	const response = await fetch(`${BACK_BASE_URL}/api/users/carts/`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			"Authorization": `Bearer ${access_token}`
		},
		body: JSON.stringify({
			order_item_id: orderItemId
		})
	})
	if (response.status == 200) {
		const toastElement = document.getElementById("toast");
		toastElement.style.display = "block";
		setTimeout(() => {
			toastElement.style.display = "none";
		}, 2000);
	}
}


// 상품 상세내역으로 가기
export async function productDetail(product_id) {
	window.location.href = `${FRONT_BASE_URL}/productdetail.html?product_id=${product_id}`
}

//페이지네이션 : 리스트 가져오기 페이지 네이션 할때 
export async function getProductslist(product) {
	let pageSize = 9;

	const product_count = product.count
	const page_count = parseInt(product_count / pageSize) + 1

	// URL에서 "page" 매개변수 값을 추출
	let urlParams = new URLSearchParams(new URL(product.next).search);
	let currentPage = parseInt(urlParams.get('page'));

	// 두 칸 뒤의 숫자 계산
	const page_num = currentPage - 1;

	const pre_page = 1
	const next_page = page_num + 1
	const paginate = document.getElementById('product-buttons')

	// 배포
	const originalUrl = "http://backend:8000/api";
	const modifiedUrl = originalUrl.replace("http://backend:8000/api", "https://backend.chocothecoo.com/api");

	// 로컬일 때는 
	// const next = modifiedUrl + product.next.split("api")[1] 주석하기
	// const previous = modifiedUrl + product.previous.split("api")[1] 주석하기
	// pageMove(next) -> pageMove(product.next), pageMove(previous) -> pageMove(product.previous) 변경하면 된다~


	if (paginate) {
		if (product_count <= 9) {
			paginate.remove();
		} else {
			if (product.previous == null) {

				const next = modifiedUrl + product.next.split("api")[1]

				const li1 = document.createElement('li');
				li1.className = 'gw-pagebtn';
				const a1 = document.createElement('a');
				a1.id = 'page_item_pre';
				a1.className = 'gw-pagenum gw-p-move';
				a1.dataset.page = pre_page;
				const span1 = document.createElement('span');
				const li2 = document.createElement('li');
				li2.className = 'gw-pagebtn';
				const a2 = document.createElement('a');
				a2.id = 'gw-pagenum';
				a2.innerText = `${page_num} / ${page_count}`;
				const li3 = document.createElement('li');
				li3.className = 'gw-pagebtn';
				const a3 = document.createElement('a');
				a3.id = 'page_item_next';
				a3.className = 'gw-pagenum gw-p-move';
				a3.dataset.page = next_page;
				const span2 = document.createElement('span');
				const button1 = document.createElement('button');
				button1.id = 'next-buttons';
				button1.innerText = '다음';
				button1.addEventListener('click', () => pageMove(next));

				// Append elements
				paginate.innerHTML = '';
				paginate.appendChild(li1);
				paginate.appendChild(li2);
				paginate.appendChild(li3);
				li1.appendChild(a1);
				li2.appendChild(a2);
				li3.appendChild(a3);
				span2.appendChild(button1);
				a1.appendChild(span1);
				a3.appendChild(span2);
			} else if (product.next == null) {
				// Create elements

				const previous = modifiedUrl + product.previous.split("api")[1]

				const li1 = document.createElement('li');
				li1.className = 'gw-pagebtn';
				const a1 = document.createElement('a');
				a1.id = 'page_item_pre';
				a1.className = 'gw-pagenum gw-p-move';;
				a1.dataset.page = pre_page;
				const span1 = document.createElement('span');
				const li2 = document.createElement('li');
				li2.className = 'gw-pagebtn';
				const a2 = document.createElement('a');
				a2.id = 'gw-pagenum';
				a2.innerText = `${page_num} / ${page_count}`;
				const li3 = document.createElement('li');
				li3.className = 'gw-pagebtn';
				const a3 = document.createElement('a');
				a3.id = 'page_item_next';
				a3.className = 'gw-pagenum gw-p-move';
				const span2 = document.createElement('span');
				const button1 = document.createElement('button');
				button1.id = 'previous-buttons';
				button1.innerText = '이전';
				button1.addEventListener('click', () => pageMove(previous));

				// Append elements
				li1.appendChild(a1);
				li2.appendChild(a2);
				li3.appendChild(a3);
				a1.appendChild(span2);
				a3.appendChild(span1);
				span2.appendChild(button1);
				paginate.innerHTML = '';
				paginate.appendChild(li1);
				paginate.appendChild(li2);
				paginate.appendChild(li3);
			} else {
				// Create elements

				const previous = modifiedUrl + product.previous.split("api")[1]
				const next = modifiedUrl + product.next.split("api")[1]

				const li1 = document.createElement('li');
				li1.className = 'gw-pagebtn';
				const a1 = document.createElement('a');
				a1.id = 'page_item_pre';
				a1.className = 'gw-pagenum gw-p-move';
				a1.dataset.page = pre_page;
				const span1 = document.createElement('span');
				const button1 = document.createElement('button');
				button1.id = 'previous-buttons';
				button1.innerText = '이전';
				button1.addEventListener('click', () => pageMove(previous));
				const li2 = document.createElement('li');
				li2.className = 'gw-pagebtn';
				const a2 = document.createElement('a');
				a2.id = 'gw-pagenum';
				a2.innerText = `${page_num} / ${page_count}`;
				const li3 = document.createElement('li');
				li3.className = 'gw-pagebtn';
				const a3 = document.createElement('a');
				a3.id = 'page_item_next';
				a3.className = 'gw-pagenum gw-p-move';
				a3.dataset.page = next_page;
				const span2 = document.createElement('span');
				const button2 = document.createElement('button');
				button2.id = 'next-buttons';
				button2.innerText = '다음';
				button2.addEventListener('click', () => pageMove(next));

				// Append elements
				span1.appendChild(button1);
				span2.appendChild(button2);
				paginate.innerHTML = '';
				paginate.appendChild(li1);
				paginate.appendChild(li2);
				paginate.appendChild(li3);
				a1.appendChild(span1);
				a3.appendChild(span2);
				li1.appendChild(a1);
				li2.appendChild(a2);
				li3.appendChild(a3);
			}
		}
		viewProductslist(product)
	}
}

// 페이지네이션: 상품정보가져오기 페이지 네이션 안들어갈때
export async function viewProductslist(product) {
	const list = document.getElementById("product-content");
	if (product.results != "") {
		//초기화
		while (list.hasChildNodes()) {
			list.removeChild(list.lastChild);
		}

		product.results.forEach(e => {
			const newCol = document.createElement("div");
			newCol.setAttribute("class", "col-4");

			const newCard = document.createElement("div");
			newCard.setAttribute("class", "card");
			newCard.setAttribute("id", e.id);

			const newImageCard = document.createElement("div");
			newImageCard.setAttribute("class", "image-card")

			newCard.onclick = function () {
				productDetail(e.id);
			};

			const img = document.createElement("img");
			img.setAttribute("class", "card-img-top");

			if (e.image) {
				img.setAttribute(
					"src",
					`${e.image}`
				);
			} else {
				img.setAttribute("src", '/static/images/기본이미지.gif')
			}

			newImageCard.appendChild(img);
			newCard.appendChild(newImageCard);

			const newCardBody = document.createElement("div");
			newCardBody.setAttribute("class", "card-body");
			newCard.appendChild(newCardBody);

			const newCardTitle = document.createElement("h5");
			newCardTitle.setAttribute("class", "card-title");
			newCardTitle.innerText = e.name;
			newCardBody.appendChild(newCardTitle);

			const newCarddesc = document.createElement("div")
			newCarddesc.setAttribute("class", "carddesc")

			const newCardStar = document.createElement("div");
			newCardStar.setAttribute("class", "card-star")

			if (e.stars == 0) {
				newCardStar.innerText = "아직 리뷰별점이 없습니다."
			} else {
				newCardStar.innerText = "⭐" + e.stars + "점"
			}
			newCarddesc.appendChild(newCardStar);

			const newCardText = document.createElement("p");
			newCardText.setAttribute("class", "card-text");
			// newCardText.innerText = "상품가격 : " + e.price.toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' });
			newCardText.innerText = "상품가격 : " +
				(e.price
					? e.price.toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' })
					: "데이터 없음");
			newCarddesc.appendChild(newCardText)

			const newCardFooter = document.createElement("p");
			newCardFooter.setAttribute("class", "card-footer");
			newCardFooter.innerText = "상품수량 : " + e.amount + "개";
			newCarddesc.appendChild(newCardFooter)
			newCard.appendChild(newCarddesc)
			newCol.appendChild(newCard);
			list.appendChild(newCol);

			// 품절(2)일 경우 표시변경
			if (e.item_state == 2) {
				// 갯수 품절표시
				newCardFooter.innerText = '품절'
				// 이미지 soldout 표시
				const soldoutImage = document.createElement("img");
				soldoutImage.setAttribute("src", "/static/images/soldout.png");
				soldoutImage.style = "position:absolute; top:0; left:0; width:100%; opacity:0.8;";
				newImageCard.appendChild(soldoutImage)
			}
		})
	} else {
		list.innerText = "상품 정보가 없습니다."
	}
}

//페이지네이션
// 페이지 이동 시 함수 response에서 받아온 next url로 현재 페이지 찾기.
// 이전이나 다음이 각각 첫페이지나 마지막 페이지면 예외 처리.
async function pageMove(move) {
	let pageSize = 9;

	// const url = `${BACK_BASE_URL}/api/products/?page=${move}`
	const response = await fetch(move, {
		method: 'GET',
	})
	const product = await response.json()
	const page_count = parseInt(product.count / pageSize) + 1

	let page_num = 0
	let pre_page = 0
	let next_page = 0

	if (product.previous == null) {
		page_num = 1
		pre_page = 1
		next_page = 2
	} else if (product.next == null) {
		page_num = page_count
		pre_page = page_num - 1
		next_page = page_count
	} else {
		let urlParams = new URLSearchParams(new URL(product.next).search);
		let currentPage = parseInt(urlParams.get('page'));

		// 두 칸 뒤의 숫자 계산
		page_num = currentPage - 1;
		pre_page = page_num - 1
		next_page = page_num + 1
	}

	// 배포
	const originalUrl = "http://backend:8000/api";
	const modifiedUrl = originalUrl.replace("http://backend:8000/api", "https://backend.chocothecoo.com/api");

	// 로컬일 때는 
	// const next = modifiedUrl + product.next.split("api")[1] 주석하기
	// const previous = modifiedUrl + product.previous.split("api")[1] 주석하기
	// pageMove(next) -> pageMove(product.next), pageMove(previous) -> pageMove(product.previous) 변경하면 된다~

	// 페이지 박스 번호 갱신하기
	let paginate = document.getElementById('product-buttons')
	if (product.previous == null) {
		const next = modifiedUrl + product.next.split("api")[1]

		const li1 = document.createElement('li');
		li1.className = 'gw-pagebtn';
		const a1 = document.createElement('a');
		a1.id = 'page_item_pre';
		a1.className = 'gw-pagenum gw-p-move';
		a1.dataset.page = next_page;
		const span1 = document.createElement('span');
		const li2 = document.createElement('li');
		li2.className = 'gw-pagebtn';
		const a2 = document.createElement('a');
		a2.id = 'gw-pagenum';
		a2.innerText = `${page_num} / ${page_count}`;
		const li3 = document.createElement('li');
		li3.className = 'gw-pagebtn';
		const a3 = document.createElement('a');
		a3.id = 'page_item_next';
		a3.className = 'gw-pagenum gw-p-move';
		const span2 = document.createElement('span');
		const button1 = document.createElement('button');
		button1.id = 'next-buttons';
		button1.innerText = '다음';
		button1.addEventListener('click', () => pageMove(next));

		// Append elements
		paginate.innerHTML = '';
		paginate.appendChild(li1);
		paginate.appendChild(li2);
		paginate.appendChild(li3);
		li1.appendChild(a1);
		li2.appendChild(a2);
		li3.appendChild(a3);
		span2.appendChild(button1);
		a1.appendChild(span1);
		a3.appendChild(span2);
	} else if (product.next == null) {
		// Create elements

		const previous = modifiedUrl + product.previous.split("api")[1]

		const li1 = document.createElement('li');
		li1.className = 'gw-pagebtn';
		const a1 = document.createElement('a');
		a1.id = 'page_item_pre';
		a1.className = 'gw-pagenum gw-p-move';
		a1.dataset.page = pre_page;
		const span1 = document.createElement('span');
		const li2 = document.createElement('li');
		li2.className = 'gw-pagebtn';
		const a2 = document.createElement('a');
		a2.id = 'gw-pagenum';
		a2.innerText = `${page_num} / ${page_count}`;
		const li3 = document.createElement('li');
		li3.className = 'gw-pagebtn';
		const a3 = document.createElement('a');
		a3.id = 'page_item_next';
		a3.className = 'gw-pagenum gw-p-move';
		const span2 = document.createElement('span');
		const button1 = document.createElement('button');
		button1.id = 'previous-buttons';
		button1.innerText = '이전';
		button1.addEventListener('click', () => pageMove(previous));

		// Append elements
		li1.appendChild(a1);
		li2.appendChild(a2);
		li3.appendChild(a3);
		a1.appendChild(span2);
		a3.appendChild(span1);
		span2.appendChild(button1);
		paginate.innerHTML = '';
		paginate.appendChild(li1);
		paginate.appendChild(li2);
		paginate.appendChild(li3);
	} else {
		// Create elements

		const previous = modifiedUrl + product.previous.split("api")[1]
		const next = modifiedUrl + product.next.split("api")[1]

		const li1 = document.createElement('li');
		li1.className = 'gw-pagebtn';
		const a1 = document.createElement('a');
		a1.id = 'page_item_pre';
		a1.className = 'gw-pagenum gw-p-move';
		a1.dataset.page = pre_page;
		const span1 = document.createElement('span');
		const button1 = document.createElement('button');
		button1.id = 'previous-buttons';
		button1.innerText = '이전';
		button1.addEventListener('click', () => pageMove(previous));
		const li2 = document.createElement('li');
		li2.className = 'gw-pagebtn';
		const a2 = document.createElement('a');
		a2.id = 'gw-pagenum';
		a2.innerText = `${page_num} / ${page_count}`;
		const li3 = document.createElement('li');
		li3.className = 'gw-pagebtn';
		const a3 = document.createElement('a');
		a3.id = 'page_item_next';
		a3.className = 'gw-pagenum gw-p-move';
		a3.dataset.page = next_page;
		const span2 = document.createElement('span');
		const button2 = document.createElement('button');
		button2.id = 'next-buttons';
		button2.innerText = '다음';
		button2.addEventListener('click', () => pageMove(next));

		// Append elements
		span1.appendChild(button1);
		span2.appendChild(button2);
		paginate.innerHTML = '';
		paginate.appendChild(li1);
		paginate.appendChild(li2);
		paginate.appendChild(li3);
		a1.appendChild(span1);
		a3.appendChild(span2);
		li1.appendChild(a1);
		li2.appendChild(a2);
		li3.appendChild(a3);
	}
	// 페이지 이동했으니 다시 다음페이지 게시글 로드하기
	viewProductslist(product);
}

// 카테고리 조회 
export async function getCategoryView() {
	const response = await fetch(`${BACK_BASE_URL}/api/products/categories/`, {
		method: "GET",
	});
	return response.json();
}

// 장바구니 담기
export async function addToCartAPI(product, amount) {
	const response = await fetch(`${BACK_BASE_URL}/api/users/carts/`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			"Authorization": `Bearer ${access_token}`
		},
		body: JSON.stringify({
			product: product,
			amount: amount
		})
	})
	if (response.status == 200) {
		const toastElement = document.getElementById("toast");
		toastElement.style.display = "block";
		setTimeout(() => {
			toastElement.style.display = "none";
		}, 2000);
	}
}

// 상품 좋아요
export async function addToLikeAPI(productId) {
	const response = await fetch(`${BACK_BASE_URL}/api/users/wish/${productId}/`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			"Authorization": `Bearer ${access_token}`
		},
	})
	return response
}

// 리뷰 좋아요
export async function reviewLikeAPI(review_id) {
	const response = await fetch(`${BACK_BASE_URL}/api/users/review/${review_id}/`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			"Authorization": `Bearer ${access_token}`
		},
	})
	return response
}

// 상품 검색
export async function searchProductAPI(keyword) {
	const response = await fetch(`${BACK_BASE_URL}/api/products/?search=${keyword}`, {
		method: "GET",
	});
	if (!keyword) {
		alert("상품이 존재하지 않습니다ㅠㅠ");
		window.location.reload();
	}
	return response.json();
}

// 판매자 팔로우하기
export async function sellerFollowAPI(user_id) {
	const response = await fetch(`${BACK_BASE_URL}/api/users/follow/${user_id}/`, {
		headers: {
			"Authorization": `Bearer ${access_token}`,
		},
		method: "POST",
	});
	return response
}


// 주문상태 변경 api
export async function changebillstatus(id, status) {
	const response = await fetch(`${BACK_BASE_URL}/api/users/orders/status/${id}/`, {
		headers: {
			'Content-Type': 'application/json',
			"Authorization": `Bearer ${access_token}`,
		},
		method: "PATCH",
		body: JSON.stringify({
			"order_status": status,
		})
	});
	return response
}

// 상품의 내 리뷰 조회
export async function checkoutmyreview(product_id) {
	const response = await fetch(`${BACK_BASE_URL}/api/products/mypage/${product_id}/reviews/`, {
		headers: {
			"Authorization": `Bearer ${access_token}`,
		},
		method: "GET",
	});
	return response
}

export async function kakaoLoginAPI() {
	// 카카오 로그인

	// 백엔드 서버로부터 kakao API 반환
	const response = await fetch(`${BACK_BASE_URL}/api/users/kakao/login/`, { method: 'GET' })
	const kakao_id = await response.json()
	// Resource server와 약속된 REDIRECT URI 설정
	const redirect_uri = REDIRECT_URI
	// 요청할 데이터 설정
	const scope = 'profile_nickname,profile_image,account_email'
	// 사용자를 Resource Server로 이동
	// Resource Server는 사용자를 Redirect URI로 안내
	window.location.href = `https://kauth.kakao.com/oauth/authorize?client_id=${kakao_id}&redirect_uri=${redirect_uri}&response_type=code&scope=${scope}`
}

export async function googleLoginAPI() {
	const response = await fetch(`${BACK_BASE_URL}/api/users/google/login/`, { method: 'GET' })
	const google_id = await response.json()
	const redirect_uri = REDIRECT_URI
	const scope = 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile'
	const param = `scope=${scope}&include_granted_scopes=true&response_type=token&state=pass-through value&prompt=consent&client_id=${google_id}&redirect_uri=${redirect_uri}`
	window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${param}`
}

export async function naverLoginAPI() {
	const response = await fetch(`${BACK_BASE_URL}/api/users/naver/login/`, { method: 'GET' });
	const naver_id = await response.json();
	const redirect_uri = `${FRONT_BASE_URL}/index.html`;
	const state = new Date().getTime().toString(36);
	window.location.href = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${naver_id}&redirect_uri=${redirect_uri}&state=${state}`;
}

export async function searchWhatAPI(url = null) {
	let apiUrl = ""
	if (url !== null) {
		apiUrl = `${BACK_BASE_URL}/api/products/?${url}`
	} else {
		apiUrl = `${BACK_BASE_URL}/api/products/`
	}
	const response = await fetch(apiUrl, {
		method: "GET",
	});
	return response.json();
}

export const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
export const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))


export async function getSellerInformationListAPI() {
	// 관리자 권한으로 판매 승인 대기 내역 가져오기
	const response = await fetch(`${BACK_BASE_URL}/api/users/get/seller/list/`, {
		headers: {
			"Authorization": `Bearer ${access_token}`,
		},
		method: "GET",
	});
	return response
}

export async function refusalOfSalesActivityAPI(information) {
	// 관리자 권한으로 판매 활동 거절
	const response = await fetch(`${BACK_BASE_URL}/api/users/seller/permissions/${information.seller_id}/`, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json',
			"Authorization": `Bearer ${access_token}`
		},
		body: JSON.stringify({
			msg: information.msg
		})
	});
	return response
}

export async function salesActivityApprovalAPI(seller_id) {
	// 관리자 권한으로 판매 활동 승인

	const response = await fetch(`${BACK_BASE_URL}/api/users/seller/permissions/${seller_id}/`, {
		headers: {
			"Authorization": `Bearer ${access_token}`,
		},
		method: "PATCH",
	});
	return response
}

export async function checkPasswordAPI(id, password) {
	//채팅방 비밀번호 확인하기
	const response = await fetch(`${BACK_BASE_URL}/chat/room/${id}/${password}/`, {
		headers: {
			"Authorization": `Bearer ${access_token}`,
		},
	})
	return response.status
}