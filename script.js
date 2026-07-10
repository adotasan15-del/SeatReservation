const WEB_APP_URL =
"https://script.google.com/macros/s/AKfycby0oWfLcUiE53QBwBkM-QFEconnHKs1l7yB_rTYUspXoPxUoqvaFriOwmkpBMnxXNul6w/exec";


let selectedSeat = null;


// 좌석 위치
const seats = [

    {num:1,x:25,y:120},
    {num:2,x:25,y:210},
    {num:3,x:25,y:300},
    {num:4,x:25,y:390},
    {num:5,x:25,y:480},
    {num:6,x:25,y:570},
    {num:7,x:25,y:660},

    {num:8,x:260,y:120},
    {num:9,x:260,y:215},
    {num:10,x:260,y:310},
    {num:11,x:260,y:405},
    {num:12,x:260,y:500},
    {num:13,x:260,y:595},
    {num:14,x:260,y:690},

    {num:15,x:420,y:120},
    {num:16,x:420,y:215},
    {num:17,x:420,y:310},
    {num:18,x:420,y:405},
    {num:19,x:420,y:500},
    {num:20,x:420,y:595},
    {num:21,x:420,y:690},

    {num:22,x:720,y:120},
    {num:23,x:720,y:215},
    {num:24,x:720,y:310},
    {num:25,x:720,y:405},
    {num:26,x:720,y:500},
    {num:27,x:720,y:595},
    {num:28,x:720,y:690},

    {num:29,x:860,y:120},
    {num:30,x:860,y:215},
    {num:31,x:860,y:310},
    {num:32,x:860,y:405},
    {num:33,x:860,y:500},
    {num:34,x:860,y:595},
    {num:35,x:860,y:690},

    {num:36,x:1160,y:120},
    {num:37,x:1160,y:210},
    {num:38,x:1160,y:300},
    {num:39,x:1160,y:390},
    {num:40,x:1160,y:480},
    {num:41,x:1160,y:570},
    {num:42,x:1160,y:660},
    {num:43,x:1160,y:680}

];



const layer = document.getElementById("seatLayer");


// 좌석 생성

seats.forEach(seat => {

    let btn = document.createElement("button");

    btn.className = "seat";

    btn.dataset.seat = seat.num;


    btn.style.left = seat.x + "px";
    btn.style.top = seat.y + "px";


    btn.onclick = function(){


        if(btn.classList.contains("reserved")){
            return;
        }


        document.querySelectorAll(".seat")
        .forEach(s=>{
            s.classList.remove("selected");
        });


        btn.classList.add("selected");


        selectedSeat = seat.num;


        console.log(
            "선택 좌석:",
            selectedSeat
        );

    };


    layer.appendChild(btn);

});





// 예약 버튼

function reserve(){


    let name =
    document.getElementById("name").value;



    if(name.trim() === ""){

        alert("이름을 입력해주세요.");

        return;

    }



    if(selectedSeat === null){

        alert("좌석을 선택해주세요.");

        return;

    }



    let btn =
    document.querySelector(
        `[data-seat="${selectedSeat}"]`
    );



    btn.classList.remove("selected");

    btn.classList.add("reserved");



    document.getElementById("result")
    .innerHTML =
    `${name}님 ${selectedSeat}번 좌석 예약 완료`;



    // Google Sheet 저장

    fetch(WEB_APP_URL, {

        method:"POST",

        body:JSON.stringify({

            name:name,

            seat:selectedSeat

        })

    })
    .then(response => response.text())
    .then(result => {

        console.log(
            "시트 저장 결과:",
            result
        );

    })
    .catch(error => {

        console.error(
            "저장 오류:",
            error
        );

    });



    // 초기화

    selectedSeat = null;

    document.getElementById("name").value = "";

}