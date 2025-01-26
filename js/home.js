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
const logo= document.querySelector("img");

menuBar.addEventListener("click", function () {
  sidebar.classList.toggle("hide");
  logo.classList.toggle("hide");
});

const searchButton = document.querySelector(
  "#content nav form .form-input button"
);
const searchButtonIcon = document.querySelector(
  "#content nav form .form-input button .bx"
);
const searchForm = document.querySelector("#content nav form");

searchButton.addEventListener("click", function (e) {
  if (window.innerWidth < 576) {
    e.preventDefault();
    searchForm.classList.toggle("show");
    if (searchForm.classList.contains("show")) {
      searchButtonIcon.classList.replace("bx-search", "bx-x");
    } else {
      searchButtonIcon.classList.replace("bx-x", "bx-search");
    }
  }
});

if (window.innerWidth < 768) {
  sidebar.classList.add("hide");
} else if (window.innerWidth > 576) {
  searchButtonIcon.classList.replace("bx-x", "bx-search");
  searchForm.classList.remove("show");
}

window.addEventListener("resize", function () {
  if (this.innerWidth > 576) {
    searchButtonIcon.classList.replace("bx-x", "bx-search");
    searchForm.classList.remove("show");
  }
});

const switchMode = document.getElementById("switch-mode");

switchMode.addEventListener("change", function () {
  if (this.checked) {
    document.body.classList.add("dark");
  } else {
    document.body.classList.remove("dark");
  }
});
<<<<<<< HEAD
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
=======
function confirmLogout() {
  Swal.fire({
    title: 'Are you sure?',
    text: "You will log out to back page.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, Logout!',
    cancelButtonText: 'Cancel'
  }).then((result) => {
    if (result.isConfirmed) {
      // Redirect to ../index.html
      window.location.href = '../index.html';
    }
  });
}



>>>>>>> 51e7bb5087678bf93c8c0966034747880a6b494b

