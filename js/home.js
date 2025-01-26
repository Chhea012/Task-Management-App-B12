const allSideMenu = document.querySelectorAll(
  "#sidebar .side-menu.top li a"
);

allSideMenu.forEach((item) => {
  const li = item.parentElement;

  item.addEventListener("click", function () {
    allSideMenu.forEach((i) => {
      i.parentElement.classList.remove("active");
    });
    li.classList.add("active");
    const page = item.getAttribute("data-page");
    loadPage(page);
  });
});

// TOGGLE SIDEBAR
const menuBar = document.querySelector("#content nav .bx.bx-menu");
const sidebar = document.getElementById("sidebar");
const imglogo = document.querySelector('img');

menuBar.addEventListener("click", function () {
  sidebar.classList.toggle("hide");
  imglogo.classList.toggle("hide");
});

const switchMode = document.getElementById("switch-mode");

switchMode.addEventListener("change", function () {
  if (this.checked) {
    document.body.classList.add("dark");
  } else {
    document.body.classList.remove("dark");
  }
});
// get date
const startDate = document.querySelector(".text-1");
const currentDate = new Date();
const year = currentDate.getFullYear();
const month = currentDate.getMonth() + 1;
const day = currentDate.getDate();
const h3 = document.createElement("h3");
h3.textContent = `${day}/${month}/${year}`;
const paragraph = document.createElement("p");
startDate.appendChild(h3);
paragraph.textContent = "Today";
startDate.appendChild(paragraph);
// sum number

// let allValues = document.querySelectorAll(".value");

// allValues.forEach((singleValue) => {
//   let startValue = 0;
//   let endValue = parseInt(singleValue.getAttribute("data-value"));
//   let duration = Math.floor(2000 / endValue);

//   let counter = setInterval(function () {
//     startValue += 1;
//     singleValue.textContent = startValue;

//     if (startValue == endValue) {
//       clearInterval(counter);
//     }
//   }, duration);
// });
// Task statistics summary: Completed vs Pending Tasks

// Task statistics summary: Completed vs Pending Tasks

