const allSideMenu = document.querySelectorAll("#sidebar .side-menu.top li a");

allSideMenu.forEach((item) => {
  const li = item.parentElement;

  item.addEventListener("click", function () {
    allSideMenu.forEach((i) => {
      i.parentElement.classList.remove("active");
    });
    li.classList.add("active");
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
  let calendarEl = document.getElementById("calendar");
  let addEventBtn = document.getElementById("add-event-btn");

  let calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "dayGridMonth",
    selectable: true,
    editable: true,
    headerToolbar: {
      left: "prev,next today",
      center: "title",
      right: "dayGridMonth,timeGridWeek,timeGridDay"
    },
    events: loadEventsFromLocalStorage(),
    eventClick: function (info) {
      showEventOptions(info.event);
    }
  });

  calendar.render();

  function showEventOptions(event) {
    Swal.fire({
      title: "Edit Event",
      html: `
        <input type="text" id="edit-title" class="swal2-input" value="${event.title}" />
        <textarea id="edit-summary" class="swal2-textarea">${event.extendedProps.description || ''}</textarea>
      `,
      showCancelButton: true,
      showDenyButton: true,
      confirmButtonText: "Save",
      denyButtonText: "Delete",
      cancelButtonText: "Cancel",
      preConfirm: () => {
        let newTitle = document.getElementById("edit-title").value;
        let newSummary = document.getElementById("edit-summary").value;
        
        event.setProp("title", newTitle);
        event.setExtendedProp("description", newSummary);
        
        updateEventInLocalStorage(event);
      }
    }).then((result) => {
      if (result.isDenied) {
        confirmDeleteEvent(event);
      }
    });
  }

  function confirmDeleteEvent(event) {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel"
    }).then((deleteConfirm) => {
      if (deleteConfirm.isConfirmed) {
        event.remove();
        deleteEventFromLocalStorage(event);
        Swal.fire("Deleted!", "Your event has been removed.", "success");
      }
    });
  }

  function updateEventInLocalStorage(event) {
    let events = loadEventsFromLocalStorage();
    let index = events.findIndex(e => e.id === event.id);
    
    if (index !== -1) {
      events[index] = { ...events[index], title: event.title, description: event.extendedProps.description };
      localStorage.setItem("calendarEvents", JSON.stringify(events));
    }
  }

  function deleteEventFromLocalStorage(event) {
    let events = loadEventsFromLocalStorage().filter(e => e.id !== event.id);
    localStorage.setItem("calendarEvents", JSON.stringify(events));
  }

  function loadEventsFromLocalStorage() {
    return JSON.parse(localStorage.getItem("calendarEvents")) || [];
  }

  function saveEventToLocalStorage(event) {
    let events = loadEventsFromLocalStorage();
    events.push(event);
    localStorage.setItem("calendarEvents", JSON.stringify(events));
  }

  function createEventInputUI() {
    let eventInputContainer = document.createElement("div");
    eventInputContainer.classList.add("event-card");
    eventInputContainer.style.display = "none";

    let titleInput = document.createElement("input");
    titleInput.type = "text";
    titleInput.placeholder = "Event Title";

    let dateInput = document.createElement("input");
    dateInput.type = "datetime-local";

    let summaryInput = document.createElement("textarea");
    summaryInput.placeholder = "Event Summary (Optional)";
    summaryInput.rows = 4;

    let saveButton = document.createElement("button");
    saveButton.innerText = "Save";
    
    let cancelButton = document.createElement("button");
    cancelButton.innerText = "Cancel";
    
    eventInputContainer.append(titleInput, dateInput, summaryInput, saveButton, cancelButton);
    addEventBtn.after(eventInputContainer);

    addEventBtn.addEventListener("click", () => eventInputContainer.style.display = "inline-block");
    cancelButton.addEventListener("click", () => eventInputContainer.style.display = "none");
    saveButton.addEventListener("click", () => saveNewEvent(titleInput, dateInput, summaryInput, eventInputContainer));
  }

  function saveNewEvent(titleInput, dateInput, summaryInput, container) {
    let title = titleInput.value;
    let date = dateInput.value;
    let summary = summaryInput.value;

    if (title && date) {
      let eventDate = new Date(date);
      let newEvent = {
        id: Date.now().toString(),
        title,
        start: eventDate.toISOString(),
        description: summary || ""
      };

      calendar.addEvent({ ...newEvent, allDay: false });
      saveEventToLocalStorage(newEvent);
      checkEventTime(newEvent);

      container.style.display = "none";
      titleInput.value = "";
      dateInput.value = "";
      summaryInput.value = "";
    } else {
      alert("Please enter a title and date.");
    }
  }

  function checkEventTime(event) {
    let eventTime = new Date(event.start);
    let checkInterval = setInterval(() => {
      if (new Date().getTime() >= eventTime.getTime()) {
        clearInterval(checkInterval);
        Swal.fire({
          title: "Event Reminder!",
          text: `${event.title} is starting now at ${eventTime.toLocaleTimeString()}`,
          icon: "info",
          confirmButtonText: "Got it!",
          timer: 10000,
          timerProgressBar: true
        });
      }
    }, 10000);
  }

  function checkUpcomingEvents() {
    loadEventsFromLocalStorage().forEach(checkEventTime);
  }

  createEventInputUI();
  checkUpcomingEvents();
});
