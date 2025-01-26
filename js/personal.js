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

const alertMessage = document.querySelector(".alert");
const noneInputsContainer = document.querySelector(".none-inputs");

const addTask = document.getElementById("addTask");
const clearAllButton = document.querySelector(".clear-btn");

const dateInput = document.getElementById("taskDueDate");
const addTaskName = document.getElementById("taskName");

const allTasksButton = document.getElementById("allTasks");
const activeTasksButton = document.getElementById("activeTasks");
const completedTasksButton = document.getElementById("completedTasks");

const taskList = document.getElementById("tasksListing");
const tableRows = taskList.getElementsByTagName("tr");
addTask.addEventListener("click", () => {
  if (validateTaskInput()) {
    addTaskToTable();
    noneInputsContainer.style.display = "block";
  } else {
    alertMessage.classList.remove("d-none");
    setTimeout(() => {
      alertMessage.classList.add("d-none");
    }, 2500);
  }
});

// Event listener for clearing all tasks
clearAllButton.addEventListener("click", () => {
  clearAllTasks();
});

let taskName;
let dueDate;
let priority;
let taskRow;

// Function to validate task input
function validateTaskInput() {
  taskName = addTaskName.value;
  dueDate = dateInput.value;
  priority = document.getElementById("priority").value;
  return taskName.trim() !== "" && dueDate !== "" && priority !== "";
}

// Function to add a task to the table
function addTaskToTable() {
  taskName = addTaskName.value;
  dueDate = dateInput.value;
  priority = document.getElementById("priority").value;

  if (taskName) {
    taskRow = createTaskRow(taskName, dueDate, priority);
    taskList.appendChild(taskRow);
    addTaskName.value = "";
    dateInput.value = "";
    document.getElementById("priority").selectedIndex = 0;

    const isEmpty = taskList.getElementsByTagName("tr").length <= 1;
    clearAllButton.classList.toggle("d-none", isEmpty);
    allTasksButton.click();

    saveTasksToLocalStorage(); // Save tasks to localStorage
  }
}

// Function to create a task row
function createTaskRow(taskName, dueDate, priority) {
  const taskRow = document.createElement("tr");

  const statusCell = document.createElement("td");
  statusCell.textContent = "Active";
  statusCell.style.fontWeight = "bold";

  const taskDescription = document.createElement("td");
  taskDescription.textContent = taskName;

  const priorityCell = document.createElement("td");
  priorityCell.textContent = priority;

  if (priority === "High Priority") {
    priorityCell.style.textDecoration = "underline";
    priorityCell.style.color = "#ff0000";
  } else if (priority === "Low Priority") {
    priorityCell.style.textDecoration = "underline";
    priorityCell.style.color = "#FFD700";
  }

  const dueDateCell = document.createElement("td");
  const formattedDate = new Date(dueDate).toLocaleDateString("en-US", {
    month: "numeric",
    day: "numeric",
    year: "numeric",
  });
  dueDateCell.textContent = formattedDate;

  const editButton = document.createElement("button");
  editButton.innerHTML = '<i class="fa-regular fa-pen-to-square"></i>';
  editButton.addEventListener("click", () => {
    taskDescription.setAttribute("contenteditable", "true");
    taskDescription.focus();
  });

  taskDescription.addEventListener("blur", () => {
    taskDescription.removeAttribute("contenteditable");
    saveTasksToLocalStorage(); // Save tasks to localStorage after editing
  });

  const completeButton = document.createElement("button");
  completeButton.innerHTML = '<i class="fa-solid fa-check"></i>';
  completeButton.addEventListener("click", () => {
    statusCell.textContent = "Completed";
    taskDescription.style.textDecoration = "line-through";
    taskDescription.style.fontWeight = "bold";
    taskDescription.style.color = "green";
    saveTasksToLocalStorage(); // Save tasks to localStorage after completing
  });

  const deleteButton = document.createElement("button");
  deleteButton.innerHTML = '<i class="fa-solid fa-trash"></i>';
  deleteButton.addEventListener("click", () => {
    taskRow.remove();
    const remainingTasks = taskList.getElementsByTagName("tr").length - 1;

    if (remainingTasks === 0) {
      noneInputsContainer.style.display = "none";
      clearAllButton.classList.add("d-none");
    }

    saveTasksToLocalStorage(); // Save tasks to localStorage after deleting
  });

  const actionsCell = document.createElement("td");
  actionsCell.appendChild(editButton);
  actionsCell.appendChild(completeButton);
  actionsCell.appendChild(deleteButton);

  taskRow.appendChild(statusCell);
  taskRow.appendChild(taskDescription);
  taskRow.appendChild(priorityCell);
  taskRow.appendChild(dueDateCell);
  taskRow.appendChild(actionsCell);

  return taskRow;
}

// Function to clear all tasks
function clearAllTasks() {
  const taskList = document.getElementById("tasksListing");
  const tableRows = taskList.getElementsByTagName("tr");

  for (let i = tableRows.length - 1; i > 0; i--) {
    tableRows[i].remove();
  }
  noneInputsContainer.style.display = "none";
  clearAllButton.classList.add("d-none");

  saveTasksToLocalStorage(); // Save tasks to localStorage after clearing
}

// Function to save tasks to localStorage
function saveTasksToLocalStorage() {
  const tasks = [];
  const rows = taskList.getElementsByTagName("tr");

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const task = {
      name: row.cells[1].textContent,
      dueDate: row.cells[3].textContent,
      priority: row.cells[2].textContent,
      status: row.cells[0].textContent,
    };
    tasks.push(task);
  }

  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Function to load tasks from localStorage
function loadTasksFromLocalStorage() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  tasks.forEach((task) => {
    const taskRow = createTaskRow(task.name, task.dueDate, task.priority);
    if (task.status === "Completed") {
      taskRow.cells[0].textContent = "Completed";
      taskRow.cells[1].style.textDecoration = "line-through";
      taskRow.cells[1].style.fontWeight = "bold";
      taskRow.cells[1].style.color = "green";
    }
    taskList.appendChild(taskRow);
  });

  const isEmpty = taskList.getElementsByTagName("tr").length <= 1;
  clearAllButton.classList.toggle("d-none", isEmpty);
}

// Load tasks from localStorage when the page loads
document.addEventListener("DOMContentLoaded", () => {
  loadTasksFromLocalStorage();
});

// Filtering tasks status
allTasksButton.addEventListener("click", () => {
  showAllTasks();
  setActiveSectionButton(allTasksButton);
  clearAllButton.classList.remove("d-none");
});

function showAllTasks() {
  for (let i = 1; i < tableRows.length; i++) {
    tableRows[i].removeAttribute("hidden");
  }
}

activeTasksButton.addEventListener("click", () => {
  showActiveTasks();
  setActiveSectionButton(activeTasksButton);
  clearAllButton.classList.add("d-none");
});

function showActiveTasks() {
  for (let i = 1; i < tableRows.length; i++) {
    if (tableRows[i].querySelector("td").textContent === "Active") {
      tableRows[i].removeAttribute("hidden");
    } else {
      tableRows[i].setAttribute("hidden", "true");
    }
  }
}

completedTasksButton.addEventListener("click", () => {
  showCompletedTasks();
  setActiveSectionButton(completedTasksButton);
  clearAllButton.classList.add("d-none");
});

function showCompletedTasks() {
  for (let i = 1; i < tableRows.length; i++) {
    if (tableRows[i].querySelector("td").textContent === "Completed") {
      tableRows[i].removeAttribute("hidden");
    } else {
      tableRows[i].setAttribute("hidden", "true");
    }
  }
}

function setActiveSectionButton(activeButton) {
  allTasksButton.classList.remove("active-section");
  activeTasksButton.classList.remove("active-section");
  completedTasksButton.classList.remove("active-section");

  activeButton.classList.add("active-section");
}

// Sorting the task's priorities
const sortButton = document.getElementById("sortTasks");
sortButton.addEventListener("click", () => {
  sortTasksByPriority();
});

function sortTasksByPriority() {
  const sortedRows = Array.from(tableRows)
    .slice(1)
    .sort((rowA, rowB) => {
      const priorityA = rowA.querySelector("td:nth-child(3)").textContent;
      const priorityB = rowB.querySelector("td:nth-child(3)").textContent;

      if (priorityA === "High Priority" && priorityB === "Low Priority") {
        return -1;
      } else if (
        priorityA === "Low Priority" &&
        priorityB === "High Priority"
      ) {
        return 1;
      } else {
        return 0;
      }
    });

  for (let i = 1; i < tableRows.length; i++) {
    tableRows[i].remove();
  }

  sortedRows.forEach((row) => {
    taskList.appendChild(row);
  });

  saveTasksToLocalStorage(); // Save tasks to localStorage after sorting
}

// Sorting the task's due dates
const sortButtonByDate = document.getElementById("sortTasksByDate");
sortButtonByDate.addEventListener("click", () => {
  sortTasksByDate();
});

function sortTasksByDate() {
  const sortedRows = Array.from(tableRows)
    .slice(1)
    .sort((rowA, rowB) => {
      const dueDateA = new Date(
        rowA.querySelector("td:nth-child(4)").textContent
      );
      const dueDateB = new Date(
        rowB.querySelector("td:nth-child(4)").textContent
      );

      return dueDateA - dueDateB;
    });

  for (let i = 1; i < tableRows.length; i++) {
    tableRows[i].remove();
  }

  sortedRows.forEach((row) => {
    taskList.appendChild(row);
  });

  saveTasksToLocalStorage(); // Save tasks to localStorage after sorting
}
// Add this to include the Chart.js library
// <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

// Define a variable for the chart
let taskStatusChart;

// Function to update the pie chart
function updateTaskStatusChart() {
  const rows = taskList.getElementsByTagName("tr");
  let activeCount = 0;
  let completedCount = 0;

  // Calculate the count of "Active" and "Completed" tasks
  for (let i = 1; i < rows.length; i++) {
    const status = rows[i].cells[0].textContent;
    if (status === "Active") {
      activeCount++;
    } else if (status === "Completed") {
      completedCount++;
    }
  }

  const data = {
    labels: ["Active", "Completed"],
    datasets: [
      {
        data: [activeCount, completedCount],
        backgroundColor: ["#36A2EB", "#4CAF50"], // Colors for "Active" and "Completed"
      },
    ],
  };

  if (taskStatusChart) {
    // Update the chart data if it already exists
    taskStatusChart.data = data;
    taskStatusChart.update();
  } else {
    // Create a new chart instance if it doesn't exist
    const ctx = document.getElementById("taskStatusChart").getContext("2d");
    taskStatusChart = new Chart(ctx, {
      type: "pie",
      data: data,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "top",
          },
        },
      },
    });
  }
}

// Modify saveTasksToLocalStorage to update the chart after saving
function saveTasksToLocalStorage() {
  const tasks = [];
  const rows = taskList.getElementsByTagName("tr");

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const task = {
      name: row.cells[1].textContent,
      dueDate: row.cells[3].textContent,
      priority: row.cells[2].textContent,
      status: row.cells[0].textContent,
    };
    tasks.push(task);
  }

  localStorage.setItem("tasks", JSON.stringify(tasks));
  updateTaskStatusChart(); // Update chart after saving tasks
}

// Update the loadTasksFromLocalStorage function to initialize the chart
function loadTasksFromLocalStorage() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  tasks.forEach((task) => {
    const taskRow = createTaskRow(task.name, task.dueDate, task.priority);
    if (task.status === "Completed") {
      taskRow.cells[0].textContent = "Completed";
      taskRow.cells[1].style.textDecoration = "line-through";
      taskRow.cells[1].style.fontWeight = "bold";
      taskRow.cells[1].style.color = "green";
    }
    taskList.appendChild(taskRow);
  });

  const isEmpty = taskList.getElementsByTagName("tr").length <= 1;
  clearAllButton.classList.toggle("d-none", isEmpty);

  updateTaskStatusChart(); // Initialize the chart with loaded tasks
}

// Add a `<canvas>` element to your HTML for the chart
// <canvas id="taskStatusChart" width="400" height="200"></canvas>

// Ensure the chart is updated after any task-related changes
clearAllButton.addEventListener("click", () => {
  clearAllTasks();
  updateTaskStatusChart();
});

allTasksButton.addEventListener("click", () => {
  showAllTasks();
  setActiveSectionButton(allTasksButton);
  clearAllButton.classList.remove("d-none");
  updateTaskStatusChart();
});

activeTasksButton.addEventListener("click", () => {
  showActiveTasks();
  setActiveSectionButton(activeTasksButton);
  clearAllButton.classList.add("d-none");
  updateTaskStatusChart();
});

completedTasksButton.addEventListener("click", () => {
  showCompletedTasks();
  setActiveSectionButton(completedTasksButton);
  clearAllButton.classList.add("d-none");
  updateTaskStatusChart();
});
window.updateChat = updateChat;


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