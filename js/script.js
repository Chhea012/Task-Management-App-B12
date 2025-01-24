// Store projects and their tasks
let projects = JSON.parse(localStorage.getItem('projects')) || {};

// Save the projects to localStorage
function saveProjectsToLocalStorage() {
  localStorage.setItem('projects', JSON.stringify(projects));
}

// Open a modal
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.style.display = 'block';
}

// Close a modal
function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.style.display = 'none';
}

// Add a new project
function addProject() {
  const projectNameInput = document.getElementById('project-name');
  const projectName = projectNameInput.value.trim();
  if (projectName && !projects[projectName]) {
    // Create a new project in the data structure
    projects[projectName] = [];
    // Save to localStorage
    saveProjectsToLocalStorage();
    // Add the project to both the main list and dropdown
    addProjectToListAndDropdown(projectName);
    // Clear input and close the modal
    projectNameInput.value = '';
    closeModal('add-project-modal');
  } else if (projects[projectName]) {
    alert('Project name already exists!');
  } else {
    alert('Please enter a valid project name!');
  }
}

// Add a project to both the main list and dropdown
function addProjectToListAndDropdown(projectName) {
  // Add to the main project list (button)
  addProjectButton(projectName);
  // Add to the dropdown list
  addProjectDropdownItem(projectName);
}

// Show tasks for the selected project
function showProject(projectName) {
  activeProject = projectName;
  // Update the project title
  const projectTitle = document.getElementById('current-project-title');
  projectTitle.innerText = `Tasks for ${projectName}`;
  // Show the "Add Task" button
  const addTaskButton = document.getElementById('add-task-button');
  addTaskButton.style.display = 'block';
  // Display the tasks
  renderTaskList(projectName);
}

// Add a task to the active project
function addTask() {
  if (!activeProject) {
    alert('Please select a project first!');
    closeModal('add-task-modal');
    return;
  }
  const taskTitleInput = document.getElementById('task-title');
  const taskDescInput = document.getElementById('task-desc');
  const taskTitle = taskTitleInput.value.trim();
  const taskDesc = taskDescInput.value.trim();
  if (taskTitle) {
    // Add the task to the current project
    projects[activeProject].push({ title: taskTitle, description: taskDesc });
    // Save to localStorage
    saveProjectsToLocalStorage();
    // Refresh the task list for the current project
    renderTaskList(activeProject);
    // Clear inputs and close the modal
    taskTitleInput.value = '';
    taskDescInput.value = '';
    closeModal('add-task-modal');
  } else {
    alert('Please enter a valid task title!');
  }
}

// Delete a task from a project
function deleteTask(projectName, taskIndex) {
  projects[projectName].splice(taskIndex, 1);
  // Save to localStorage
  saveProjectsToLocalStorage();
  renderTaskList(projectName); // Refresh the task list
}

// Edit a task in a project
function editTask(projectName, taskIndex) {
  const task = projects[projectName][taskIndex];
  const newTitle = prompt('Edit Task Title', task.title);
  const newDesc = prompt('Edit Task Description', task.description);
  if (newTitle !== null && newTitle.trim() !== '') {
    task.title = newTitle.trim();
    if (newDesc !== null) task.description = newDesc.trim();
    // Save to localStorage
    saveProjectsToLocalStorage();
    renderTaskList(projectName); // Refresh the task list
  }
}

// Edit a project name
function editProject(projectName) {
  const newName = prompt('Edit Project Name', projectName);
  if (newName && newName.trim() !== '' && !projects[newName]) {
    // Update the project name in the data structure
    projects[newName] = projects[projectName];
    delete projects[projectName];
    // Save to localStorage
    saveProjectsToLocalStorage();
    // Refresh the project list
    renderProjectList();
    activeProject = null; // Reset active project
    document.getElementById('current-project-title').innerText = 'Select a project to view its tasks';
  } else if (projects[newName]) {
    alert('Project name already exists!');
  }
}

// Delete a project and its tasks
function deleteProject(projectName) {
  const confirmation = confirm('Are you sure you want to delete this project and all its tasks?');

  if (confirmation) {
    // Delete the project and its tasks
    delete projects[projectName];
    // Save the updated projects to localStorage
    saveProjectsToLocalStorage();
    // Refresh the project list
    renderProjectList();

    // If a project was active and the active project was deleted, clear active project
    if (activeProject === projectName) {
      activeProject = null;
      document.getElementById('current-project-title').innerText = 'Select a project to view its tasks';
    }
  }
}

// Render the project list (buttons and dropdown)
function renderProjectList() {
  const projectList = document.getElementById('project-list');
  const projectsDropdown = document.getElementById('projects-dropdown');

  projectList.innerHTML = '';
  projectsDropdown.innerHTML = '';

  // Loop through all projects to create buttons and dropdown items
  for (const projectName in projects) {
    addProjectButton(projectName);
    addProjectDropdownItem(projectName);
  }
}

// Add a project button to the main list
function addProjectButton(projectName) {
  const projectList = document.getElementById('project-list');
  const projectDiv = document.createElement('div');
  projectDiv.className = 'd-flex align-items-center gap-2';

  const projectButton = document.createElement('button');
  projectButton.className = 'btn btn-outline-primary';
  projectButton.innerText = projectName;
  projectButton.onclick = () => showProject(projectName);

  const editIcon = document.createElement('span');
  editIcon.className = 'bi bi-pencil-square'; // Bootstrap edit icon
  editIcon.style.cursor = 'pointer';
  editIcon.onclick = (e) => { 
    e.stopPropagation();
    editProject(projectName); // Edit project name
  };

  const deleteIcon = document.createElement('span');
  deleteIcon.className = 'bi bi-trash'; // Bootstrap trash icon
  deleteIcon.style.cursor = 'pointer';
  deleteIcon.onclick = (e) => { 
    e.stopPropagation();
    deleteProject(projectName); // Delete project
  };

  projectDiv.appendChild(projectButton);
  projectDiv.appendChild(editIcon);
  projectDiv.appendChild(deleteIcon);
  projectList.appendChild(projectDiv);
}

// Add a project item to the dropdown
function addProjectDropdownItem(projectName) {
  const projectsDropdown = document.getElementById('projects-dropdown');
  const dropdownItem = document.createElement('li');
  const dropdownLink = document.createElement('a');
  dropdownLink.className = 'dropdown-item';
  dropdownLink.innerText = projectName;
  dropdownLink.onclick = () => showProject(projectName);
  dropdownItem.appendChild(dropdownLink);
  projectsDropdown.appendChild(dropdownItem);
}

// function renderTaskList(projectName) {
//   const taskList = document.getElementById('task-list');
//   taskList.innerHTML = '';

//   const tasks = projects[projectName] || [];
//   tasks.forEach((task) => {
//     const taskItem = document.createElement('li');
//     taskItem.className = 'list-group-item';
//     taskItem.setAttribute('draggable', 'true'); // Make tasks draggable
//     taskItem.id = `task-${Math.random().toString(36).substr(2, 9)}`; // Unique ID for task

//     // Updated task structure
//     const newTaskHtml = `
//       <main id="main-content">
//         <div class="content-flex">
//           <div class="main-content todo" data-section="todo">
//             <div class="card-task todo" data-section="todo">
//               <div class="card-btn">
//                 <button class="circle btn-todo"></button>
//                 <h5>Todo</h5>
//               </div>
//               <p>${task.description}</p>
//               <div class="add-task">
//                 <button class="add-task-btn" data-section="todo">
//                   <i class='bx bx-plus'></i>Add item
//                 </button>
//               </div>
//             </div>
//           </div>
//           <div class="main-content in-progress" data-section="in-progress">
//             <div class="card-task in-progress" data-section="in-progress">
//               <div class="card-btn">
//                 <button class="circle-progress btn-in-progress"></button>
//                 <h5>In progress</h5>
//               </div>
//               <p>${task.description}</p>
//               <div class="add-task">
//                 <button class="add-task-btn" data-section="in-progress">
//                   <i class='bx bx-plus'></i>Add item
//                 </button>
//               </div>
//             </div>
//           </div>
//           <div class="main-content done" data-section="done">
//             <div class="card-task done" data-section="done">
//               <div class="card-btn">
//                 <button class="circle-done btn-done"></button>
//                 <h5>Done</h5>
//               </div>
//               <p>${task.description}</p>
//               <div class="add-task">
//                 <button class="add-task-btn" data-section="done">
//                   <i class='bx bx-plus'></i>Add item
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>
//     `;

//     taskItem.innerHTML = `<strong>${task.title}</strong><br>${newTaskHtml}`;
//     taskList.appendChild(taskItem);

//     // Enable drag-and-drop for the task item
//     enableDragAndDrop(taskItem);
//   });

//   // Add click event listeners to "Add item" buttons
//   const addTaskButtons = document.querySelectorAll('.add-task-btn');
//   addTaskButtons.forEach((button) => {
//     button.addEventListener('click', (event) => {
//       const section = event.target.closest('.add-task-btn').dataset.section;
//       showAddTaskModal(section);
//     });
//   });
// }

// // Function to dynamically create and show the modal
// function showAddTaskModal(section) {
//   // Remove any existing modal
//   const existingModal = document.getElementById('addTaskModal');
//   if (existingModal) {
//     existingModal.remove();
//   }

//   // Create the modal dynamically
//   const modalHtml = `
//     <div class="modal fade" id="addTaskModal" tabindex="-1" aria-labelledby="addTaskModalLabel" aria-hidden="true">
//       <div class="modal-dialog">
//         <div class="modal-content">
//           <div class="modal-header">
//             <h5 class="modal-title" id="addTaskModalLabel">Add New Task</h5>
//             <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
//           </div>
//           <div class="modal-body">
//             <form id="addTaskForm">
//               <div class="mb-3">
//                 <label for="taskTitle" class="form-label">Task Title</label>
//                 <input type="text" class="form-control" id="taskTitle" required>
//               </div>
//               <div class="mb-3">
//                 <label for="taskDescription" class="form-label">Task Description</label>
//                 <textarea class="form-control" id="taskDescription" rows="3" required></textarea>
//               </div>
//               <input type="hidden" id="taskSection" value="${section}">
//               <button type="submit" class="btn btn-primary">Add Task</button>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   `;

//   // Append the modal to the body
//   document.body.insertAdjacentHTML('beforeend', modalHtml);

//   // Initialize the modal
//   const modalElement = document.getElementById('addTaskModal');
//   const bootstrapModal = new bootstrap.Modal(modalElement);
//   bootstrapModal.show();

//   // Attach event listener to the form
//   document.getElementById('addTaskForm').addEventListener('submit', (event) => {
//     event.preventDefault();

//     // Get form data
//     const taskTitle = document.getElementById('taskTitle').value;
//     const taskDescription = document.getElementById('taskDescription').value;
//     const taskSection = document.getElementById('taskSection').value;

//     // Determine button color based on section
//     let buttonColorClass = '';
//     if (taskSection === 'todo') {
//       buttonColorClass = 'btn-todo';
//     } else if (taskSection === 'in-progress') {
//       buttonColorClass = 'btn-in-progress';
//     } else if (taskSection === 'done') {
//       buttonColorClass = 'btn-done';
//     }

//     // Create a new task element
//     const newTask = document.createElement('div');
//     newTask.className = 'task';
//     newTask.setAttribute('draggable', 'true');
//     newTask.innerHTML = `
//       <div class="btn-task">
//           <div class="task-flex">
//               <button class="do-done ${buttonColorClass}"></button>
//               <h5>${taskTitle}</h5>
//           </div>
//           <i class='bx bx-dots-horizontal-rounded icons'></i>
//       </div>
//       <p>${taskDescription}</p>
//     `;

//     // Append the new task to the appropriate section
//     const sectionContainer = document.querySelector(`.card-task.${taskSection}`);
//     sectionContainer.appendChild(newTask);

//     // Enable drag-and-drop for the new task
//     enableDragAndDrop(newTask);

//     // Remove the modal
//     bootstrapModal.hide();
//     modalElement.remove();
//   });
// }

// // Drag-and-Drop Functionality
// function enableDragAndDrop(taskItem) {
//   taskItem.setAttribute('draggable', 'true');

//   taskItem.addEventListener('dragstart', (event) => {
//     event.dataTransfer.setData('text/plain', event.target.id);
//     event.dataTransfer.effectAllowed = 'move';
//     event.target.classList.add('dragging');
//   });

//   taskItem.addEventListener('dragend', (event) => {
//     event.target.classList.remove('dragging');
//   });

//   // Add event listeners to drop zones (todo, in-progress, done)
//   const dropZones = document.querySelectorAll('.card-task');
//   dropZones.forEach((dropZone) => {
//     dropZone.addEventListener('dragover', (event) => {
//       event.preventDefault();
//       event.dataTransfer.dropEffect = 'move';
//       dropZone.classList.add('drop-hover');
//     });

//     dropZone.addEventListener('dragleave', () => {
//       dropZone.classList.remove('drop-hover');
//     });

//     dropZone.addEventListener('drop', (event) => {
//       event.preventDefault();
//       const draggedTaskId = event.dataTransfer.getData('text/plain');
//       const draggedTask = document.getElementById(draggedTaskId);

//       // Determine the new section
//       const newSection = dropZone.dataset.section;

//       // Update the task button's color
//       const button = draggedTask.querySelector('.do-done');
//       button.classList.remove('btn-todo', 'btn-in-progress', 'btn-done');
//       if (newSection === 'todo') {
//         button.classList.add('btn-todo');
//       } else if (newSection === 'in-progress') {
//         button.classList.add('btn-in-progress');
//       } else if (newSection === 'done') {
//         button.classList.add('btn-done');
//       }
//       // Append the task to the new section
//       dropZone.appendChild(draggedTask);
//       dropZone.classList.remove('drop-hover');
//     });
//   });
// }
// // Initialize the project list on page load
// window.onload = renderProjectList;


function renderTaskList(projectName) {
  const taskList = document.getElementById('task-list');
  taskList.innerHTML = '';

  const tasks = projects[projectName] || [];
  tasks.forEach((task) => {
    const taskItem = document.createElement('li');
    taskItem.className = 'list-group-item';
    taskItem.setAttribute('draggable', 'true'); // Make tasks draggable
    taskItem.id = `task-${Math.random().toString(36).substr(2, 9)}`; // Unique ID for task

    // Updated task structure
    const newTaskHtml = `
      <main id="main-content">
        <div class="content-flex">
          <div class="main-content todo" data-section="todo">
            <div class="card-task todo" data-section="todo">
              <div class="card-btn">
                <button class="circle btn-todo"></button>
                <h5>Todo (<span id="todo-count">0</span>)</h5> <!-- Counter for Todo -->
              </div>
              <div class="add-task">
                <button class="add-task-btn" data-section="todo">
                  <i class='bx bx-plus'></i>Add item
                </button>
              </div>
            </div>
          </div>
          <div class="main-content in-progress" data-section="in-progress">
            <div class="card-task in-progress" data-section="in-progress">
              <div class="card-btn">
                <button class="circle-progress btn-in-progress"></button>
                <h5>In Progress (<span id="in-progress-count">0</span>)</h5> <!-- Counter for In Progress -->
              </div>
              <div class="add-task">
                <button class="add-task-btn" data-section="in-progress">
                  <i class='bx bx-plus'></i>Add item
                </button>
              </div>
            </div>
          </div>
          <div class="main-content done" data-section="done">
            <div class="card-task done" data-section="done">
              <div class="card-btn">
                <button class="circle-done btn-done"></button>
                <h5>Done (<span id="done-count">0</span>)</h5> <!-- Counter for Done -->
              </div>
              <div class="add-task">
                <button class="add-task-btn" data-section="done">
                  <i class='bx bx-plus'></i>Add item
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    `;

    taskItem.innerHTML = `<strong>${task.title}</strong><br>${newTaskHtml}`;
    taskList.appendChild(taskItem);

    // Enable drag-and-drop for the task item
    enableDragAndDrop(taskItem);
  });

  // Update all task counts initially
  updateTaskCounts();

  // Add click event listeners to "Add item" buttons
  const addTaskButtons = document.querySelectorAll('.add-task-btn');
  addTaskButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
      const section = event.target.closest('.add-task-btn').dataset.section;
      showAddTaskModal(section);
    });
  });
}

// Update Task Counts
function updateTaskCounts() {
  const todoCount = document.querySelectorAll('.card-task.todo .task').length;
  const inProgressCount = document.querySelectorAll('.card-task.in-progress .task').length;
  const doneCount = document.querySelectorAll('.card-task.done .task').length;

  document.getElementById('todo-count').innerText = todoCount;
  document.getElementById('in-progress-count').innerText = inProgressCount;
  document.getElementById('done-count').innerText = doneCount;
}

// Function to dynamically create and show the modal
function showAddTaskModal(section) {
  const existingModal = document.getElementById('addTaskModal');
  if (existingModal) {
    existingModal.remove();
  }

  const modalHtml = `
    <div class="modal fade" id="addTaskModal" tabindex="-1" aria-labelledby="addTaskModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="addTaskModalLabel">Add New Task</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form id="addTaskForm">
              <div class="mb-3">
                <label for="taskTitle" class="form-label">Task Title</label>
                <input type="text" class="form-control" id="taskTitle" required>
              </div>
              <div class="mb-3">
                <label for="taskDescription" class="form-label">Task Description</label>
                <textarea class="form-control" id="taskDescription" rows="3" required></textarea>
              </div>
              <input type="hidden" id="taskSection" value="${section}">
              <button type="submit" class="btn btn-primary">Add Task</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHtml);

  const modalElement = document.getElementById('addTaskModal');
  const bootstrapModal = new bootstrap.Modal(modalElement);
  bootstrapModal.show();

  document.getElementById('addTaskForm').addEventListener('submit', (event) => {
    event.preventDefault();

    const taskTitle = document.getElementById('taskTitle').value;
    const taskDescription = document.getElementById('taskDescription').value;
    const taskSection = document.getElementById('taskSection').value;

    let buttonColorClass = '';
    if (taskSection === 'todo') {
      buttonColorClass = 'btn-todo';
    } else if (taskSection === 'in-progress') {
      buttonColorClass = 'btn-in-progress';
    } else if (taskSection === 'done') {
      buttonColorClass = 'btn-done';
    }

    const newTask = document.createElement('div');
    newTask.className = 'task';
    newTask.setAttribute('draggable', 'true');
    newTask.innerHTML = `
      <div class="btn-task">
          <div class="task-flex">
              <button class="do-done ${buttonColorClass}"></button>
              <h5>${taskTitle}</h5>
          </div>
          <i class='bx bx-dots-horizontal-rounded icons'></i>
      </div>
      <p>${taskDescription}</p>
    `;

    const sectionContainer = document.querySelector(`.card-task.${taskSection}`);
    sectionContainer.appendChild(newTask);

    enableDragAndDrop(newTask);

    updateTaskCounts();

    bootstrapModal.hide();
    modalElement.remove();
  });
}

// Enable Drag-and-Drop and Update Counts
function enableDragAndDrop(taskItem) {
  taskItem.setAttribute('draggable', 'true');

  taskItem.addEventListener('dragstart', (event) => {
    event.dataTransfer.setData('text/plain', event.target.id);
    event.dataTransfer.effectAllowed = 'move';
    event.target.classList.add('dragging');
  });

  taskItem.addEventListener('dragend', (event) => {
    event.target.classList.remove('dragging');
  });

  const dropZones = document.querySelectorAll('.card-task');
  dropZones.forEach((dropZone) => {
    dropZone.addEventListener('dragover', (event) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = 'move';
      dropZone.classList.add('drop-hover');
    });

    dropZone.addEventListener('dragleave', () => {
      dropZone.classList.remove('drop-hover');
    });

    dropZone.addEventListener('drop', (event) => {
      event.preventDefault();
      const draggedTaskId = event.dataTransfer.getData('text/plain');
      const draggedTask = document.getElementById(draggedTaskId);

      const newSection = dropZone.dataset.section;

      const button = draggedTask.querySelector('.do-done');
      button.classList.remove('btn-todo', 'btn-in-progress', 'btn-done');
      if (newSection === 'todo') {
        button.classList.add('btn-todo');
      } else if (newSection === 'in-progress') {
        button.classList.add('btn-in-progress');
      } else if (newSection === 'done') {
        button.classList.add('btn-done');
      }

      dropZone.appendChild(draggedTask);
      dropZone.classList.remove('drop-hover');

      updateTaskCounts();
    });
  });
}

// Initialize the project list on page load
window.onload = renderProjectList;
