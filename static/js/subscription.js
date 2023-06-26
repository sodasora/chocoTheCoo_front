import {
    BACK_BASE_URL, FRONT_BASE_URL, patchSubscribeView, getSubscribeView, getPointStaticView, postSubscribeView, postPointServiceView
} from "./api.js";

function leftPad(value) {
    if (value < 10) {
        value = "0" + value;
        return value;
    }
    return value;
}

async function gosub() {
    let today = new Date();

    const nowyear = today.getFullYear()
    const nowmonth = leftPad(today.getMonth() + 1)
    const nowdate = leftPad(today.getDate())

    const nowday = nowyear + '-' + nowmonth + '-' + nowdate

    const subscription_data = await getSubscribeView()
    if (subscription_data != "") {
        if (subscription_data["subscribe"] == true) {
            alert("이미 구독한 상태입니다.")
        } else {
            if (subscription_data["next_payment"] < nowday) {
                const response_point_statistic = await getPointStaticView(nowday)
                const response_point_statistic_json = await response_point_statistic.json()

                if (response_point_statistic_json["total_point"] >= 9900) {
                    const response = await postSubscribeView();
                    if (response == 200) {
                        alert("결제완료")
                        window.location.href = 'mypage.html';
                    }
                } else {
                    alert("포인트가 부족합니다. 충전 후 다시 시도해주세요.")
                    window.location.href = 'pointcharge.html'
                }
            } else {
                const response = await patchSubscribeView();
                if (response.status == 200) {
                    window.location.href = 'mypage.html';
                }
            }
        }
    } else {
        const response_point_statistic = await getPointStaticView(nowday)
        const response_point_statistic_json = await response_point_statistic.json()

        if (response_point_statistic_json["total_point"] >= 9900) {
            const response = await postSubscribeView();
            if (response == 200) {
                alert("결제완료")
                window.location.href = 'mypage.html';
            }
        } else {
            alert("포인트가 부족합니다. 충전 후 다시 시도해주세요.")
            window.location.href = 'pointcharge.html'
        }
    }
}

window.onload = async function () {
    document.getElementById("subscriptionbutton").addEventListener("click", gosub)
}