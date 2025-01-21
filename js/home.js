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
//logout
function confirmLogout() {
  // SweetAlert2 popup
  Swal.fire({
    title: "Do you want to logout?",
    text: "You will be redirected to the login page.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, Logout",
    cancelButtonText: "Cancel",
  }).then((result) => {
    if (result.isConfirmed) {
      // Redirect to the logout page if confirmed
      window.location.href = "../form.html";
    }
  });
}

// Select the add button and todo list
const addButton = document.querySelector('.bx-plus');
const todoList = document.querySelector('.todo-list');

// Add event listener to the "add" button
addButton.addEventListener('click', () => {
  // Display SweetAlert2 modal
  Swal.fire({
    title: 'Add Todo',
    html: `
            <input type="text" id="todo-title" class="swal2-input" placeholder="Todo Title">
            <textarea id="todo-description" class="swal2-textarea" placeholder="Todo Description"></textarea>
        `,
    focusConfirm: false,
    preConfirm: () => {
      const title = document.getElementById('todo-title').value.trim();
      const description = document.getElementById('todo-description').value.trim();

      if (!title) {
        Swal.showValidationMessage('Please enter a todo title.');
        return false;
      }

      return { title, description };
    }
  }).then((result) => {
    if (result.isConfirmed) {
      const { title, description } = result.value;

      // Create a new todo item
      const todoItem = document.createElement('li');
      todoItem.classList.add('todo-item');
      todoItem.innerHTML = `
                <span class="todo-title">${title}</span>
                <p class="todo-description">${description}</p>
                <div class="todo-actions">
                    <button class="mark-done-btn">Mark as Done</button>
                    <button class="edit-btn">Edit</button>
                    <button class="delete-btn">Delete</button>
                </div>
            `;

      // Append the todo item to the list
      todoList.appendChild(todoItem);

      // Add functionality for the buttons
      const markDoneButton = todoItem.querySelector('.mark-done-btn');
      const editButton = todoItem.querySelector('.edit-btn');
      const deleteButton = todoItem.querySelector('.delete-btn');

      // Mark as Done functionality
      markDoneButton.addEventListener('click', () => {
        const titleElement = todoItem.querySelector('.todo-title');
        const isDone = titleElement.classList.toggle('done');

        // Update button text based on the status
        if (isDone) {
          markDoneButton.textContent = 'Undo Mark as Done';
        } else {
          markDoneButton.textContent = 'Mark as Done';
        }
      });

      // Edit functionality
      editButton.addEventListener('click', () => {
        Swal.fire({
          title: 'Edit Todo',
          html: `
                        <input type="text" id="edit-title" class="swal2-input" value="${title}">
                        <textarea id="edit-description" class="swal2-textarea">${description}</textarea>
                    `,
          focusConfirm: false,
          preConfirm: () => {
            const newTitle = document.getElementById('edit-title').value.trim();
            const newDescription = document.getElementById('edit-description').value.trim();

            if (!newTitle) {
              Swal.showValidationMessage('Please enter a todo title.');
              return false;
            }

            return { newTitle, newDescription };
          }
        }).then((editResult) => {
          if (editResult.isConfirmed) {
            const { newTitle, newDescription } = editResult.value;
            todoItem.querySelector('.todo-title').textContent = newTitle;
            todoItem.querySelector('.todo-description').textContent = newDescription;
          }
        });
      });

      // Delete functionality
      deleteButton.addEventListener('click', () => {
        todoItem.remove();
      });
    }
  });
});

// Select the span element containing the number
const taskCountElement = document.querySelector('.data-task');
const increaseTaskButton = document.getElementById('increaseTask');

// Initialize the task count
let  taskCount = 0;

// Add an event listener to the button
increaseTaskButton.addEventListener('click', () => {
  addButton++; // Increment the task count
  taskCountElement.textContent = addButton; // Update the displayed number
});







// Select the add button and todo list
// const addButton = document.querySelector('.bx-plus');
// const todoList = document.querySelector('.todo-list');

// // Add event listener to the "add" button
// addButton.addEventListener('click', () => {
//     // Display SweetAlert2 modal
//     Swal.fire({
//         title: 'Add Todo',
//         html: `
//             <input type="text" id="todo-title" class="swal2-input" placeholder="Todo Title">
//             <textarea id="todo-description" class="swal2-textarea" placeholder="Todo Description"></textarea>
//         `,
//         focusConfirm: false,
//         preConfirm: () => {
//             const title = document.getElementById('todo-title').value.trim();
//             const description = document.getElementById('todo-description').value.trim();

//             if (!title) {
//                 Swal.showValidationMessage('Please enter a todo title.');
//                 return false;
//             }

//             return { title, description };
//         }
//     }).then((result) => {
//         if (result.isConfirmed) {
//             const { title, description } = result.value;

//             // Create a new todo item
//             const todoItem = document.createElement('li');
//             todoItem.classList.add('todo-item');
//             todoItem.innerHTML = `
//                 <span class="todo-title">${title}</span>
//                 <p class="todo-description">${description}</p>
//                 <div class="todo-actions">
//                     <button class="mark-done-btn">Mark as Done</button>
//                     <button class="edit-btn">Edit</button>
//                     <button class="delete-btn">Delete</button>
//                 </div>
//             `;

//             // Append the todo item to the list
//             todoList.appendChild(todoItem);

//             // Add functionality for the buttons
//             const markDoneButton = todoItem.querySelector('.mark-done-btn');
//             const editButton = todoItem.querySelector('.edit-btn');
//             const deleteButton = todoItem.querySelector('.delete-btn');

//             // Mark as Done functionality
//             markDoneButton.addEventListener('click', () => {
//                 const titleElement = todoItem.querySelector('.todo-title');
//                 titleElement.classList.toggle('done');
//                 markDoneButton.textContent = titleElement.classList.contains('done') ? 'Mark as Undone' : 'Mark as Done';
//             });

//             // Edit functionality
//             editButton.addEventListener('click', () => {
//                 Swal.fire({
//                     title: 'Edit Todo',
//                     html: `
//                         <input type="text" id="edit-title" class="swal2-input" value="${title}">
//                         <textarea id="edit-description" class="swal2-textarea">${description}</textarea>
//                     `,
//                     focusConfirm: false,
//                     preConfirm: () => {
//                         const newTitle = document.getElementById('edit-title').value.trim();
//                         const newDescription = document.getElementById('edit-description').value.trim();

//                         if (!newTitle) {
//                             Swal.showValidationMessage('Please enter a todo title.');
//                             return false;
//                         }

//                         return { newTitle, newDescription };
//                     }
//                 }).then((editResult) => {
//                     if (editResult.isConfirmed) {
//                         const { newTitle, newDescription } = editResult.value;
//                         todoItem.querySelector('.todo-title').textContent = newTitle;
//                         todoItem.querySelector('.todo-description').textContent = newDescription;
//                     }
//                 });
//             });

//             // Delete functionality
//             deleteButton.addEventListener('click', () => {
//                 todoItem.remove();
//             });
//         }
//     });
// });


