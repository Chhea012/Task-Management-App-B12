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
    taskDescription.setAttribute("contenteditable", "true");
    taskDescription.focus();
  });

  taskDescription.addEventListener("blur", () => {
    taskDescription.removeAttribute("contenteditable");
  });

  const completeButton = document.createElement("button");
  completeButton.innerHTML = '<i class="fa-solid fa-check"></i>';
  completeButton.addEventListener("click", () => {
    statusCell.textContent = "Completed";
    taskDescription.style.textDecoration = "line-through";
    taskDescription.style.fontWeight = "bold";
    taskDescription.style.color = "green";
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

function clearAllTasks() {
  const taskList = document.getElementById("tasksListing");
  const tableRows = taskList.getElementsByTagName("tr");

  for (let i = tableRows.length - 1; i > 0; i--) {
    tableRows[i].remove();
  }
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

function setActiveSectionButton(activeButton) {
  allTasksButton.classList.remove("active-section");
  activeTasksButton.classList.remove("active-section");
  completedTasksButton.classList.remove("active-section");

  activeButton.classList.add("active-section");
}

//Sorting the task's priorities
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
}

//Sorting the task's due dates
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
}

document.addEventListener("DOMContentLoaded", () => {
  const table = document.getElementById("tasksListing");

  table.addEventListener("click", (event) => {
    const button = event.target;
    const row = button.closest("tr");

    if (button.classList.contains("edit-btn")) {
      toggleEdit(row, true);
    } else if (button.classList.contains("save-btn")) {
      toggleEdit(row, false, true);
    } else if (button.classList.contains("cancel-btn")) {
      toggleEdit(row, false, false);
    }
  });

  function toggleEdit(row, isEditing, saveChanges = false) {
    const cells = row.querySelectorAll("td");
    cells.forEach((cell, index) => {
      if (index < cells.length - 1) {
        // Skip the last column (Actions)
        if (isEditing) {
          const value = cell.innerText.trim();
          cell.innerHTML = `<input type="text" value="${value}" style="width: 100%;">`;
        } else if (saveChanges) {
          const input = cell.querySelector("input");
          cell.innerText = input.value;
        } else {
          const input = cell.querySelector("input");
          cell.innerText = input.defaultValue;
        }
      }
    });
  }
});

function toggleEdit() {
    const rows = document.querySelectorAll('#taskTable tbody tr');
    const isEditing = rows[0].querySelector('td').contentEditable === "true";
    
    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        cells.forEach(cell => {
            cell.contentEditable = !isEditing; // Toggle editability
        });
    });
    
    document.querySelector('.edit-button').style.display = isEditing ? 'inline' : 'none';
    document.querySelector('.save-button').style.display = isEditing ? 'none' : 'inline';
}

function saveChanges() {
    const rows = document.querySelectorAll('#taskTable tbody tr');
    
    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        cells.forEach(cell => {
            cell.contentEditable = "false"; // Set all cells to non-editable
        });
    });
    
    document.querySelector('.edit-button').style.display = 'inline';
    document.querySelector('.save-button').style.display = 'none';
}

function deleteRow(button) {
    const row = button.parentElement.parentElement;
    row.parentElement.removeChild(row);
}







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