const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");

// Toggle between Sign-In and Sign-Up
sign_up_btn.addEventListener("click", () => {
  container.classList.add("sign-up-mode");
});

sign_in_btn.addEventListener("click", () => {
  container.classList.remove("sign-up-mode");
});

document.addEventListener("DOMContentLoaded", () => {
  // Check if the user is already signed in
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  if (loggedInUser) {
    Swal.fire({
      title: 'Welcome Back!',
      text: `You are already signed in as ${loggedInUser.username}.`,
      icon: 'info',
      confirmButtonText: 'OK'
    });
    // Optionally redirect here
  }

  // Sign-In Form Validation
  document.querySelector("#sign-in-form .btn").addEventListener("click", (event) => {
    event.preventDefault(); // Prevent form submission

    // Get input values
    const username = document.querySelector("#sign-in-username").value.trim();
    const password = document.querySelector("#sign-in-password").value.trim();
    let errorMessage = "";

    if (!username) {
      errorMessage = "Username is required.";
    } else if (!password) {
      errorMessage = "Password is required.";
    } else {
      // Retrieve users from localStorage
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const user = users.find((u) => u.username === username && u.password === password);

      if (user) {
        // Store the logged-in user data in localStorage
        localStorage.setItem("loggedInUser", JSON.stringify(user));

        Swal.fire({
          title: 'Signed In Successfully!',
          text: `Welcome back, ${username}.`,
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          window.location.href = "pages/home.html";
        });
        return; // Stop execution here to avoid showing an error message
      } else {
        errorMessage = "Invalid username or password.";
      }
    }

    // Show error message
    if (errorMessage) {
      const errorDiv = document.querySelector("#sign-in-form .error-message");
      errorDiv.textContent = errorMessage;
      errorDiv.style.display = "block"; // Show error message
    }
  });

  // Sign-Up Form Validation
  document.querySelector("#sign-up-form .btn").addEventListener("click", (event) => {
    event.preventDefault(); // Prevent form submission

    // Get input values
    const username = document.querySelector("#sign-up-username").value.trim();
    const email = document.querySelector("#sign-up-email").value.trim();
    const password = document.querySelector("#sign-up-password").value.trim();
    let errorMessage = "";

    if (!username) {
      errorMessage = "Username is required.";
    } else if (!email) {
      errorMessage = "Email is required.";
    } else if (!email.includes("@") || !email.includes(".")) {
      errorMessage = "Invalid email format.";
    } else if (!password) {
      errorMessage = "Password is required.";
    } else if (password.length < 6) {
      errorMessage = "Password must be at least 6 characters.";
    } else {
      // Retrieve existing users from localStorage
      const users = JSON.parse(localStorage.getItem("users")) || [];

      // Check for duplicate username or email
      const userExists = users.some((u) => u.username === username || u.email === email);

      if (userExists) {
        errorMessage = "Username or email already exists.";
      } else {
        // Add new user to the users array
        users.push({ username, email, password });

        // Save updated users array back to localStorage
        localStorage.setItem("users", JSON.stringify(users));

        Swal.fire({
          title: 'Signed Up Successfully!',
          text: `Welcome, ${username}.`,
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          window.location.href = "pages/home.html";
        });
        return; // Stop execution here to avoid showing an error message
      }
    }

    // Show error message
    if (errorMessage) {
      const errorDiv = document.querySelector("#sign-up-form .error-message");
      errorDiv.textContent = errorMessage;
      errorDiv.style.display = "block"; // Show error message
    }
  });
});
