import {
    // 백엔드 URL import
    BACK_BASE_URL,
    // 프론트 URL import
    FRONT_BASE_URL,
    // 사용자 정보 불러오기 API
    getUserInformationAPI,
    // 사용자 프로필 정보 수정 API
    updateProfileInformationAPI,
    // 사용자 상세 정보 수정 API
    updateUserInformationAPI,
    // 사용자 배송지 정보 추가 API
    addressSubmitAPI,
    // 사용자 배송지 정보 수정
    addressUpdateAPI,
    // 사용자 배송지 정보 삭제
    addressDeleteAPI,
    // 판매자 정보 생성 (권한 신청)
    createSellerInformationAPI,
    // 판매자 정보 수정
    updateSellerInformationAPI,
    // 판매자 정보 삭제
    deleteSellerInformationAPI,
    // 휴면 계정으로 전환
    deleteUserInformationAPI,
    // 통관 번호 수정
    setCustomsCodeAPI,
    // 휴대폰 번호 등록과 수정  및 인증번호 발급
    getAuthNumberAPI,
    // 휴대폰 인증 번호 제출
    submitVerificationNumbersAPI,
    // 이메일 정보 수정
    getEmailVerificationCodeAPI,
    // 변경 이메일 인증 코드 발급
    submitChangeEamilInformationAPI,
} from './api.js'
import { handleLogout } from './loader.js'

async function getPayloadParse() {
    const payload = localStorage.getItem("payload");
    const payload_parse = JSON.parse(payload)
    return payload_parse
}

export async function updateInformation() {
    // 이메일, 비밀번호 변경
    const password = document.getElementById("password").value
    const newPassword = document.getElementById("newPassword").value
    const newPassword2 = document.getElementById("newPassword2").value

    const setUserInformationMessageBox = document.getElementById("setUserInformationMessageBox")
    setUserInformationMessageBox.style.display = "flex"
    if (password == '' || newPassword == '' || newPassword2 == '') {
        // 입력값이 비어 있는 경우
        setUserInformationMessageBox.innerText = "빈칸 없이 입력해 주세요."
    } else if (newPassword != newPassword2) {
        // 변경하고자 하는 두 비밀번호의 입력값이 다를 경우
        setUserInformationMessageBox.innerText = "입력하신 두 비밀번호가 같지 않습니다."
    } else {
        // 전달할 데이터 준비
        const information = {
            password: password,
            new_password: newPassword
        };

        // API 응답
        const response = await updateUserInformationAPI(information)
        //  응답에 따른 프론트 처리
        if (response.status == 200) {
            handleLogout()
            window.location.replace(`${FRONT_BASE_URL}/login.html`)
        } else {
            const response_json = await response.json()
            setUserInformationMessageBox.innerText = response_json.non_field_errors
        }
    }
}


export async function updateProfileInformation() {
    // 사용자 프로필 정보 수정
    const nickName = document.getElementById("nickName").value
    const bio = document.getElementById("bio").value
    const profile_image = document.getElementById("profileImageFile").files[0]
    const information = {
        nickName: nickName,
        bio: bio,
        profile_image: profile_image
    };
    const response = await updateProfileInformationAPI(information)
    const profileMessageBox = document.getElementById("profileMessageBox")
    profileMessageBox.style.display = "flex"
    if (response.status == 200) {
        location.reload();
    } else if (response.status == 404) {
        // 사용자 정보를 찾을 수 없음
        window.location.replace(`${FRONT_BASE_URL}/login.html`)
    } else if (response.status == 400) {
        // 입력 양식이 잘 못됨
        profileMessageBox.innerText = "닉네임이 올바르지 않습니다. 공백없이 2~20자 내외로 작성해 주세요."
    }
}



export async function addressSubmit() {
    // 배송 정보 추가
    const payload_parse = await getPayloadParse()
    const recipient = document.getElementById("recipient").value
    const postcode = document.getElementById("postcode").value
    const address = document.getElementById("address").value
    const detailAddress = document.getElementById("detailAddress").value
    const information = {
        user_id: payload_parse.user_id,
        recipient: recipient,
        postcode: postcode,
        address: address,
        detailAddress: detailAddress
    };

    const response = await addressSubmitAPI(information)
    if (response.status == 200) {
        // 배송 정보 등록 완료
        location.reload();
    } else {
        const addressMessageBox = document.getElementById("addressMessageBox")
        addressMessageBox.style.display = "flex"
        if (response.status == 404) {
            // 사용자 정보를 찾을 수 없음 (로그인 필요)
            window.location.replace(`${FRONT_BASE_URL}/login.html`)
        } else if (response.status == 401) {
            // 로그인을 하지 않았거나, 올바르지 않은 접근 방법
            window.location.replace(`${FRONT_BASE_URL}/login.html`)
        } else if (response.status == 402) {
            addressMessageBox.innerText = "핸드폰 정보를 먼저 등록해 주세요."
        } else if (response.status == 400) {
            addressMessageBox.innerText = "배송 정보는 다섯개 까지 등록할 수 있습니다."
        } else {
            addressMessageBox.innerText = "배송 정보가 올바르지 않습니다."
        }

    }
}
export async function addressUpdate() {
    // 배송 정보 수정
    const delivery_id = document.getElementById("delivery_id").value
    const recipient = document.getElementById("recipient").value
    const postcode = document.getElementById("postcode").value
    const address = document.getElementById("address").value
    const detailAddress = document.getElementById("detailAddress").value
    const information = {
        recipient: recipient,
        postcode: postcode,
        address: address,
        detailAddress: detailAddress,
        delivery_id: delivery_id
    };

    const response = await addressUpdateAPI(information)
    const response_json = await response.json()
    if (response.status == 200) {
        // 배송 정보 수정 완료
        location.reload();
    } else {
        const addressMessageBox = document.getElementById("addressMessageBox")
        addressMessageBox.style.display = "flex"
        if (response.status == 404) {
            addressMessageBox.innerText = "배송 정보를 찾을 수 없습니다."
        } else if (response.status == 401) {
            // 로그인을 하지 않았거나 올바르지 않은 접근 방법
            window.location.replace(`${FRONT_BASE_URL}/login.html`)
        } else if (response.status == 400) {
            addressMessageBox.innerText = "입력값이 올바르지 않습니다."
        } else {
            // 반례
            console.log(response)
        }
    }
}
export async function addressDelete() {
    // 배송 정보 삭제
    const delivery_id = document.getElementById("delivery_id").value
    const response = await addressDeleteAPI(delivery_id)

    // API 응답 처리
    if (response.status == 204) {
        // 배송 정보 삭제 완료
        location.reload();
    } else {
        const addressMessageBox = document.getElementById("addressMessageBox")
        addressMessageBox.style.display = "flex"
        if (response.status == 404) {
            addressMessageBox.innerText = "배송 정보를 찾을 수 없습니다."
        } else if (response.status == 401) {
            // 로그인을 하지 않았거나 올바르지 않은 접근 방법
            window.location.replace(`${FRONT_BASE_URL}/login.html`)
        } else {
            console.log(response)
        }
    }
}

async function getSellerInputData() {
    // 입력값 불러오기
    const profile_image = document.getElementById("profileImageFile").files[0]
    const img = document.getElementById("sellerImageFile").files[0]
    const information = {
        company_img: img,
        business_owner_name: document.getElementById("business_owner_name").value,
        company_name: document.getElementById("company_name").value,
        contact_number: document.getElementById("contact_number").value,
        business_number: document.getElementById("business_number").value,
        bank_name: document.getElementById("bank_name").value,
        account_holder: document.getElementById("account_holder").value,
        account_number: document.getElementById("account_number").value,
    };
    return information
}

export async function createSellerInformation() {
    // 판매자 정보 생성 및 권한 신청
    const information = await getSellerInputData()

    // 판매자 정보 생성 (권한 신청) API
    const response = await createSellerInformationAPI(information)

    // 알림 메시지 출력
    const sellerMessageBox = document.getElementById("sellerMessageBox")
    sellerMessageBox.style.display = "flex"

    // API 응답 처리
    if (response.status == 200) {
        sellerMessageBox.innerText = "판매자 권한을 신청했습니다. 관리자 검증 후 판매 활동을 할 수 있습니다."
        document.getElementById("createSellerInformationButton").style.display = "block"
    } else if (response.status == 404) {
        // 로그인 필요
        window.location.replace(`${FRONT_BASE_URL}/login.html`)
    } else if (response.status == 401) {
        // 로그인 필요
        window.location.replace(`${FRONT_BASE_URL}/login.html`)
    } else if (response.status == 422) {
        sellerMessageBox.innerText = "입력값에 오류가 있습니다. 너무 긴 입력값은 없는지 확인해 주세요."
    } else if (response.status == 400) {
        sellerMessageBox.innerText = "이미 판매자 정보가 있습니다."
    }
}

export async function updateSellerInformation() {
    // 판매자 정보 수정
    // 입력값 불러오기
    const information = await getSellerInputData()
    // // // 판매자 정보 수정 API
    const response = await updateSellerInformationAPI(information)

    // 알림 메시지 출력
    const sellerMessageBox = document.getElementById("sellerMessageBox")
    sellerMessageBox.style.display = "flex"

    // API 응답 처리
    if (response.status == 200) {
        location.reload();
    } else if (response.status == 404) {
        // 로그인 필요
        window.location.replace(`${FRONT_BASE_URL}/login.html`)
    } else if (response.status == 401) {
        // 로그인 필요
        window.location.replace(`${FRONT_BASE_URL}/login.html`)
    } else if (response.status == 422) {
        sellerMessageBox.innerText = "입력값에 오류가 있습니다. 너무 긴 입력값은 없는지 확인해 주세요."
    } else if (response.status == 400) {
        sellerMessageBox.innerText = "수정할 판매자 정보가 없습니다."
    }
}

export async function deleteSellerInformation() {
    // 판매자 정보 삭제
    const response = await deleteSellerInformationAPI()

    // 알림 메시지 출력
    const sellerMessageBox = document.getElementById("sellerMessageBox")
    sellerMessageBox.style.display = "flex"

    // API 응답 처리
    if (response.status == 204) {
        // 삭제 완료
        location.reload();
    } else if (response.status == 404) {
        // 로그인 필요
        window.location.replace(`${FRONT_BASE_URL}/login.html`)
    } else if (response.status == 401) {
        // 로그인 필요
        window.location.replace(`${FRONT_BASE_URL}/login.html`)
    } else if (response.status == 400) {
        sellerMessageBox.innerText = "삭제할 판매자 정보가 없습니다."
    }
}




export async function deleteUserInformation() {
    const payload_parse = await getPayloadParse()
    // 사용자 휴면 계정으로 전환
    const response = await deleteUserInformationAPI(payload_parse.user_id)

    // API 응답 처리
    if (response.status == 200) {
        // 처리 완료
        handleLogout()
        alert("휴면 계정으로 전환되었습니다.")
        location.reload();
    } else if (response.status == 400) {
        // 로그인 필요
        alert("로그인이 필요합니다.")
        window.location.replace(`${FRONT_BASE_URL}/login.html`)
    }
}


export async function setCustomsCode() {
    // 통관 번호 수정
    const payload_parse = await getPayloadParse()
    const customs_code = document.getElementById("customsCodeSubmitInput").value
    const information = {
        customs_code: customs_code
    }
    const response = await setCustomsCodeAPI(information)
    const response_json = await response.json()

    if (response.status == 200) {
        // 수정 완료
        location.reload();
    } else if (response.status == 404) {
        // 로그인 필요
        window.location.replace(`${FRONT_BASE_URL}/login.html`)
    } else if (response.status == 400) {
        const addressMessageBox = document.getElementById("addressMessageBox")
        addressMessageBox.style.display = "flex"
        addressMessageBox.innerText = "통관 번호가 올바르지 않습니다."
    }
}

export async function getAuthNumber() {
    // 핸드폰 번호 등록 및 수정, 인증번호 발급 받기
    const phoneNum = document.getElementById("phoneNum")
    const phone_number = phoneNum.value.replace(/-/g, "")
    const phoneMessageBox = document.getElementById("phoneMessageBox")
    const information = {
        phone_number: phone_number
    }
    const response = await getAuthNumberAPI(information)
    const response_json = await response.json()
    if (response.status == 200) {
        phoneMessageBox.style.display = "none"
        document.getElementById("phone_auth_box").style.display = "block"
        document.getElementById("submit_auth_number_button_box").style.display = "block"

    } else {
        phoneMessageBox.style.display = "flex"
        if (response.status == 404) {
            // 로그인 필요
            window.location.replace(`${FRONT_BASE_URL}/login.html`)
        } else {
            const response_json = await response.json()
            phoneMessageBox.innerText = response_json.non_field_errors
        }
    }
}

export async function submitVerificationNumbers() {
    // 휴대폰 인증
    const verification_numbers = document.getElementById("verification_numbers").value
    const information = {
        verification_numbers: verification_numbers
    }
    const response = await submitVerificationNumbersAPI(information)
    if (response.status == 200) {
        // 인증 완료
        location.reload();
    } else {
        const phoneMessageBox = document.getElementById("phoneMessageBox")
        phoneMessageBox.style.display = "flex"
        if (response.status == 404) {
            // 로그인 필요
            window.location.replace(`${FRONT_BASE_URL}/login.html`)
        } else {
            const response_json = await response.json()
            phoneMessageBox.innerText = response_json.err
        }
    }
}



export async function getEmailVerificationCode() {
    // 변경할 이메일로 인증 코드 발급 받기
    const email = document.getElementById("email").value
    const phoneMessageBox = document.getElementById("phoneMessageBox")
    phoneMessageBox.style.display = "flex"
    phoneMessageBox.innerText = "인증 코드를 발급 중 입니다. 잠시만 기다려 주세요."

    const response = await getEmailVerificationCodeAPI(email)
    if (response.status == 200) {
        document.getElementById("verificationCodeBox").style.display = "block"
        document.getElementById("submitChangeEamilInformationBox").style.display = "block"
        phoneMessageBox.innerText = "인증 코드를 발급 했습니다."

    } else {

        if (response.status == 404) {
            // 로그인 필요
            window.location.replace(`${FRONT_BASE_URL}/login.html`)
        } else {
            const response_json = await response.json()
            phoneMessageBox.innerText = response_json.err
        }
    }
}
export async function submitChangeEamilInformation() {
    const email = document.getElementById("email").value
    const verificationCode = document.getElementById("verificationCode").value

    const information = {
        email: email,
        verification_code: verificationCode
    }

    const response = await submitChangeEamilInformationAPI(information)
    if (response.status == 200) {
        // 인증 완료
        location.reload();
    } else {
        const phoneMessageBox = document.getElementById("phoneMessageBox")
        phoneMessageBox.style.display = "flex"
        if (response.status == 404) {
            // 로그인 필요
            window.location.replace(`${FRONT_BASE_URL}/login.html`)
        } else {
            const response_json = await response.json()
            phoneMessageBox.innerText = response_json.non_field_errors
        }
    }
}



////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////
//  정보 불러오기 및 프론트 관련 함수

async function changeView(ElementID) {
    // 화면 초기화
    const nav_items = document.querySelectorAll(".container-nav-item")
    nav_items.forEach((item) => {
        item.style.backgroundColor = "#F8ECE0"
        item.style.color = "black"
    })

    const view_items = document.querySelectorAll(".view-items")
    view_items.forEach((item) => {
        item.style.display = "none"
    })

    const changeNavBox = document.getElementById(ElementID)
    changeNavBox.style.backgroundColor = "#7B4242"
    changeNavBox.style.color = 'white'
}

export async function navItemProfileView() {
    // 프로필 수정 페이지 출력
    changeView("navItemProfile")
    document.getElementById("setProfileView").style.display = "flex"
}
export async function navItemUserInformationView() {
    // 유저 정보 수정 페이지 출력
    changeView("navItemUserInformation")
    document.getElementById("setUserInformationView").style.display = "flex"
}
export async function navItemUserDetailInformationView() {
    // 유저 상세 페이지 출력
    changeView("navItemUserDetailInformation")
    document.getElementById("setUserDetailInformation").style.display = "block"
}
export async function navItemUserPhoneNumberView() {
    // 유저 연락처 수정 페이지 출력
    changeView("navItemUserPhoneNumber")
    document.getElementById("setUserPhoneNumberInformation").style.display = "block"
}
export async function navItemSellerInformationView() {
    // 유저 판매자 정보 페이지 출력
    changeView("navItemSellerInformation")
    document.getElementById("setSellerInformation").style.display = "flex"
    // id가 'container'인 요소 선택
    const container = document.getElementById("container");
    // 높이 값 설정 
    container.style.height = "calc(120vh - 50px)";
}

export async function navItemDeleteUserInformationView() {
    // 유저 휴면 계정 전환 페이지 출력
    changeView("navItemDeleteUserInformation")
    document.getElementById("deleteUserInformation").style.display = "block"
}

export function readURL(input) {
    // 사용자가 등록한 프로필 이미지 미리보기 기능 제공
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById('profileView').src = e.target.result;
        };
        reader.readAsDataURL(input.files[0]);
    } else {
        document.getElementById('profileView').src = "/static/images/image_199.png";
    }
}

export function readSellerURL(input) {
    // 사용자가 등록한 프로필 이미지 미리보기 기능 제공
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById('sellerProfileView').src = e.target.result;
        };
        reader.readAsDataURL(input.files[0]);
    } else {
        document.getElementById('sellerProfileView').src = "/static/images/store.gif";
    }
}

export async function foldPostcode() {
    // 주소지 검색 API창
    var element_wrap = document.getElementById('wrap');
    // 우편번호 찾기 찾기 화면을 넣을 element
    element_wrap.style.display = 'none';
    // iframe을 넣은 element를 안보이게 한다.
}

export async function addressSearchAPI() {
    // 주소지 검색 API
    var element_wrap = document.getElementById('wrap');
    // 현재 scroll 위치를 저장해놓는다.
    var currentScroll = Math.max(document.body.scrollTop, document.documentElement.scrollTop);
    new daum.Postcode({
        oncomplete: function (data) {
            // 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.

            // 각 주소의 노출 규칙에 따라 주소를 조합한다.
            // 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
            var addr = ''; // 주소 변수
            var extraAddr = ''; // 참고항목 변수

            //사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
            if (data.userSelectedType === 'R') { // 사용자가 도로명 주소를 선택했을 경우
                addr = data.roadAddress;
            } else { // 사용자가 지번 주소를 선택했을 경우(J)
                addr = data.jibunAddress;
            }

            // 사용자가 선택한 주소가 도로명 타입일때 참고항목을 조합한다.
            if (data.userSelectedType === 'R') {
                // 법정동명이 있을 경우 추가한다. (법정리는 제외)
                // 법정동의 경우 마지막 문자가 "동/로/가"로 끝난다.
                if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
                    extraAddr += data.bname;
                }
                // 건물명이 있고, 공동주택일 경우 추가한다.
                if (data.buildingName !== '' && data.apartment === 'Y') {
                    extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
                }
                // 표시할 참고항목이 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
                if (extraAddr !== '') {
                    extraAddr = ' (' + extraAddr + ')';
                }
                // 조합된 참고항목을 해당 필드에 넣는다.
                document.getElementById("detailAddress").value += extraAddr;

            }

            // 우편번호와 주소 정보를 해당 필드에 넣는다.
            document.getElementById('postcode').value = data.zonecode;
            document.getElementById("address").value = addr;
            // 커서를 상세주소 필드로 이동한다.
            document.getElementById("detailAddress").focus();

            // iframe을 넣은 element를 안보이게 한다.
            // (autoClose:false 기능을 이용한다면, 아래 코드를 제거해야 화면에서 사라지지 않는다.)
            element_wrap.style.display = 'none';

            // 우편번호 찾기 화면이 보이기 이전으로 scroll 위치를 되돌린다.
            document.body.scrollTop = currentScroll;
        },
        // 우편번호 찾기 화면 크기가 조정되었을때 실행할 코드를 작성하는 부분. iframe을 넣은 element의 높이값을 조정한다.
        onresize: function (size) {
            element_wrap.style.height = size.height + 'px';
        },
        width: '100%',
        height: '100%'
    }).embed(element_wrap);

    // iframe을 넣은 element를 보이게 한다.
    element_wrap.style.display = 'block';
}

async function getDeliveryData(delivery_data) {
    // 사용자가 선택한 배송 정보 불러오기
    document.getElementById("recipient").value = delivery_data.recipient
    document.getElementById("postcode").value = delivery_data.postal_code
    document.getElementById("address").value = delivery_data.address
    document.getElementById("detailAddress").value = delivery_data.detail_address
    document.getElementById("delivery_id").value = delivery_data.id

    // 버튼 view 변경

    document.getElementById("addressUpdateButton").style.display = "block"
    document.getElementById("addressDeleteButton").style.display = "block"
    document.getElementById("createAddress").style.display = "block"

    document.getElementById("addressSubmitButton").style.display = "none"
    document.getElementById("addressLoad").style.display = "none"
    document.getElementById("dropdownContent").style.display = "none"

    // 메시지창 초기화
    document.getElementById("addressMessageBox").style.display = "none"
    document.getElementById("addressMessageBox").innerText = ""
}

export async function changeAddressView() {
    // 불러온 주소지 숨기고 새로운 주소지 작성 View 제공
    // 내용 초기화
    document.getElementById("recipient").value = ''
    document.getElementById("postcode").value = ''
    document.getElementById("address").value = ''
    document.getElementById("detailAddress").value = ''
    document.getElementById("delivery_id").value = ''

    //  버튼 View 변경
    document.getElementById("addressLoad").style.display = "block"
    document.getElementById("addressSubmitButton").style.display = "block"
    document.getElementById("createAddress").style.display = "none"
    document.getElementById("addressUpdateButton").style.display = "none"
    document.getElementById("addressDeleteButton").style.display = "none"

    // 메시지창 초기화
    document.getElementById("addressMessageBox").style.display = "none"
    document.getElementById("addressMessageBox").innerText = ""
}

async function DeliveryInformation(response_json) {
    // 드랍 다운 메뉴 설정
    const dropdown_content = document.querySelector(".dropdown-content");
    const deliveries_data = response_json.deliveries_data
    // 드랍 다운 메뉴 아이템 추가
    deliveries_data.forEach((element) => {
        dropdown_content.innerHTML += `
        <p class="dropdown-item" id="delivery_${element.id}" data-hidden-value =${element}>${element.address}</p>
        `
    });

    // // 드랍 다운 메뉴 아이템에 이벤트 리스너 할당
    deliveries_data.forEach((element) => {
        const delivery_information = document.getElementById(`delivery_${element.id}`);
        delivery_information.addEventListener("click", function () {
            getDeliveryData(element);
        });

    })

    document.getElementById("customsCodeSubmitInput").value = response_json.customs_code
}


async function getUserDetailInformation(response_json) {
    // 프로필 정보 기입
    if (response_json.profile_image == null) {
        document.getElementById('profileView').src = "/static/images/image_199.png";
    } else {
        document.getElementById('profileView').setAttribute("src", response_json.profile_image)
    }

    // 프로필 input value 조정
    document.getElementById("nickName").value = response_json.nickname
    document.getElementById("bio").value = response_json.introduction
}

async function getSellerInformation(response_json) {
    const seller_information = response_json.user_seller
    if (seller_information != null) {

        if (seller_information.company_img == null) {

            document.getElementById("sellerProfileView").style.backgroundImage = "url('/static/images/store.gif')";
            // .style.src = "/static/images/store.gif";
        } else {
            document.getElementById("sellerProfileView").style.backgroundImage = `url(${BACK_BASE_URL}${seller_information.company_img})`;
            // .setAttribute("src", response_json.profile_image)
        }

        document.getElementById("navSellerInformation").innerText = "사업자 정보 수정"
        document.getElementById("business_owner_name").value = seller_information.business_owner_name
        document.getElementById("contact_number").value = seller_information.contact_number
        document.getElementById("company_name").value = seller_information.company_name
        document.getElementById("business_number").value = seller_information.business_number
        document.getElementById("account_holder").value = seller_information.account_holder
        document.getElementById("account_number").value = seller_information.account_number
        document.getElementById("bank_name").value = seller_information.bank_name

        // 버튼 활성화 및 비활성화
        document.getElementById("createSellerInformationButton").style.display = "none"
        document.getElementById("updateSellerInformationButton").style.display = "block"
        document.getElementById("deleteSellerInformationButton").style.display = "block"
    }
}



async function getUserInformation() {
    // 사용자의 모든 정보 불러오기
    const response = await getUserInformationAPI()
    const response_json = await response.json()

    if (response_json.phone_number == null) {


        document.getElementById("cellPhoneNumberRegistered").style.display = "none"
    } else {
        document.getElementById("guideContainer").style.display = "none"
    }



    // 사용자의 상세 정보 input value 조정
    getUserDetailInformation(response_json)

    // 주소지 및 통관번호 input value, drop down item value 조정
    DeliveryInformation(response_json)

    // 판매자 정보 불러오기 및 view 조정
    getSellerInformation(response_json)

    if (response_json.login_type != "normal") {
        // 소셜 로그인 계정일 경우
        document.getElementById("navItemUserInformation").style.display = "none"
    }
    if (response_json.phone_number != null) {
        document.getElementById("phoneNum").value = response_json.phone_number
    }
}


export async function setEventListener() {
    // html 요소 이벤트 리스너 추가

    // 네비게이션 액션 
    document.getElementById("navItemProfile").addEventListener("click", navItemProfileView)
    document.getElementById("navItemUserInformation").addEventListener("click", navItemUserInformationView)
    document.getElementById("navItemUserDetailInformation").addEventListener("click", navItemUserDetailInformationView)
    document.getElementById("navItemUserPhoneNumber").addEventListener("click", navItemUserPhoneNumberView)
    document.getElementById("navItemSellerInformation").addEventListener("click", navItemSellerInformationView)
    document.getElementById("navItemDeleteUserInformation").addEventListener("click", navItemDeleteUserInformationView)

    // 드랍 다운 메뉴
    const dropdownButton = document.querySelector(".dropdown-button");
    const dropdownContent = document.querySelector(".dropdown-content");

    dropdownButton.addEventListener("click", function () {
        dropdownContent.style.display = dropdownContent.style.display === "none" ? "block" : "none";
    });

    const dropdownItems = document.querySelectorAll(".dropdown-content p");
    dropdownItems.forEach(function (item) {
        item.addEventListener("click", function () {
            const dropdownContent = item.closest(".dropdown-content");
            dropdownContent.style.display = "none";
        });
    });
    // 주소지 정보 불러오기 API(우편 번호 검색)
    document.getElementById("Postcode").addEventListener("click", addressSearchAPI)
    document.getElementById("btnFoldWrap").addEventListener("click", foldPostcode)

    // 프로필 이미지 미리보기
    document.getElementById("profileImageFile").addEventListener("change", function (event) { readURL(event.target); });

    document.getElementById("sellerImageFile").addEventListener("change", function (event) { readSellerURL(event.target); });


    // 프로필 정보 수정
    document.getElementById("profileSubmitButton").addEventListener("click", updateProfileInformation)

    // 이메일, 비밀번호 변경
    document.getElementById("userInformationSubmitButton").addEventListener("click", updateInformation)

    // 불러온 배송지 정보 숨기고, 새로운 배송지 작성하기
    document.getElementById("createAddress").addEventListener("click", changeAddressView)

    // 배송지 정보 생성 , 수정 , 삭제 버튼 이벤트 리스너 할당
    document.getElementById("addressSubmitButton").addEventListener("click", addressSubmit)
    document.getElementById("addressUpdateButton").addEventListener("click", addressUpdate)
    document.getElementById("addressDeleteButton").addEventListener("click", addressDelete)

    // 판매자 정보 생성, 수정 , 삭제 버튼 이벤트 리스너 할당
    document.getElementById("createSellerInformationButton").addEventListener("click", createSellerInformation)
    document.getElementById("updateSellerInformationButton").addEventListener("click", updateSellerInformation)
    document.getElementById("deleteSellerInformationButton").addEventListener("click", deleteSellerInformation)

    // 휴면 계정 전환, 이벤트 리스너 할당
    document.getElementById("deleteUserInformationButton").addEventListener("click", deleteUserInformation)

    // 통관번호
    document.getElementById("customsCodeSubmitButton").addEventListener("click", setCustomsCode)

    // 휴대폰 인증 번호 발급 받기
    document.getElementById("getAuthNumber").addEventListener("click", getAuthNumber)
    // 휴대폰 인증 번호 제출
    document.getElementById("submitPhoneNumber").addEventListener("click", submitVerificationNumbers)

    // 변경 이메일 인증 번호 발급 받기
    document.getElementById("getEmailVerificationCode").addEventListener("click", getEmailVerificationCode)
    // 변경 이메일 인증 번호 인증 하기
    document.getElementById("submitChangeEamilInformation").addEventListener("click", submitChangeEamilInformation)
}

var autoHypenPhone = function (str) {
    str = str.replace(/[^0-9]/g, '');
    var tmp = '';
    if (str.length < 4) {
        return str;
    } else if (str.length < 7) {
        tmp += str.substr(0, 3);
        tmp += '-';
        tmp += str.substr(3);
        return tmp;
    } else if (str.length < 11) {
        tmp += str.substr(0, 3);
        tmp += '-';
        tmp += str.substr(3, 3);
        tmp += '-';
        tmp += str.substr(6);
        return tmp;
    } else {
        tmp += str.substr(0, 3);
        tmp += '-';
        tmp += str.substr(3, 4);
        tmp += '-';
        tmp += str.substr(7);
        return tmp;
    }

    return str;
}


var phoneNum = document.getElementById('phoneNum');

phoneNum.onkeyup = function () {
    this.value = autoHypenPhone(this.value);
}

window.onload = async () => {
    setEventListener()
    const payload_parse = await getPayloadParse()
    if (payload_parse == null) {
        window.location.replace(`${FRONT_BASE_URL}/index.html`)
    } else {
        getUserInformation()
    }
}   
