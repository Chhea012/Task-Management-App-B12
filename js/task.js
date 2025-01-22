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

// Select the button
const ButtonTask = document.querySelector('.add-main-task-btn');

// Function to save tasks to localStorage
function saveTaskToLocalStorage(task) {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.push(task);
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Function to load tasks from localStorage
function loadTasksFromLocalStorage() {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  const mainContent = document.querySelector('.main-content');

  tasks.forEach((task, index) => {
    const taskCard = document.createElement('div');
    taskCard.classList.add('card-task');
    taskCard.dataset.index = index; // Store the task index for future editing and deleting

    taskCard.innerHTML = `
      <div class="card-btn">
        <button class="circle-progress"></button>
        <h5>${task.status}</h5>
      </div>
      <p>${task.description}</p>
      <div class="add-task">
        <button class="add-task-btn">
          <i class='bx bx-plus'></i>Add item
        </button>
      </div>
    `;

    // Add event listener to the entire card for double-click to trigger deletion
    taskCard.addEventListener('dblclick', () => {
      deleteTask(taskCard, task, index);
    });

    mainContent.appendChild(taskCard);
  });
}
// Function to handle task editing or deletion
function deleteTask(taskCard, task, index) {
  Swal.fire({
    title: 'Are you sure?',
    text: "This task will be permanently deleted!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Delete Task',
    cancelButtonText: 'Cancel',
    confirmButtonColor: '#d33',
    preConfirm: () => {
      // Delete the task from localStorage
      const tasks = JSON.parse(localStorage.getItem('tasks'));
      tasks.splice(index, 1);
      localStorage.setItem('tasks', JSON.stringify(tasks));

      // Remove the task card from the page
      taskCard.remove();
    }
  });
}
// Event listener for the button click to create new task
ButtonTask.addEventListener('click', () => {
  Swal.fire({
    title: 'Add Task',
    html: `
      <input id="taskStatus" class="swal2-input" placeholder="Enter task status" />
      <textarea id="taskDescription" class="swal2-textarea" placeholder="Enter task description"></textarea>
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: 'Create Task',
    cancelButtonText: 'Cancel',
    preConfirm: () => {
      const status = document.getElementById('taskStatus').value;
      const description = document.getElementById('taskDescription').value;

      if (!status || !description) {
        Swal.showValidationMessage('Please enter both status and description');
        return false;
      }

      const task = {
        status: status,
        description: description
      };

      // Save task to localStorage
      saveTaskToLocalStorage(task);

      // Add new task to the page
      const mainContent = document.querySelector('.main-content');
      const taskCard = document.createElement('div');
      taskCard.classList.add('card-task');
      taskCard.innerHTML = `
        <div class="card-btn">
          <button class="circle-progress"></button>
          <h5>${status}</h5>
        </div>
        <p>${description}</p>
        <div class="add-task">
          <button class="add-task-btn">
            <i class='bx bx-plus'></i>Add item
          </button>
        </div>
      `;

      // Add event listener for double-click to trigger deletion
      taskCard.addEventListener('dblclick', () => {
        deleteTask(taskCard, task, JSON.parse(localStorage.getItem('tasks')).length - 1);
      });

      mainContent.appendChild(taskCard);
    }
  });
});
// Load tasks from localStorage when the page loads
window.addEventListener('DOMContentLoaded', loadTasksFromLocalStorage);
// Function to save tasks to localStorage
function saveTasksToLocalStorage() {
    const tasks = [];
    document.querySelectorAll('.task').forEach((task) => {
        const taskName = task.querySelector('h5').textContent;
        const taskDescription = task.querySelector('p').textContent;
        const parentClass = task.closest('.card-task').classList[1]; // Get the container class (e.g., 'todo', 'in-progress', 'done')
        tasks.push({ taskName, taskDescription, parentClass });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Function to load tasks from localStorage
function loadTasksFromLocalStorage() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(({ taskName, taskDescription, parentClass }) => {
        const targetContainer = `.card-task.${parentClass}`;
        createTask(taskName, taskDescription, targetContainer, false); // false = don't save again
    });
}

// Function to create and append a new task
function createTask(taskName, taskDescription, targetContainer, save = true) {
    const taskDiv = document.createElement('div');
    taskDiv.classList.add('task');
    taskDiv.setAttribute('draggable', 'true'); // Make the task draggable

    taskDiv.innerHTML = `
        <div class="btn-task">
            <div class="task-flex">
                <button class="do-done"></button>
                <h5>${taskName}</h5>
            </div>
            <i class='bx bx-dots-horizontal-rounded icons'></i>
        </div>
        <p>${taskDescription}</p>
    `;

    // Append the task to the appropriate container
    document.querySelector(targetContainer).appendChild(taskDiv);

    // Now, let's ensure the button color is updated according to the container type
    const button = taskDiv.querySelector('.do-done');
    const container = document.querySelector(targetContainer);

    // Set button color based on the parent container
    if (container.classList.contains('todo')) {
        button.style.backgroundColor = 'red'; // Set the color for todo tasks
    } else if (container.classList.contains('in-progress')) {
        button.style.backgroundColor = 'yellow'; // Set the color for in-progress tasks
    } else if (container.classList.contains('done')) {
        button.style.backgroundColor = 'green'; // Set the color for done tasks
    }

    addDragEvents(taskDiv); // Add drag-and-drop functionality to the task

    if (save) saveTasksToLocalStorage(); // Save to localStorage only if specified
}

// Add drag-and-drop events to tasks
function addDragEvents(task) {
    task.addEventListener('dragstart', () => {
        task.classList.add('dragging');
    });

    task.addEventListener('dragend', () => {
        task.classList.remove('dragging');
        saveTasksToLocalStorage(); // Save updated tasks after moving
    });
}

// Allow dropping into task containers
document.querySelectorAll('.card-task').forEach((container) => {
    container.addEventListener('dragover', (e) => {
        e.preventDefault(); // Allow dropping by preventing the default behavior
        container.classList.add('drag-over');
    });

    container.addEventListener('dragleave', () => {
        container.classList.remove('drag-over');
    });

    container.addEventListener('drop', (e) => {
        e.preventDefault();
        container.classList.remove('drag-over');

        // Get the dragged task
        const draggedTask = document.querySelector('.dragging');
        container.appendChild(draggedTask); // Move the task to the new container

        // Update button color based on the new container
        const button = draggedTask.querySelector('.do-done');
        if (container.classList.contains('todo')) {
            button.style.backgroundColor = 'red'; // Set the color for todo tasks
        } else if (container.classList.contains('in-progress')) {
            button.style.backgroundColor = 'yellow'; // Set the color for in-progress tasks
        } else if (container.classList.contains('done')) {
            button.style.backgroundColor = 'green'; // Set the color for done tasks
        }

        saveTasksToLocalStorage(); // Save updated tasks after moving
    });
});

// Event delegation for task actions (Edit/Delete)
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('bx-dots-horizontal-rounded')) {
        const taskDiv = e.target.closest('.task');

        Swal.fire({
            title: 'Task Options',
            showCancelButton: true,
            showDenyButton: true,
            confirmButtonText: 'Edit',
            denyButtonText: 'Delete',
            cancelButtonText: 'Cancel',
            icon: 'question',
        }).then((result) => {
            if (result.isConfirmed) {
                // Edit task
                Swal.fire({
                    title: 'Edit Task',
                    html: `
                        <input type="text" id="edit-task-name" class="swal2-input" placeholder="Task Name" value="${taskDiv.querySelector('h5').textContent}">
                        <textarea id="edit-task-description" class="swal2-textarea" placeholder="Task Description">${taskDiv.querySelector('p').textContent}</textarea>
                    `,
                    focusConfirm: false,
                    preConfirm: () => {
                        const newTaskName = document.getElementById('edit-task-name').value;
                        const newTaskDescription = document.getElementById('edit-task-description').value;

                        if (!newTaskName || !newTaskDescription) {
                            Swal.showValidationMessage('Please enter both task name and description.');
                            return false;
                        }

                        return { newTaskName, newTaskDescription };
                    },
                }).then((editResult) => {
                    if (editResult.isConfirmed) {
                        const { newTaskName, newTaskDescription } = editResult.value;
                        taskDiv.querySelector('h5').textContent = newTaskName;
                        taskDiv.querySelector('p').textContent = newTaskDescription;
                        saveTasksToLocalStorage();
                        Swal.fire({
                            title: 'Task Updated!',
                            text: 'Your task has been updated successfully.',
                            icon: 'success',
                            confirmButtonText: 'Okay',
                        });
                    }
                });
            } else if (result.isDenied) {
                // Delete task
                Swal.fire({
                    title: 'Are you sure?',
                    text: 'This action cannot be undone.',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Delete',
                    cancelButtonText: 'Cancel',
                }).then((deleteResult) => {
                    if (deleteResult.isConfirmed) {
                        taskDiv.remove();
                        saveTasksToLocalStorage();
                        Swal.fire({
                            title: 'Deleted!',
                            text: 'The task has been deleted successfully.',
                            icon: 'success',
                            confirmButtonText: 'Okay',
                        });
                    }
                });
            }
        });
    }
});

// Add task button event listener
document.querySelectorAll('.add-task-btn').forEach((item) => {
    item.addEventListener('click', () => {
        Swal.fire({
            title: 'Add new item',
            html: `
                <input type="text" id="task-name" class="swal2-input" placeholder="Task Name">
                <textarea id="task-description" class="swal2-textarea" placeholder="Task Description"></textarea>
            `,
            focusConfirm: false,
            preConfirm: () => {
                const taskName = document.getElementById('task-name').value;
                const taskDescription = document.getElementById('task-description').value;

                if (!taskName || !taskDescription) {
                    Swal.showValidationMessage('Please enter both task name and description.');
                    return false;
                }

                return { taskName, taskDescription };
            }
        }).then((result) => {
            if (result.isConfirmed) {
                const { taskName, taskDescription } = result.value;

                const parentCard = item.closest('.card-task');
                let targetContainer;

                if (parentCard.classList.contains('todo')) {
                    targetContainer = '.card-task.todo';
                } else if (parentCard.classList.contains('in-progress')) {
                    targetContainer = '.card-task.in-progress';
                } else if (parentCard.classList.contains('done')) {
                    targetContainer = '.card-task.done';
                }

                createTask(taskName, taskDescription, targetContainer);
            }
        });
    });
});

// Load tasks when the page loads
document.addEventListener('DOMContentLoaded', () => {
    loadTasksFromLocalStorage();
});



// let myChart;
//         let taskData = { todo: 0, inProgress: 0, done: 0 };

//         // Function to save tasks to localStorage
//         function saveTasksToLocalStorage() {
//             const tasks = [];
//             document.querySelectorAll('.task').forEach((task) => {
//                 const taskName = task.querySelector('h5').textContent;
//                 const taskDescription = task.querySelector('p').textContent;
//                 const parentClass = task.closest('.card-task').classList[1]; // Get the container class (e.g., 'todo', 'in-progress', 'done')
//                 tasks.push({ taskName, taskDescription, parentClass });
//             });
//             localStorage.setItem('tasks', JSON.stringify(tasks));
//             updateChartData(); // Update chart whenever tasks are saved
//         }

//         // Function to load tasks from localStorage
//         function loadTasksFromLocalStorage() {
//             const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
//             tasks.forEach(({ taskName, taskDescription, parentClass }) => {
//                 const targetContainer = `.card-task.${parentClass}`;
//                 createTask(taskName, taskDescription, targetContainer, false); // false = don't save again
//             });
//             updateChartData(); // Update chart after loading tasks
//         }

//         // Function to create and append a new task
//         function createTask(taskName, taskDescription, targetContainer, save = true) {
//             const taskDiv = document.createElement('div');
//             taskDiv.classList.add('task');
//             taskDiv.setAttribute('draggable', 'true'); // Make the task draggable

//             taskDiv.innerHTML = `
//                 <div class="btn-task">
//                     <div class="task-flex">
//                         <button class="do-done"></button>
//                         <h5>${taskName}</h5>
//                     </div>
//                     <i class='bx bx-dots-horizontal-rounded icons'></i>
//                 </div>
//                 <p>${taskDescription}</p>
//             `;
//             document.querySelector(targetContainer).appendChild(taskDiv);
//             addDragEvents(taskDiv); // Add drag-and-drop functionality to the task

//             if (save) saveTasksToLocalStorage(); // Save to localStorage only if specified
//         }

//         // Add drag-and-drop events to tasks
//         function addDragEvents(task) {
//             task.addEventListener('dragstart', () => {
//                 task.classList.add('dragging');
//             });

//             task.addEventListener('dragend', () => {
//                 task.classList.remove('dragging');
//                 saveTasksToLocalStorage(); // Save updated tasks after moving
//             });
//         }

//         // Allow dropping into task containers
//         document.querySelectorAll('.card-task').forEach((container) => {
//             container.addEventListener('dragover', (e) => {
//                 e.preventDefault(); // Allow dropping by preventing the default behavior
//                 container.classList.add('drag-over');
//             });

//             container.addEventListener('dragleave', () => {
//                 container.classList.remove('drag-over');
//             });

//             container.addEventListener('drop', (e) => {
//                 e.preventDefault();
//                 container.classList.remove('drag-over');

//                 // Get the dragged task
//                 const draggedTask = document.querySelector('.dragging');
//                 container.appendChild(draggedTask); // Move the task to the new container

//                 saveTasksToLocalStorage(); // Save after task moved
//             });
//         });

//         // Update chart data dynamically based on task statuses
//         function updateChartData() {
//             taskData = { todo: 0, inProgress: 0, done: 0 };

//             // Count tasks in each status
//             document.querySelectorAll('.task').forEach((task) => {
//                 const parentClass = task.closest('.card-task').classList[1];
//                 if (parentClass === 'todo') taskData.todo++;
//                 if (parentClass === 'in-progress') taskData.inProgress++;
//                 if (parentClass === 'done') taskData.done++;
//             });

//             // Update chart with new data
//             if (myChart) {
//                 myChart.data.datasets[0].data = [taskData.todo, taskData.inProgress, taskData.done];
//                 myChart.update();
//             }
//         }

//         // Initialize chart
//         function initChart() {
//             const ctx = document.getElementById('myChart').getContext('2d');
//             myChart = new Chart(ctx, {
//                 type: 'bar',
//                 data: {
//                     labels: ['Todo', 'In Progress', 'Done'],
//                     datasets: [{
//                         label: '# of Tasks',
//                         data: [taskData.todo, taskData.inProgress, taskData.done],
//                         backgroundColor: [
//                             'rgba(255, 99, 132, 0.2)',
//                             'rgba(54, 162, 235, 0.2)',
//                             'rgba(75, 192, 192, 0.2)',
//                         ],
//                         borderColor: [
//                             'rgba(255, 99, 132, 1)',
//                             'rgba(54, 162, 235, 1)',
//                             'rgba(75, 192, 192, 1)',
//                         ],
//                         borderWidth: 1
//                     }]
//                 },
//                 options: {
//                     scales: {
//                         y: {
//                             beginAtZero: true
//                         }
//                     }
//                 }
//             });
//         }

//         // Add task button event listener
//         document.querySelector('.add-task-btn').addEventListener('click', () => {
//             Swal.fire({
//                 title: 'Create a Task',
//                 html: `
//                     <input type="text" id="task-name" class="swal2-input" placeholder="Task Name">
//                     <textarea id="task-description" class="swal2-textarea" placeholder="Task Description"></textarea>
//                 `,
//                 focusConfirm: false,
//                 preConfirm: () => {
//                     const taskName = document.getElementById('task-name').value;
//                     const taskDescription = document.getElementById('task-description').value;

//                     if (!taskName || !taskDescription) {
//                         Swal.showValidationMessage('Please enter both task name and description.');
//                         return false;
//                     }

//                     return { taskName, taskDescription };
//                 }
//             }).then((result) => {
//                 if (result.isConfirmed) {
//                     const { taskName, taskDescription } = result.value;
//                     const targetContainer = '.card-task.todo'; // Default container is 'Todo'
//                     createTask(taskName, taskDescription, targetContainer);
//                     saveTasksToLocalStorage();
//                 }
//             });
//         });

//         // Load tasks when the page loads
//         document.addEventListener('DOMContentLoaded', () => {
//             loadTasksFromLocalStorage();
//             initChart(); // Initialize chart after tasks are loaded
//         });


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