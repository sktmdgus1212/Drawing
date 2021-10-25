const canvas = document.getElementById("jsCanvas");
const ctx = canvas.getContext("2d");
const cte = canvas.getContext("2d");
const colors = document.getElementsByClassName("jsColor");
const range = document.getElementById("jsRange");
const mode = document.getElementById("jsMode");
const saveBtn = document.getElementById("jsSave");
const eraser = document.getElementById("jsEraser");
const xy = [];
const INTITAL_COLOR = "#2c2c2c";
const webSocket = new WebSocket("ws://192.168.0.23:30001/websocket");
canvas.width = document.getElementsByClassName("canvas")[0].offsetWidth;
canvas.height = document.getElementsByClassName("canvas")[0].offsetHeight;

ctx.fillStyle = "white";
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.fillStyle = INTITAL_COLOR;
ctx.strokeStyle = INTITAL_COLOR;
ctx.lineWidth = 2.5;

let painting = false;
let filling = false;
let erasering = false;

function stopPainting(event){
  painting = false;
}

function startPainting(event){
  painting = true;
}

function onMouseMove(event){
  //console.log(event);
  const x= event.offsetX;
  const y= event.offsetY;
  xy[0] = x;
  xy[1] = y;
  if(!painting){
    ctx.beginPath();
    ctx.moveTo(x,y);
  }
  else{
    ctx.lineTo(x, y);
    ctx.stroke();

    if(webSocket.readyState === webSocket.OPEN){
      // 연결 상태 확인
       webSocket.send(`${xy}`);
       console.log(`xxxx:` +x, y);
       //console.log(`xy: ${xy}`);
       // 웹소켓 서버에게 메시지 전송
     }
       else{ alert("연결된 웹소켓 서버가 없습니다.");
     }
  }

}

function handleColorClick(event){
    //console.log(event.target.style);
    const color = event.target.style.backgroundColor;
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
}

function handleRangeChange(event){
  //console.log(event.target.value);
  const size = event.target.value;
  ctx.lineWidth = size;
}

function handleModeClick(){
  if(filling == true){
    filling = false;
    mode.innerText = "Fill";
  }
  else{
    filling = true;
    mode.innerText = "Paint";

  }
}

function handleCanvasClick(){
  if(filling){
      ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}

function handleCM(event){
  event.preventDefault();
}

function handleSaveClick(event){
  const image = canvas.toDataURL("image/png");
  const link = document.createElement("a");
  link.href = image;
  link.download = "Paintjs";
  link.click();
}

function handleeraserbuttonClick(event){
  if(erasering == true){
    erasering = false;
    eraser.innerText = "ERASER";
    console.log(erasering);
  }
  else{
    erasering = true;
    eraser.innerText = "ERASER(ON)";
    console.log(erasering);
  }
}

function handleEraserClick(event){
  let confirm = false;
  if(erasering == true && !confirm){
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    confirm = true;
  }
  if(confirm == true){
    erasering = false;
    eraser.innerText = "ERASER";
  }
}


if(canvas){
  canvas.addEventListener("mousemove", onMouseMove);
  canvas.addEventListener("mousedown", startPainting);
  canvas.addEventListener("mouseup", stopPainting);
  canvas.addEventListener("mouseleave", stopPainting);
  canvas.addEventListener("click", handleCanvasClick);
  canvas.addEventListener("contextmenu", handleCM);
  canvas.addEventListener("click", handleEraserClick);
  canvas.addEventListener("mousemove", websocketmousemove);
}

//console.log(Array.from(colors));
Array.from(colors).forEach(color =>
  color.addEventListener("click", handleColorClick)
);

if(range){
    range.addEventListener("input", handleRangeChange);
}

if(mode){
  mode.addEventListener("click", handleModeClick);
}

if(saveBtn){
    saveBtn.addEventListener("click", handleSaveClick);
}

if(eraser){
  eraser.addEventListener("click", handleeraserbuttonClick);
}



webSocket.onopen = ()=>{
  console.log("웹소켓서버와 연결 성공");
};
// 2-2) 메세지 수신 이벤트 처리
webSocket.onmessage = function (event) {
  //console.log(`서버 웹소켓에게 받은 데이터: ${event.data}`);
  const event_xy = event.data.split(",");
  const event_x = event_xy[0];
  const event_y = event_xy[1];

  websocketmousemove(event_x, event_y);
  /*eraser.innerText = event_x;
  console.log(event_x, event_y);
  if(!painting){
    ctx.beginPath();
    ctx.moveTo(event_x,event_y);
  }
  else{
    ctx.lineTo(event_x,event_y);
    ctx.stroke();
      console.log('websocket:'+event_x,event_y);
  }*/
}

function websocketmousemove(x, y){
  btn_send.innerText = count;
  console.log('websocket:'+x,y);
  if(!painting){
    ctx.beginPath();
    ctx.moveTo(x,y);
  }
  else{
    ctx.lineTo(x,y);
    ctx.stroke();

  }
}
// 2-3) 연결 종료 이벤트 처리
webSocket.onclose = function(){
  console.log("서버 웹소켓 연결 종료");
}
// 2-4) 에러 발생 이벤트 처리
webSocket.onerror = function(event){
  console.log(event)
}


let count = 1;
document.getElementById("btn_send").onclick = function(){
  if(webSocket.readyState === webSocket.OPEN){
    // 연결 상태 확인
    webSocket.send(`증가하는 숫자를 보냅니다 => ${count}`);
    // 웹소켓 서버에게 메시지 전송
    count++;
    // 보낼때마다 숫자를 1씩 증가
  }
    else{
      alert("연결된 웹소켓 서버가 없습니다.");
    }
  }
