//presets for buttons
let btnLinie = document.getElementById("line");
let btnEclipse = document.getElementById("eclipse");
let btnRectangle = document.getElementById("rectangle");
let colorLinie = document.getElementById("color-line");
let colorBackground = document.getElementById("color-background");
let grosimeLinie = document.getElementById("range-picker");
let btnClear = document.getElementById("clear");
let btnPNG = document.getElementById("save-png");
let btnSVG = document.getElementById("save-svg");
let btnUndo = document.getElementById("undo");

// default false - used for checking which figure is active
let isLinie = false;
let isEclipse = false;
let isRectangle = false;

//canvas + context
let canvas = document.getElementById("canvas");

let blankCanvas = canvas.toDataURL("image/png");

let context = canvas.getContext("2d");

let previous = { prevX: 0, prevY: 0 };
let isMouseDown = false;
obj = canvas.getBoundingClientRect();

// Array undo drawing
const undoArray = [];

//load canvas data
if (localStorage.getItem("canvasKey")) loadCanvasData();

//activate figure
btnLinie.addEventListener("click", () => {
  isEclipse = false;
  isRectangle = false;
  isLinie = true;
});

btnEclipse.addEventListener("click", () => {
  isEclipse = true;
  isRectangle = false;
  isLinie = false;
  console.log(isEclipse);
});

btnRectangle.addEventListener("click", () => {
  isEclipse = false;
  isRectangle = true;
  isLinie = false;
});

//clear canvas
btnClear.addEventListener("click", () => {
  context.clearRect(0, 0, canvas.width, canvas.height);
  localStorage.clear();
});

//save and download png
btnPNG.addEventListener("click", () => {
  const a = document.createElement("a");
  document.body.appendChild(a);
  a.href = canvas.toDataURL();
  a.download = "canvas-image.png";
  a.click();
  document.body.removeChild(a);
});

//save and download png
btnSVG.addEventListener("click", () => {
  const a = document.createElement("a");
  document.body.appendChild(a);
  a.href = canvas.toDataURL("image/svg+xml");
  a.download = "canvas-image.svg";
  a.click();
  document.body.removeChild(a);
});

canvas.addEventListener("mousemove", (e) => {
  if (isLinie) {
    if (isMouseDown) {
      let x = e.pageX - obj.x;
      let y = e.pageY - obj.y;
      // settings for color / width
      context.strokeStyle = colorLinie.value;
      context.lineWidth = grosimeLinie.value;
      context.moveTo(previous.prevX, previous.prevY);
      context.lineTo(x, y);
      context.stroke();
      previous = { x, y };
    }
  }
});

canvas.addEventListener("mousedown", (e) => {
  if (isLinie) {
    let x = e.pageX - obj.x;
    let y = e.pageY - obj.y;
    previous = { x, y };
    isMouseDown = true;
    context.beginPath();
  }
});

canvas.addEventListener("mouseup", (e) => {
  if (isLinie) {
    isMouseDown = false;
    context.beginPath();

    saveCanvasData();
    saveActions();
  }
});

canvas.addEventListener("click", (e) => {
  let x = e.pageX - obj.x;
  let y = e.pageY - obj.y;

  // settings for color / width / fill
  context.fillStyle = colorBackground.value;
  context.strokeStyle = colorLinie.value;
  context.lineWidth = grosimeLinie.value;

  if (isEclipse) {
    context.beginPath();
    context.ellipse(x, y, 70, 50, 0, 0, Math.PI * 2);
    context.fill();
    context.stroke();
    context.closePath();

    saveCanvasData();
    saveActions();
  }
  if (isRectangle) {
    context.beginPath();
    context.rect(x, y, 110, 70);
    context.fill();
    context.stroke();
    context.closePath();

    saveCanvasData();
    saveActions();
  }
});

//saving canvas data to local storage
function saveCanvasData() {
  localStorage.setItem("canvasKey", canvas.toDataURL());
}

//saving all phases of the canvas
function saveActions() {
  if (undoArray.length == 0) {
    undoArray.push(blankCanvas);
    undoArray.push(canvas.toDataURL("image/png"));
  } else {
    undoArray.push(canvas.toDataURL("image/png"));
  }
  console.log(undoArray);
}

//loading canvas data from local storage
function loadCanvasData() {
  let dataURL = localStorage.getItem("canvasKey");

  const img = new Image();

  img.src = dataURL;
  img.onload = () => {
    context.drawImage(img, 0, 0);
  };
}

//undo button - double click first time
btnUndo.addEventListener("click", () => {
  if (undoArray.length > 0) {
    const img1 = new Image();
    let imgAdress = undoArray.pop();
    img1.src = imgAdress;

    img1.onload = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(img1, 0, 0);
      saveCanvasData();
    };
  }
});
