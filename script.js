const WEB_APP_URL =
"https://script.google.com/macros/s/AKfycbwFPTH7PMmPC1MqjwpaZnUWYudjOnkCvKF4J89ptJvD0UUzRJmUqOL4mgyCerRdYd8mzQ/exec";


let selectedSeat = null;


// 좌석 위치
const seats = [

    {num:1,x:26,y:120},
    {num:2,x:26,y:191},
    {num:3,x:26,y:263},
    {num:4,x:26,y:332},
    {num:5,x:26,y:403},
    {num:6,x:26,y:473},
    {num:7,x:26,y:542},

    {num:8,x:340,y:125},
    {num:9,x:340,y:205},
    {num:10,x:340,y:283},
    {num:11,x:340,y:364},
    {num:12,x:340,y:443},
    {num:13,x:340,y:521},
    {num:14,x:340,y:598},

    {num:15,x:467,y:126},
    {num:16,x:467,y:204},
    {num:17,x:467,y:285},
    {num:18,x:467,y:364},
    {num:19,x:467,y:444},
    {num:20,x:467,y:520},
    {num:21,x:467,y:599},

    {num:22,x:749,y:129},
    {num:23,x:749,y:209},
    {num:24,x:749,y:288},
    {num:25,x:749,y:365},
    {num:26,x:749,y:445},
    {num:27,x:749,y:524},
    {num:28,x:749,y:604},

    {num:29,x:876,y:128},
    {num:30,x:876,y:207},
    {num:31,x:875,y:287},
    {num:32,x:875,y:367},
    {num:33,x:875,y:444},
    {num:34,x:875,y:522},
    {num:35,x:875,y:604},

    {num:36,x:1190,y:120},
    {num:37,x:1190,y:198},
    {num:38,x:1190,y:265},
    {num:39,x:1190,y:337},
    {num:40,x:1190,y:404},
    {num:41,x:1190,y:478},
    {num:42,x:1190,y:547},
    {num:43,x:1190,y:620}

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



// 페이지 접속 시 예약 좌석 확인

loadReservedSeats();

// 1초마다 예약 상태 확인
setInterval(loadReservedSeats, 1000);

// 예약 좌석 불러오기

function loadReservedSeats(){


    fetch(WEB_APP_URL)


    .then(response => response.json())


    .then(data => {


        console.log(
            "예약 좌석:",
            data
        );


        data.forEach(seatNum=>{


            let btn =
            document.querySelector(
                `[data-seat="${seatNum}"]`
            );


            if(btn){

                btn.classList.add("reserved");

            }


        });


    })


    .catch(error=>{

        console.error(
            "예약 불러오기 오류:",
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