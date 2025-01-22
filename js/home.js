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
paragraph.textContent = "Date";
startDate.appendChild(paragraph);
// sum number

let allValues = document.querySelectorAll(".value");

allValues.forEach((singleValue) => {
  let startValue = 0;
  let endValue = parseInt(singleValue.getAttribute("data-value"));
  let duration = Math.floor(2000 / endValue);

  let counter = setInterval(function () {
    startValue += 1;
    singleValue.textContent = startValue;

    if (startValue == endValue) {
      clearInterval(counter);
    }
  }, duration);
});

// // count task
// const wtask = document.querySelector('p');
// const countTask = document.querySelector('.count-task');
// array.forEach(element => {
//   let total = countTask 

  
// });

// add
const addTask = document.querySelector("#content");

// Create the main container
const mainContent = document.createElement("main");
addTask.appendChild(mainContent);

// Create the table data container
const tableData = document.createElement("div");
tableData.classList.add("table-data");
mainContent.appendChild(tableData);

// Create the order section
const orderSection = document.createElement("div");
orderSection.classList.add("order");
tableData.appendChild(orderSection);

// Create the header for the order section
const orderHeader = document.createElement("div");
orderHeader.classList.add("head");
orderSection.appendChild(orderHeader);

// Create the heading for "Recent Orders"
const orderHeading = document.createElement("h3");
orderHeading.textContent = "Recent Orders";
orderHeader.appendChild(orderHeading);

// Create the search icon
const searchIcon = document.createElement("i");
searchIcon.classList.add("bx", "bx-search", "s2");
orderHeader.appendChild(searchIcon);

// Create the filter icon
const filterIcon = document.createElement("i");
filterIcon.classList.add("bx", "bx-filter");
orderHeader.appendChild(filterIcon);

// Create the table
const orderTable = document.createElement("table");
orderSection.appendChild(orderTable);

// Create the table head
const tableHead = document.createElement("thead");
orderTable.appendChild(tableHead);

// Create the table row for headers
const headerRow = document.createElement("tr");
tableHead.appendChild(headerRow);

// Create and append table headers
const userHeader = document.createElement("th");
userHeader.textContent = "User";
headerRow.appendChild(userHeader);

const dateHeader = document.createElement("th");
dateHeader.textContent = "Date Order";
headerRow.appendChild(dateHeader);

const statusHeader = document.createElement("th");
statusHeader.textContent = "Status";
headerRow.appendChild(statusHeader);

// Create the tbody element (empty for now)
const tableBody = document.createElement("tbody");
orderTable.appendChild(tableBody);

// Create the "Todos" section
const todoSection = document.createElement("div");
todoSection.classList.add("todo");
tableData.appendChild(todoSection);

// Create the header for the todo section
const todoHeader = document.createElement("div");
todoHeader.classList.add("head");
todoSection.appendChild(todoHeader);

// Create the heading for "Todos"
const todoHeading = document.createElement("h3");
todoHeading.textContent = "Todos";
todoHeader.appendChild(todoHeading);

// Create the plus icon for adding tasks
const plusIcon = document.createElement("i");
plusIcon.classList.add("bx", "bx-plus", "b1");
todoHeader.appendChild(plusIcon);

// Create the filter icon for todo section
const todoFilterIcon = document.createElement("i");
todoFilterIcon.classList.add("bx", "bx-filter");
todoHeader.appendChild(todoFilterIcon);

// Create the todo list (empty for now)
const todoList = document.createElement("ul");
todoList.classList.add("todo-list");
todoSection.appendChild(todoList);

document.addEventListener("DOMContentLoaded", function () {
  // Load tasks from localStorage on page load
  loadTasksFromLocalStorage();

  // Create the "Add Task" button
  document.querySelector(".b1").addEventListener("click", function () {
    // Create a new input for the task name
    const todoInput = document.createElement("input");
    todoInput.type = "text";
    todoInput.placeholder = "Enter task name...";
    todoInput.classList.add("todo-input");

    // Create the "Add" button
    const addBtn = document.createElement("button");
    addBtn.textContent = "Add";
    addBtn.classList.add("add-btn");

    // Create a container for the input and button
    const container = document.createElement("div");
    container.classList.add("todo-container");

    // Append the input and button to the container
    container.appendChild(todoInput);
    container.appendChild(addBtn);

    // Append the container to the todo list
    document.querySelector(".todo-list").appendChild(container);

    // Handle adding tasks
    addBtn.addEventListener("click", function () {
      const taskName = todoInput.value.trim();

      if (taskName !== "") {
        // Create a task item with the name
        const todoItem = createTodoItem(taskName);

        // Append the task item to the todo list
        document.querySelector(".todo-list").appendChild(todoItem);

        // Save tasks to local storage
        saveTasksToLocalStorage();

        // Clear the input and remove the container
        todoInput.value = "";
        container.remove();
      } else {
        // Alert if the input is invalid
        Swal.fire({
          title: "Invalid Input",
          text: "Please enter a task name.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    });
  });

  // Function to create a task item with a name
  function createTodoItem(taskName) {
    const todoItem = document.createElement("div");
    todoItem.classList.add("todo-item");

    // Add the task name
    const taskContent = document.createElement("span");
    taskContent.textContent = taskName;
    taskContent.classList.add("task-content");

    // Add a delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.classList.add("delete-btn");

    // Handle deleting the task
    deleteBtn.addEventListener("click", function () {
      todoItem.remove(); // Remove the task item
      saveTasksToLocalStorage(); // Update local storage
    });

    // Append the task name and delete button to the task item
    todoItem.appendChild(taskContent);
    todoItem.appendChild(deleteBtn);

    return todoItem;
  }

  // Example function to save tasks to local storage (you can replace this with your logic)
  function saveTasksToLocalStorage() {
    console.log("Tasks saved to local storage.");
    // Add logic to save tasks (e.g., an array of task objects) to localStorage
  }

  // Function to create a task item with a name and date
  function createTodoItem(taskName, taskDate) {
    const todoItem = document.createElement("div");
    todoItem.classList.add("todo-item");

    // Add the task name
    const taskContent = document.createElement("span");
    taskContent.textContent = taskName;
    taskContent.classList.add("task-content");

    // Add the task date
    const taskDateElement = document.createElement("span");
    taskDateElement.textContent = `Due: ${new Date(
      taskDate
    ).toLocaleDateString()}`;
    taskDateElement.classList.add("task-date");

    // Add a delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.classList.add("delete-btn");

    // Handle deleting the task
    deleteBtn.addEventListener("click", function () {
      todoItem.remove(); // Remove the task item
      saveTasksToLocalStorage(); // Update local storage
    });

    // Append the task name, date, and delete button to the task item
    todoItem.appendChild(taskContent);
    todoItem.appendChild(taskDateElement);
    todoItem.appendChild(deleteBtn);

    return todoItem;
  }

  // Example function to save tasks to local storage (you can replace this with your logic)
  function saveTasksToLocalStorage() {
    console.log("Tasks saved to local storage.");
    // Add logic to save tasks (e.g., an array of task objects) to localStorage
  }

  // Function to create a new to-do item with edit and delete functionality
  function createTodoItem(task) {
    const li = document.createElement("li");
    li.textContent = task;
    li.classList.add("todo-item");

    // Create edit and delete buttons
    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.classList.add("edit-btn");

    // Create the delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.classList.add("delete-btn");

    // Append the delete button to your desired element
    document.body.appendChild(deleteBtn); // Example: Append to the body

    // Add an event listener to the delete button
    deleteBtn.addEventListener("click", () => {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire("Deleted!", "Your item has been deleted.", "success");
          // Add your delete logic here
          console.log("Item deleted.");
        }
      });
    });

    // Append buttons to the task item
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);

    // Edit functionality using simple prompt
    editBtn.addEventListener("click", function () {
      const currentTask = li.firstChild.textContent.trim(); // Get the current task text

      Swal.fire({
        title: "Edit your task",
        input: "text",
        inputValue: currentTask, // Pre-fill with the current task text
        showCancelButton: true,
        confirmButtonText: "Save",
        showLoaderOnConfirm: true,
        preConfirm: (newTask) => {
          if (!newTask || newTask.trim() === "") {
            Swal.showValidationMessage("Please enter a valid task!");
          }
          return newTask.trim(); // Return the trimmed task text
        },
      }).then((result) => {
        if (result.isConfirmed) {
          // Update the task text with the new value
          li.firstChild.textContent = result.value;

          // Save the updated tasks to local storage
          saveTasksToLocalStorage();

          // Optional: Show a success message
          Swal.fire({
            title: "Success!",
            text: "The task has been updated.",
            icon: "success",
            confirmButtonText: "OK",
          });
        }
      });
    });

    // Delete functionality
    deleteBtn.addEventListener("click", function () {
      // Show a confirmation popup before deleting
      Swal.fire({
        title: "Are you sure?",
        text: "Do you really want to delete this task?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          // If user confirms, delete the task
          li.remove();

          // Save tasks to local storage after deleting
          saveTasksToLocalStorage();

          // Show a success popup after deletion
          Swal.fire({
            title: "Deleted!",
            text: "Your task has been deleted.",
            icon: "success",
            confirmButtonColor: "#3085d6",
          });
        }
      });
    });

    return li;
  }

  // Function to save tasks to localStorage
  function saveTasksToLocalStorage() {
    const tasks = [];
    document.querySelectorAll(".todo-item").forEach((task) => {
      tasks.push(task.firstChild.textContent.trim());
    });
    localStorage.setItem("tasks", JSON.stringify(tasks)); // Save the tasks array to localStorage
  }

  // Function to load tasks from localStorage
  function loadTasksFromLocalStorage() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach((task) => {
      const todoItem = createTodoItem(task);
      document.querySelector(".todo-list").appendChild(todoItem);
    });
  }
});

const menu = document.querySelectorAll(".bx-filter");
menu.forEach((item) => {
  item.addEventListener("click", () => {
    const parent = item.parentElement.parentElement;
    const children = parent.querySelectorAll(".todo-item");
    children.forEach((child) => {
      child.style.display =
        child.style.display === "none" ? "block" : "none";
    });
    console.log(children);
    item.classList.toggle("bx-rotate-90");
    item.classList.toggle("bx-x");
    item.classList.toggle("bx-x-circle");
  });
});

const search = document.querySelector(".s2");
// const tableBody = document.querySelector("#tableBody"); // Assuming your table body has an ID "tableBody"

// Load stored data from localStorage and render it
function loadTableFromLocalStorage() {
  const storedData = JSON.parse(localStorage.getItem("tableData")) || [];
  storedData.forEach((data) => addRowToTable(data));
}

// Add event listener to the button
search.addEventListener("click", function () {
  // SweetAlert popup
  Swal.fire({
    title: "Add Name User",
    html: `
<input type="text" id="name" class="swal2-input" placeholder="Enter Name">
<input type="date" id="date" class="swal2-input">
<select id="status" class="swal2-select">
  <option value="completed">Completed</option>
  <option value="pending">Pending</option>
</select>
`,
    focusConfirm: false,
    showCancelButton: true,
    preConfirm: () => {
      const name = document.getElementById("name").value;
      const date = document.getElementById("date").value;
      const status = document.getElementById("status").value;

      if (!name || !date) {
        Swal.showValidationMessage("Please fill in all fields");
        return false;
      }

      return { name, date, status };
    },
  }).then((result) => {
    if (result.isConfirmed) {
      const { name, date, status } = result.value;

      // Create data object
      const rowData = { name, date, status };

      // Add row to table
      addRowToTable(rowData);

      // Save to localStorage
      saveRowToLocalStorage(rowData);
    }
  });
});

// Add a row to the table
function addRowToTable({ name, date, status }) {
  const row = document.createElement("tr");
  row.setAttribute("data-name", name); // Set a unique attribute for identifying rows

  row.innerHTML = `
<td>
<i class='bx bxs-user-circle'></i>
<p style="display:inline;">${name}</p>
</td>
<td>${date}</td>
<td><span class="status ${status}">${capitalizeFirstLetter(
    status
  )}</span></td>
`;

  tableBody.appendChild(row);

  // Add click event listener for delete functionality
  row.addEventListener("click", () => handleRowClick(name));
}

// Save row data to localStorage
function saveRowToLocalStorage(rowData) {
  const storedData = JSON.parse(localStorage.getItem("tableData")) || [];
  storedData.push(rowData);
  localStorage.setItem("tableData", JSON.stringify(storedData));
}

// Capitalize the first letter of a string
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Handle row click for delete
function handleRowClick(name) {
  Swal.fire({
    title: "Are you sure?",
    text: `Do you want to delete the user "${name}"?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "No, cancel!",
  }).then((result) => {
    if (result.isConfirmed) {
      // Remove the row from the table
      deleteRowFromTable(name);

      // Remove the row from localStorage
      deleteRowFromLocalStorage(name);

      Swal.fire("Deleted!", "The user has been deleted.", "success");
    }
  });
}

// Delete a row from the table
function deleteRowFromTable(name) {
  const rows = tableBody.querySelectorAll("tr");
  rows.forEach((row) => {
    if (row.getAttribute("data-name") === name) {
      row.remove();
    }
  });
}

// Delete a row from localStorage
function deleteRowFromLocalStorage(name) {
  let storedData = JSON.parse(localStorage.getItem("tableData")) || [];
  storedData = storedData.filter((row) => row.name !== name);
  localStorage.setItem("tableData", JSON.stringify(storedData));
}

// Load the table on page load
loadTableFromLocalStorage();
