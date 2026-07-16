const WEB_APP_URL =
"https://script.google.com/macros/s/AKfycbxcn_RZzjrHuhlzjnzFv8ofCESQmZonEh71yNrJ6-YPOsCFOHqe4S3HuxjsKifVwTqusg/exec";


let selectedSeat = null;


// 좌석 위치
const seats = [

    {num:1,x:26,y:130},
    {num:2,x:26,y:201},
    {num:3,x:26,y:273},
    {num:4,x:26,y:342},
    {num:5,x:26,y:413},
    {num:6,x:26,y:483},
    {num:7,x:26,y:552},

    {num:14,x:340,y:135},
    {num:13,x:340,y:215},
    {num:12,x:340,y:293},
    {num:11,x:340,y:374},
    {num:10,x:340,y:453},
    {num:9,x:340,y:531},
    {num:8,x:340,y:608},

    {num:21,x:467,y:136},
    {num:20,x:467,y:214},
    {num:19,x:467,y:295},
    {num:18,x:467,y:374},
    {num:17,x:467,y:454},
    {num:16,x:467,y:530},
    {num:15,x:467,y:609},

    {num:28,x:749,y:139},
    {num:27,x:749,y:219},
    {num:26,x:749,y:298},
    {num:25,x:749,y:375},
    {num:24,x:749,y:455},
    {num:23,x:749,y:534},
    {num:22,x:749,y:614},

    {num:35,x:876,y:138},
    {num:34,x:876,y:217},
    {num:33,x:875,y:297},
    {num:32,x:875,y:377},
    {num:31,x:875,y:454},
    {num:30,x:875,y:532},
    {num:29,x:875,y:614},

    {num:43,x:1190,y:133},
    {num:42,x:1190,y:208},
    {num:41,x:1190,y:275},
    {num:40,x:1190,y:347},
    {num:39,x:1190,y:414},
    {num:38,x:1190,y:488},
    {num:37,x:1190,y:557},
    {num:36,x:1190,y:630}

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

// 처음 접속했을 때 예약좌석 표시
loadReservedSeats();


// 1초마다 예약상태 확인
setInterval(() => {

    loadReservedSeats();

}, 1000);



// 페이지 접속 시 예약 좌석 확인

function loadReservedSeats(){

    fetch(WEB_APP_URL)
    
    .then(response => response.json())

    .then(data => {


        console.log("현재 예약 좌석:", data);


        // 모든 좌석 초기화
        document.querySelectorAll(".seat")
        .forEach(btn => {

            btn.classList.remove("reserved");

        });



        // 예약 좌석 표시
        data.forEach(seatNum => {


            let btn = document.querySelector(
                `[data-seat="${seatNum}"]`
            );


            if(btn){

                btn.classList.add("reserved");

            }


        });


    })

    .catch(error=>{

        console.log(
            "불러오기 실패:",
            error
        );

    });

}



// 예약 버튼

function reserve(){


    let name =
    document.getElementById("name").value;



    if(name.trim()===""){

        alert("이름을 입력해주세요.");

        return;

    }



    if(selectedSeat===null){

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

    .then(response=>response.text())

    .then(result=>{


    if(result === "duplicate_name"){

        alert(
            "이미 예약한 이름입니다."
        );

        location.reload();

        return;

    }


    if(result === "duplicate_seat"){

        alert(
            "이미 예약된 좌석입니다."
        );

        location.reload();

        return;

    }


    console.log(
        "저장 결과:",
        result
    );


})


    .catch(error=>{

        console.error(
            "저장 오류:",
            error
        );

    });

 selectedSeat = null;

    document.getElementById("name").value="";

}

// 페이지 접속 즉시 예약 좌석 확인
loadReservedSeats();


// 1초마다 예약 좌석 자동 업데이트
setInterval(() => {

    loadReservedSeats();

},1000);