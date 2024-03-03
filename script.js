const container = document.querySelector(".container");
let boxes = document.querySelectorAll(".box");
// const img = document.querySelector("img");
const frames = document.querySelectorAll(".frame");
const root = document.querySelector(":root");
let objNumId, targetNumId;
let targets = [];
let lastTargetId, dragged;
let counter = 0;
const containerRect = container.getBoundingClientRect();
const containerStyles = window.getComputedStyle(container);
const box1Rect = boxes[0].getBoundingClientRect();
const box2Rect = boxes[3].getBoundingClientRect();
const box3Rect = boxes[4].getBoundingClientRect();
const box4Rect = boxes[7].getBoundingClientRect();
const boxStyles = window.getComputedStyle(boxes[0]);
// console.log(
//   containerStyles.padding,
//   containerStyles.gap,
//   containerStyles.width,
//   boxStyles.width
// );
const boxesInline = Math.trunc(
  (parseInt(containerStyles.width) - 2 * parseInt(containerStyles.padding)) /
    (parseInt(boxStyles.width) + parseInt(containerStyles.gap))
);
// const vertical = parseInt(boxStyles.height) + parseInt(containerStyles.gap);
// const horizontal =
//   parseInt(containerStyles.width) -
//   parseInt(containerStyles.padding) -
//   parseInt(boxStyles.width);
const vertical = box3Rect.y - box1Rect.y;
const horizontal = box2Rect.x - box1Rect.x;

root.style.setProperty("--up", -vertical + "px");
root.style.setProperty("--down", vertical + "px");
root.style.setProperty("--right", horizontal + "px");
root.style.setProperty("--left", -horizontal + "px");

// console.log(boxesInline, root);
const allowDrop = (e) => {
  e.preventDefault();
  if (!e.target) {
    return;
  }
  targetNumId = +e.target?.closest(".box")?.getAttribute("numId");
  const moved = e.target?.closest(".box")?.getAttribute("moved");
  if (targetNumId === null) {
    return;
  }
  if (objNumId === targetNumId) {
    boxes.forEach((box) => {
      box.className = "box";
      setTimeout(() => {
        box.setAttribute("moved", false);
      }, 500);
    });
    lastTargetId = targetNumId;
  } else if (objNumId < targetNumId) {
    [...boxes].slice(0, objNumId).forEach((box) => {
      box.className = "box";
      setTimeout(() => {
        box.setAttribute("moved", false);
      }, 500);
    });
    if (moved === "false") {
      [...boxes].slice(objNumId + 1, targetNumId + 1).forEach((box, i) => {
        if (+box.getAttribute("numId") % 4 === 0) {
          console.log(box);
          box.className = "box moveupright";
        } else {
          box.className = "box moveleft";
        }
        setTimeout(() => {
          box.setAttribute("moved", true);
        }, 500);
      });
    } else if (moved === "true") {
      const movedBoxes = document.querySelectorAll(".moveleft");
      const movedupright = document.querySelectorAll(".moveupright");
      console.log(targetNumId);
      [...movedBoxes]
        .slice([...movedBoxes].indexOf(targetNumId))
        .forEach((box) => {
          if (box.getAttribute("numId") >= targetNumId) {
            box.className = "box";
            setTimeout(() => {
              box.setAttribute("moved", false);
            }, 500);
          }
        });
      [...movedupright].forEach((box) => {
        if (+box.getAttribute("numId") >= targetNumId) {
          box.className = "box";
          setTimeout(() => {
            box.setAttribute("moved", false);
          }, 500);
        }
      });
    }

    lastTargetId = targetNumId;
  } else if (objNumId > targetNumId) {
    console.log(targetNumId);
    [...boxes].slice(objNumId + 1).forEach((box) => {
      box.className = "box";
      setTimeout(() => {
        box.setAttribute("moved", false);
      }, 500);
    });
    if (moved === "false") {
      [...boxes].slice(targetNumId, objNumId).forEach((box, i) => {
        if (+box.getAttribute("numId") % 4 === 3) {
          box.className = "box movedownleft";
        } else {
          box.className = "box moveright";
        }
        setTimeout(() => {
          box.setAttribute("moved", true);
        }, 500);
      });
    } else if (moved === "true") {
      const movedBoxes = document.querySelectorAll(".moveright");
      const moveddownleft = document.querySelectorAll(".movedownleft");

      // console.log(movedBoxes, targetNumId);
      console.log(movedBoxes);
      [...movedBoxes].slice(0, targetNumId + 1).forEach((box) => {
        // console.log(box);
        if (box.getAttribute("numId") <= targetNumId) {
          box.className = "box";
          setTimeout(() => {
            box.setAttribute("moved", false);
          }, 500);
        }
      });
      [...moveddownleft].forEach((box) => {
        if (+box.getAttribute("numId") <= targetNumId) {
          box.className = "box";
          setTimeout(() => {
            box.setAttribute("moved", false);
          }, 500);
        }
      });
    }
    lastTargetId = targetNumId;
  }
};

const drag = (e) => {
  boxes = document.querySelectorAll(".box");
  objNumId = +e.target.getAttribute("numId");
  dragged = e.target;
  e.dataTransfer.setData("text", e.target.id);
  e.target.style.opacity = "0";
};
const drop = (e) => {
  e.preventDefault();
  // console.log(e.target);
  const target = e.target.closest(".frame");
  targetNumId = +target.querySelector(".box").getAttribute("numId");
  const data = e.dataTransfer.getData("text");
  const obj = document.getElementById(data);
  obj.style.opacity = "1";
  target.appendChild(obj);
  obj.setAttribute("numId", `${targetNumId}`);
  boxes.forEach((box) => {
    box.className = "box";
    box.setAttribute("moved", false);
  });
};

const reArrange = () => {
  if (objNumId < targetNumId) {
    [...boxes].slice(objNumId + 1, targetNumId + 1).forEach((box, i) => {
      console.log(objNumId, targetNumId);
      frames[objNumId + i].appendChild(box);
      box.setAttribute("numId", `${objNumId + i}`);
    });
  } else if (objNumId > targetNumId) {
    [...boxes].slice(targetNumId, objNumId).forEach((box, i) => {
      if (!frames[targetNumId + i]) {
        return;
      }
      frames[targetNumId + i + 1].appendChild(box);
      box.setAttribute("numId", `${targetNumId + i + 1}`);
    });
  }
  boxes.forEach((box) => {
    box.className = "box";
    box.setAttribute("moved", false);
    box.style.opacity = "1";
  });
};

boxes.forEach((box, i) => {
  box.setAttribute("draggable", "true");
  box.addEventListener("dragstart", drag);
  box.addEventListener("dragend", (e) => {
    box.style.opacity = "1";
    boxes.forEach((box) => {
      box.className = "box";
      box.setAttribute("moved", false);
    });
  });
});
// img.addEventListener("dragstart", drag);
frames.forEach((frame, i) => {
  frame.addEventListener("dragover", allowDrop);
  frame.addEventListener("drop", (e) => {
    drop(e);
    reArrange();
    boxes = document.querySelectorAll(".box");
    objNumId = undefined;
    targetNumId = undefined;
  });
  // frame.addEventListener("dragleave", (e) => {
  //   lastTarget = e.target.querySelector(".box");
  //   console.log(lastTarget);
  // });
});
