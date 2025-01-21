const allSideMenu = document.querySelectorAll("#sidebar .side-menu.top li a");
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
const img = document.querySelector("img");
menuBar.addEventListener("click", function () {
  sidebar.classList.toggle("hide");
  img.classList.toggle("hide");
});

const switchMode = document.getElementById("switch-mode");
switchMode.addEventListener("change", function () {
  if (this.checked) {
    document.body.classList.add("dark");
  } else {
    document.body.classList.remove("dark");
  }
});

// Task Management Code
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

clearAllButton.addEventListener("click", () => {
  clearAllTasks();
});

let taskName;
let dueDate;
let priority;
let taskRow;

function validateTaskInput() {
  taskName = addTaskName.value;
  dueDate = dateInput.value;
  priority = document.getElementById("priority").value;
  return taskName.trim() !== "" && dueDate !== "" && priority !== "";
}

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

    // Store task in localStorage
    storeTaskInLocalStorage(taskName, dueDate, priority);
  }
}

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
    // Make the fields editable
    taskDescription.setAttribute("contenteditable", "true");
    dueDateCell.setAttribute("contenteditable", "true");
    priorityCell.setAttribute("contenteditable", "true");
    taskDescription.focus();
  });

  taskDescription.addEventListener("blur", () => {
    taskDescription.removeAttribute("contenteditable");
    updateTaskInLocalStorage(taskRow);
  });

  dueDateCell.addEventListener("blur", () => {
    dueDateCell.removeAttribute("contenteditable");
    updateTaskInLocalStorage(taskRow);
  });

  priorityCell.addEventListener("blur", () => {
    priorityCell.removeAttribute("contenteditable");
    updateTaskInLocalStorage(taskRow);
  });

  const completeButton = document.createElement("button");
  completeButton.innerHTML = '<i class="fa-solid fa-check"></i>';
  completeButton.addEventListener("click", () => {
    statusCell.textContent = "Completed";
    taskDescription.style.textDecoration = "line-through";
    taskDescription.style.fontWeight = "bold";
    taskDescription.style.color = "green";
    updateTaskStatusInLocalStorage(taskName, "Completed");
  });

  const deleteButton = document.createElement("button");
  deleteButton.innerHTML = '<i class="fa-solid fa-trash"></i>';
  deleteButton.addEventListener("click", () => {
    taskRow.remove();
    removeTaskFromLocalStorage(taskName);
    const remainingTasks = taskList.getElementsByTagName("tr").length - 1;

    if (remainingTasks === 0) {
      noneInputsContainer.style.display = "none";
      clearAllButton.classList.add("d-none");
    }
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

function storeTaskInLocalStorage(taskName, dueDate, priority) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const task = {
    taskName,
    dueDate,
    priority,
    status: "Active",
  };
  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateTaskInLocalStorage(taskRow) {
  const taskName = taskRow.querySelector("td:nth-child(2)").textContent;
  const dueDate = taskRow.querySelector("td:nth-child(4)").textContent;
  const priority = taskRow.querySelector("td:nth-child(3)").textContent;

  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const taskIndex = tasks.findIndex(task => task.taskName === taskName);

  if (taskIndex !== -1) {
    tasks[taskIndex] = {
      taskName,
      dueDate,
      priority,
      status: tasks[taskIndex].status, // Retain the current status
    };
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }
}

function removeTaskFromLocalStorage(taskName) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks = tasks.filter(task => task.taskName !== taskName);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function clearAllTasks() {
  const taskList = document.getElementById("tasksListing");
  const tableRows = taskList.getElementsByTagName("tr");

  for (let i = tableRows.length - 1; i > 0; i--) {
    tableRows[i].remove();
  }

  localStorage.removeItem("tasks");
  noneInputsContainer.style.display = "none";
  clearAllButton.classList.add("d-none");
}

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

function setActiveSectionButton(button) {
  allSideMenu.forEach(i => i.parentElement.classList.remove("active"));
  button.parentElement.classList.add("active");
}

// Load tasks from localStorage when page loads
document.addEventListener("DOMContentLoaded", () => {
  loadTasksFromLocalStorage();
});

function loadTasksFromLocalStorage() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach((task) => {
    const taskRow = createTaskRow(task.taskName, task.dueDate, task.priority);
    const statusCell = taskRow.querySelector("td");
    statusCell.textContent = task.status;

    if (task.status === "Completed") {
      taskRow.querySelector("td:nth-child(2)").style.textDecoration = "line-through";
      taskRow.querySelector("td:nth-child(2)").style.color = "green";
    }

    taskList.appendChild(taskRow);
  });
}
