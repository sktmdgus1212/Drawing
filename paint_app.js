const canvas = document.getElementById("jsCanvas");
const ctx = canvas.getContext("2d");
const cte = canvas.getContext("2d");;
const colors = document.getElementsByClassName("jsColor");
const range = document.getElementById("jsRange");
const mode = document.getElementById("jsMode");
const saveBtn = document.getElementById("jsSave");
const eraser = document.getElementById("jsEraser");

const INTITAL_COLOR = "#2c2c2c";
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
//  console.log(x, y);
  if(!painting){
    ctx.beginPath();
    ctx.moveTo(x,y);
  }
  else{
    ctx.lineTo(x, y);
    ctx.stroke();
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
