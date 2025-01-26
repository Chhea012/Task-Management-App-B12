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

document.addEventListener("DOMContentLoaded", function () {
    const createButton = document.getElementById("create");
    const mainContent = document.getElementById("main-content");

    // Create dropdown container dynamically
    const dropdownContainer = document.createElement("div");
    dropdownContainer.style.marginBottom = "1rem";

    const taskDropdown = document.createElement("select");
    taskDropdown.setAttribute("id", "all-tasks");
    taskDropdown.style.padding = "0.5rem";
    taskDropdown.style.fontSize = "1rem";

    const editButton = document.createElement("button");
    editButton.textContent = "Edit Project";
    editButton.classList.add("btn-primary");
    editButton.style.marginLeft = "1rem";

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete Project";
    deleteButton.classList.add("btn-danger");
    deleteButton.style.marginLeft = "0.5rem";

    dropdownContainer.appendChild(taskDropdown);
    dropdownContainer.appendChild(editButton);
    dropdownContainer.appendChild(deleteButton);
    mainContent.insertBefore(dropdownContainer, mainContent.firstChild);

    let taskCounter = 1;

    // Add default "All Tasks" option
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Select a task...";
    taskDropdown.appendChild(defaultOption);

    // Load saved tasks from localStorage
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];

    // Function to save tasks to localStorage
    function saveTasksToLocalStorage() {
        const tasks = [...document.querySelectorAll(".task-container")].map((task) => ({
            id: task.id,
            name: task.querySelector("h2").textContent,
            cards: [...task.querySelectorAll(".task")].map((card) => ({
                taskName: card.querySelector("h5").textContent,
                taskDescription: card.querySelector("p").textContent,
                taskStatus: card.closest(".card-task").classList[1] // Get status (todo, in-progress, done)
            }))
        }));
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    // Function to create a new task card
    function createTaskCard(taskName, taskDescription) {
        const newTaskCard = document.createElement("div");
        newTaskCard.classList.add("task");

        newTaskCard.innerHTML = `
            <div class="btn-task">
                <div class="task-flex">
                    <button class="circle-color"></button>
                    <h5>${taskName}</h5>
                </div>
                <i class="bx bx-dots-horizontal-rounded icons"></i>
            </div>
            <p>${taskDescription}</p>
        `;

        return newTaskCard;
    }

    // Function to create a new task container
    function createNewTask(taskName) {
        const newTaskContainer = document.createElement("div");
        newTaskContainer.setAttribute("class", "task-container");
        newTaskContainer.setAttribute("id", taskName);

        newTaskContainer.innerHTML = `
            <h2>${taskName}</h2>
            <div class="content-flex">
                <div class="main-content">
                    <div class="card-task todo">
                        <div class="card-btn">
                            <button class="circle-todo"></button>
                            <h5>Todo</h5>
                        </div>
                        <p>This is a todo task.</p>
                        <div class ='list-task todo'></div>
                        <div class="add-task">
                            <button class="add-task-btn todo">
                                <i class='bx bx-plus'></i>Add item
                            </button>
                        </div>
                    </div>
                </div>
                <div class="main-content">
                    <div class="card-task in-progress">
                        <div class="card-btn">
                            <button class="circle-progress"></button>
                            <h5>In progress</h5>
                        </div>
                        <p>This is an in-progress task.</p>
                        <div class ='list-task in-progress'></div>
                        <div class="add-task">
                            <button class="add-task-btn in-progress">
                                <i class='bx bx-plus'></i>Add item
                            </button>
                        </div>
                    </div>
                </div>
                <div class="main-content">
                    <div class="card-task done">
                        <div class="card-btn">
                            <button class="circle-done"></button>
                            <h5>Done</h5>
                        </div>
                        <p>This is a done task.</p>
                        <div class ='list-task done'></div>
                        <div class="add-task">
                            <button class="add-task-btn done">
                                <i class='bx bx-plus'></i>Add item
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        return newTaskContainer;
    }

    // Handle Create Project button click
    createButton.addEventListener("click", function () {
        Swal.fire({
            title: 'Enter Project Name',
            input: 'text',
            inputValue: `Task ${taskCounter + 1}`,
            inputPlaceholder: 'Enter your project name...',
            showCancelButton: true,
            confirmButtonText: 'Create Project',
            cancelButtonText: 'Cancel',
            background: '#f1f1f1',  // Set background color
            inputAttributes: {
                autocapitalize: 'off',
                spellcheck: 'false'
            },
            preConfirm: (projectName) => {
                if (!projectName || projectName.trim() === "") {
                    Swal.showValidationMessage('Project name is required!');
                    return;
                }
                return projectName;
            }
        }).then(result => {
            if (result.isConfirmed) {
                const projectName = result.value;
                if (!projectName || projectName.trim() === "") {
                    alert("Project creation cancelled or invalid name provided.");
                    return;
                }

                document.querySelectorAll(".task-container").forEach((task) => {
                    task.style.display = "none";
                });

                const taskOption = document.createElement("option");
                taskOption.value = projectName;
                taskOption.textContent = projectName;
                taskDropdown.appendChild(taskOption);

                const newTask = createNewTask(projectName);
                newTask.style.display = "block";
                mainContent.appendChild(newTask);

                taskDropdown.value = projectName;

                saveTasksToLocalStorage();
                taskCounter++;
            }
        });
    });

    // Handle Edit Project Name button click
    editButton.addEventListener("click", function () {
        const selectedTask = taskDropdown.value;
        if (!selectedTask) {
            Swal.fire({
                icon: 'error',
                title: 'No project selected',
                text: 'Please select a project to edit.'
            });
            return;
        }

        Swal.fire({
            title: 'Enter New Project Name',
            input: 'text',
            inputValue: selectedTask,
            inputPlaceholder: 'Enter new project name...',
            showCancelButton: true,
            confirmButtonText: 'Save Changes',
            cancelButtonText: 'Cancel',
            inputAttributes: {
                autocapitalize: 'off',
                spellcheck: 'false'
            },
            preConfirm: (newTaskName) => {
                if (!newTaskName || newTaskName.trim() === "") {
                    Swal.showValidationMessage('New project name is required!');
                    return;
                }
                return newTaskName;
            }
        }).then(result => {
            if (result.isConfirmed) {
                const newTaskName = result.value;
                if (!newTaskName || newTaskName.trim() === "") {
                    alert("Edit cancelled or invalid name provided.");
                    return;
                }

                // Update task container
                const taskContainer = document.getElementById(selectedTask);
                if (taskContainer) {
                    taskContainer.querySelector("h2").textContent = newTaskName;
                    taskContainer.id = newTaskName;
                }

                // Update dropdown option
                const taskOption = taskDropdown.querySelector(`option[value="${selectedTask}"]`);
                if (taskOption) {
                    taskOption.value = newTaskName;
                    taskOption.textContent = newTaskName;
                }

                // Update dropdown value to the new name
                taskDropdown.value = newTaskName;

                saveTasksToLocalStorage();
            }
        });
    });

    // Handle Delete Project button click
    deleteButton.addEventListener("click", function () {
        const selectedTask = taskDropdown.value;
        if (!selectedTask) {
            Swal.fire({
                icon: 'error',
                title: 'No project selected',
                text: 'Please select a project to delete.'
            });
            return;
        }

        Swal.fire({
            title: `Are you sure you want to delete "${selectedTask}"?`,
            text: "This action cannot be undone!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
        }).then(result => {
            if (result.isConfirmed) {
                // Remove task container
                const taskContainer = document.getElementById(selectedTask);
                if (taskContainer) {
                    taskContainer.remove();
                }

                // Remove dropdown option
                const taskOption = taskDropdown.querySelector(`option[value="${selectedTask}"]`);
                if (taskOption) {
                    taskOption.remove();
                }

                // Reset dropdown to default
                taskDropdown.value = "";

                // Remove task from localStorage
                const updatedTasks = savedTasks.filter(task => task.name !== selectedTask);
                localStorage.setItem("tasks", JSON.stringify(updatedTasks));

                saveTasksToLocalStorage(); // Update localStorage after deletion

                Swal.fire({
                    icon: 'success',
                    title: 'Project deleted!',
                    text: `"${selectedTask}" has been successfully deleted.`
                });
            }
        });
    });

    // Dropdown change event to display selected task
    taskDropdown.addEventListener("change", function () {
        const selectedTask = taskDropdown.value;

        document.querySelectorAll(".task-container").forEach((task) => {
            task.style.display = "none";
        });

        if (selectedTask) {
            const taskToShow = document.getElementById(selectedTask);
            if (taskToShow) {
                taskToShow.style.display = "block";
            }
        }
    });

    // If no tasks in localStorage, initialize with a default task
    if (savedTasks.length === 0) {
        const initialTask = createNewTask("Task ");
        initialTask.style.display = "block";
        mainContent.appendChild(initialTask);

        const initialOption = document.createElement("option");
        initialOption.value = "Task ";
        initialOption.textContent = "Task ";  
        taskDropdown.appendChild(initialOption);

        saveTasksToLocalStorage();
    } else {
        // Load saved tasks from localStorage
        savedTasks.forEach((task) => {
            const restoredTask = createNewTask(task.name);
            restoredTask.style.display = "none";
            mainContent.appendChild(restoredTask);

            // Restore task cards
            task.cards.forEach(card => {
                const taskCard = createTaskCard(card.taskName, card.taskDescription);
                const statusDiv = restoredTask.querySelector(`.card-task.${card.taskStatus}`);
                if (statusDiv) {
                    statusDiv.querySelector(".list-task").appendChild(taskCard); // Append card to .list-task
                }
            });

            const restoredOption = document.createElement("option");
            restoredOption.value = task.name;
            restoredOption.textContent = task.name;
            taskDropdown.appendChild(restoredOption);
        });

        taskDropdown.value = savedTasks[0].name;
        const firstTaskToShow = document.getElementById(savedTasks[0].name);
        if (firstTaskToShow) {
            firstTaskToShow.style.display = "block";
        }
    }

    // Add item button functionality (SweetAlert popup)
    document.addEventListener("click", function(event) {
        if (event.target.closest('.add-task-btn')) {
            const cardContainer = event.target.closest('.card-task');
            const listTaskContainer = cardContainer.querySelector('.list-task'); // Get the .list-task container
            const status = cardContainer.classList[1]; // Get current status (todo, in-progress, done)

            // Show SweetAlert prompt
            Swal.fire({
                title: 'Task  Name',
                html: `
                    <input id="task-name" class="swal2-input" placeholder="Task Name" />
                    <textarea id="task-description" class="swal2-textarea" placeholder="Task Description"></textarea>
                `,
                preConfirm: () => {
                    const taskName = document.getElementById('task-name').value;
                    const taskDescription = document.getElementById('task-description').value;
                    if (!taskName || !taskDescription) {
                        Swal.showValidationMessage("Both fields are required!");
                        return;
                    }
                    return { taskName, taskDescription };
                }
            }).then(result => {
                if (result.isConfirmed) {
                    const { taskName, taskDescription } = result.value;
                    // Create and add task card
                    const newCard = createTaskCard(taskName, taskDescription);
                    listTaskContainer.appendChild(newCard); // Append the new card to the .list-task container

                    // Save task to localStorage
                    const taskNameFromDropdown = taskDropdown.value;
                    const task = savedTasks.find(t => t.name === taskNameFromDropdown);
                    if (task) {
                        task.cards.push({
                            taskName,
                            taskDescription,
                            taskStatus: status
                        });
                        saveTasksToLocalStorage();
                    }
                }
            });
        }
    });

    // Handle the icon (bx-dots-horizontal-rounded) click for edit and delete actions
    document.addEventListener("click", function(event) {
        if (event.target && event.target.classList.contains("bx-dots-horizontal-rounded")) {
            const taskCard = event.target.closest(".task");
            const taskName = taskCard.querySelector("h5").textContent;
            const taskDescription = taskCard.querySelector("p").textContent;

            Swal.fire({
                title: 'Choose an action',
                text: `Task: ${taskName}`,
                showCancelButton: true,
                confirmButtonText: 'Edit Task',
                cancelButtonText: 'Delete Task',
            }).then(result => {
                if (result.isConfirmed) {
                    // Edit task name and description
                    Swal.fire({
                        title: 'Edit Task',
                        html: `
                            <input id="edit-task-name" class="swal2-input" value="${taskName}" placeholder="Task Name" />
                            <textarea id="edit-task-description" class="swal2-textarea" placeholder="Task Description">${taskDescription}</textarea>
                        `,
                        preConfirm: () => {
                            const newTaskName = document.getElementById('edit-task-name').value;
                            const newTaskDescription = document.getElementById('edit-task-description').value;
                            if (!newTaskName || !newTaskDescription) {
                                Swal.showValidationMessage("Both fields are required!");
                                return;
                            }
                            return { newTaskName, newTaskDescription };
                        }
                    }).then(editResult => {
                        if (editResult.isConfirmed) {
                            const { newTaskName, newTaskDescription } = editResult.value;
                            taskCard.querySelector("h5").textContent = newTaskName;
                            taskCard.querySelector("p").textContent = newTaskDescription;

                            // Update task in localStorage
                            const taskNameFromDropdown = taskDropdown.value;
                            const task = savedTasks.find(t => t.name === taskNameFromDropdown);
                            if (task) {
                                const taskCardToUpdate = task.cards.find(card => card.taskName === taskName);
                                if (taskCardToUpdate) {
                                    taskCardToUpdate.taskName = newTaskName;
                                    taskCardToUpdate.taskDescription = newTaskDescription;
                                    saveTasksToLocalStorage();
                                }
                            }
                        }
                    });
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    // Delete task
                    Swal.fire({
                        title: 'Are you sure?',
                        text: "This action cannot be undone.",
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonText: 'Delete',
                        cancelButtonText: 'Cancel'
                    }).then(deleteResult => {
                        if (deleteResult.isConfirmed) {
                            taskCard.remove();

                            // Remove task from localStorage
                            const taskNameFromDropdown = taskDropdown.value;
                            const task = savedTasks.find(t => t.name === taskNameFromDropdown);
                            if (task) {
                                task.cards = task.cards.filter(card => card.taskName !== taskName);
                                saveTasksToLocalStorage();
                            }
                        }
                    });
                }
            });
        }
    });
});

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




