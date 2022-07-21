const compareResult = document.querySelector(".compare-result");

const form = document.querySelector(".file-input-form");

const submitButton = form.querySelector(".submit-button");
const wrapper1 = form.querySelector(".file-wrapper-1");
const wrapper2 = form.querySelector(".file-wrapper-2");

const file1 = wrapper1.querySelector(".file-1");
const file2 = wrapper2.querySelector(".file-2");

const compareName1 = document.querySelector(".compare-name-1");
const compareName2 = document.querySelector(".compare-name-2");
const compareContent = document.querySelector(".compare-content");

const BG_RED = "bg-red";
const BG_GREEN = "bg-green";

const getColor = (isCorrect) => {
  return isCorrect ? BG_GREEN : BG_RED;
};

const onInputChange = (event) => {
  const curSvg = event.currentTarget.querySelector("svg");
  if (event.target.value) {
    curSvg.classList.remove("text-gray");
    curSvg.classList.add("text-navy");
  } else {
    curSvg.classList.add("text-gray");
    curSvg.classList.remove("text-navy");
  }
};

const onFormSubmit = async (event) => {
  event.preventDefault();

  if (submitButton.classList.contains("compare")) {
    const fileLines1 = await readFile(file1.files[0], compareName1);
    const fileLines2 = await readFile(file2.files[0], compareName2);

    compareFile(fileLines1, fileLines2, compareContent);

    submitButton.classList.remove("compare");
    submitButton.classList.add("delete");
    submitButton.innerText = "Delete";
  } else {
    let lines = document.querySelector(".compare-content-lines");
    lines.parentNode.removeChild(lines);

    submitButton.classList.remove("delete");
    submitButton.classList.add("compare");
    submitButton.innerText = "Compare";

    compareResult.innerText = "";
    compareResult.classList.remove("bg-green", "bg-red");
  }
};

const readFile = (file, fileName) => {
  return new Promise((resolve, reject) => {
    fileName.innerText = file.name;

    const reader = new FileReader();

    reader.onload = async () => {
      const lines = await reader.result.split(/\r\n|\n/);
      const linesWspace = lines.map((item) => {
        return item ? item : " ";
      });
      resolve(linesWspace);
    };

    reader.readAsText(file);
  });
};

const compareFile = (fileLines1, fileLines2, content) => {
  const lendiff = fileLines1.length - fileLines2.length;

  if (lendiff > 0) {
    fileLines2 = fileLines2.concat(new Array(lendiff).fill(""));
  } else if (lendiff < 0) {
    fileLines1 = fileLines1.concat(new Array(-lendiff).fill(""));
  }

  const lines = document.createElement("div");
  lines.classList.add("grid", "compare-content-lines");

  let isSame = true;

  fileLines1.map((_, i) => {
    const isCurSame = fileLines1[i] === fileLines2[i];
    isSame = isSame && isCurSame;

    const lineNum = document.createElement("span");
    const fileLine1 = document.createElement("pre");
    const fileLine2 = document.createElement("pre");

    lineNum.innerText = i;
    fileLine1.innerText = fileLines1[i];
    fileLine2.innerText = fileLines2[i];

    lineNum.classList.add("text-center", "p-1", getColor(isCurSame));
    fileLine1.classList.add("compare-content-element", getColor(isCurSame));
    fileLine2.classList.add("compare-content-element", getColor(isCurSame));

    lines.appendChild(lineNum);
    lines.appendChild(fileLine1);
    lines.appendChild(fileLine2);
  });

  content.appendChild(lines);

  compareResult.innerText = isSame
    ? "Two files are same"
    : "Two files are different";

  compareResult.classList.add(getColor(isSame));
};

form.addEventListener("submit", onFormSubmit);

wrapper1.addEventListener("change", onInputChange);
wrapper2.addEventListener("change", onInputChange);
