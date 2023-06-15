import {
    BACK_BASE_URL, FRONT_BASE_URL, getUserProfileAPIView,
    postPointChargeView, postPointCheckoutView, postPointValidationView,
} from "./api.js";

async function payment100() {
    const price = 100;
    requestPay(price);
}

async function payment3000() {
    const price = 3000;
    requestPay(price);
}

async function payment5000() {
    const price = 5000;
    requestPay(price);
}

async function payment10000() {
    const price = 10000;
    requestPay(price);
}

async function payment30000() {
    const price = 30000;
    requestPay(price);
}

async function payment50000() {
    const price = 50000;
    requestPay(price);
}

async function payment100000() {
    const price = 100000;
    requestPay(price);
}

async function ChargeTransaction(price, type) {
    let merchant_id = '';
    const response_checkout = await postPointCheckoutView(price, type)
    if (response_checkout.works) {
        merchant_id = response_checkout.merchant_id
        // console.log("a" + merchant_id)
        return merchant_id
    } else {
        alert("문제가 발생했습니다!! 다시 시도해주세요.")
    }
}

async function ImpTrancsacton(merchant_id, imp_id, amount) {
    const response_validation = await postPointValidationView(merchant_id, imp_id, amount)
    //console.log(response_validation)
    if (response_validation.works) {

    } else {
        alert("문제가 발생했습니다. 다시 시도해주세요.")
    }
}

async function requestPay(price) {
    const userinfo = await getUserProfileAPIView();
    const email = userinfo["email"]
    const name = userinfo["nickname"]

    const IMP = window.IMP;
    IMP.init("imp62841557");

    const merchant_id = await ChargeTransaction(price, 'card')
    // console.log("s" + merchant_id)

    IMP.request_pay({
        pg: 'kcp.INIpayTest',
        pay_method: 'card',
        merchant_uid: merchant_id,
        name: '포인트 충전',
        amount: price,
        buyer_email: email,
        buyer_name: name
    }, function (rsp) { // callback
        if (rsp.success) {
            //console.log(rsp);

            ImpTrancsacton(rsp.merchant_uid, rsp.imp_uid, rsp.paid_amount)

            alert(`${rsp.paid_amount}원 충전완료`)
            window.location.replace(`${FRONT_BASE_URL}/mypage.html`)
        } else {
            alert(rsp.error_msg);
        }
    });
}

window.onload = async function () {
    const pay100 = document.getElementById("100")
    pay100.addEventListener("click", payment100)

    const pay3000 = document.getElementById("3000")
    pay3000.addEventListener("click", payment3000)

    const pay5000 = document.getElementById("5000")
    pay5000.addEventListener("click", payment5000)

    const pay10000 = document.getElementById("10000")
    pay10000.addEventListener("click", payment10000)

    const pay30000 = document.getElementById("30000")
    pay30000.addEventListener("click", payment30000)

    const pay50000 = document.getElementById("50000")
    pay50000.addEventListener("click", payment50000)

    const pay100000 = document.getElementById("100000")
    pay100000.addEventListener("click", payment100000)
}