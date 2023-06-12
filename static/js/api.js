export const FRONT_BASE_URL = "http://127.0.0.1:5500"
export const BACK_BASE_URL = "http://127.0.0.1:8000"

// 삭제예정
// 로그인
export async function handleLogin() {
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
			"Authorization": "Bearer " + localStorage.getItem("access")
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
			"Authorization": "Bearer " + localStorage.getItem("access")
		},
		method: 'GET',
	})
	return response_point
}

// 출석포인트
export async function getPointAttendanceView(day) {
	const response_point = await fetch(`${BACK_BASE_URL}/api/users/attendance/`, {
		headers: {
			'content-type': 'application/json',
			"Authorization": "Bearer " + localStorage.getItem("access")
		},
		method: 'GET',
	})
	return response_point
}

export async function postPointAttendanceView() {
	const response_point = await fetch(`${BACK_BASE_URL}/api/users/attendance/`, {
		headers: {
			'content-type': 'application/json',
			"Authorization": "Bearer " + localStorage.getItem("access")
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
			"Authorization": "Bearer " + localStorage.getItem("access")
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
			"Authorization": "Bearer " + localStorage.getItem("access")
		},
		method: 'POST',
	})
	return response_point;
}

// 프로필 정보 가져오기
export async function getUserProfileAPIView() {
	const payload = localStorage.getItem("payload");
	const payload_parse = JSON.parse(payload)
	const user_id = payload_parse.user_id
	const response_data = await fetch(`${BACK_BASE_URL}/api/users/profile/${user_id}/`, {
		headers: {
			'content-type': 'application/json',
			"Authorization": "Bearer " + localStorage.getItem("access")
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
			"Authorization": "Bearer " + localStorage.getItem("access")
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
			"Authorization": "Bearer " + localStorage.getItem("access")
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
			"Authorization": "Bearer " + localStorage.getItem("access")
		},
		method: 'POST',
	})
	return response_data.status;
}