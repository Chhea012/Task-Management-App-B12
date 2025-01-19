const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");

// Sign-Up form
const sign_up_form = document.querySelector("#sign-up-form");
const sign_up_username = document.querySelector("#sign-up-username");
const sign_up_email = document.querySelector("#sign-up-email");
const sign_up_password = document.querySelector("#sign-up-password");

// Sign-In form
const sign_in_form = document.querySelector("#sign-in-form");
const sign_in_username = document.querySelector("#sign-in-username");
const sign_in_password = document.querySelector("#sign-in-password");

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
    // If user is already logged in, show a message or redirect as needed
    Swal.fire({
      icon: "success",
      title: "Welcome Back!",
      text: `You are already signed in as ${loggedInUser.username}`,
    });
    // Optionally, redirect or show login-related content
  }

  document.querySelector("#sign-in-form .btn").addEventListener("click", (event) => {
    event.preventDefault(); // Prevent form submission
  
    // Get input values
    const username = document.querySelector("#sign-in-username").value.trim();
    const password = document.querySelector("#sign-in-password").value.trim();
  
    if (username && password) {
      // Retrieve users from localStorage
      const users = JSON.parse(localStorage.getItem("users")) || [];
  
      // Check if the user exists and the password matches
      const user = users.find(
        (u) => u.username === username && u.password === password
      );
  
      if (user) {
        // Store the logged-in user data in localStorage
        localStorage.setItem("loggedInUser", JSON.stringify(user));
  
        // Show the SweetAlert and redirect after clicking OK with a 3-second delay
        Swal.fire({
          icon: "success",
          title: "Signed In Successfully",
          text: `Welcome back, ${username}!`,
        }).then(() => {
          // Wait 3 seconds before redirecting
          setTimeout(() => {
            window.location.href = "project/home.html";
          }, 2000); // 3000ms = 3 seconds
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Sign In Failed",
          text: "Invalid username or password.",
        });
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please fill in all fields!",
      });
    }
  });
  

  // Event listener for Sign Up button
  document
    .querySelector("#sign-up-form .btn")
    .addEventListener("click", (event) => {
      event.preventDefault(); // Prevent form submission

      // Get input values
      const username = document.querySelector("#sign-up-username").value.trim();
      const email = document.querySelector("#sign-up-email").value.trim();
      const password = document.querySelector("#sign-up-password").value.trim();

      if (username && email && password) {
        // Retrieve existing users from localStorage
        const users = JSON.parse(localStorage.getItem("users")) || [];

        // Check for duplicate username or email
        const userExists = users.some(
          (u) => u.username === username || u.email === email
        );

        if (userExists) {
          Swal.fire({
            icon: "error",
            title: "Sign Up Failed",
            text: "Username or email already exists!",
          });
        } else {
          // Add new user to the users array
          users.push({ username, email, password });

          // Save updated users array back to localStorage
          localStorage.setItem("users", JSON.stringify(users));

          Swal.fire({
            icon: "success",
            title: "Signed Up Successfully",
            text: `Welcome, ${username}! Your account has been created.`,
          }).then(() => {
            // Wait 3 seconds before redirecting
            setTimeout(() => {
              window.location.href = "project/home.html";
            }, 2000); 
        })
          // Clear form fields
          document.querySelector("#sign-up-form").reset();
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Please fill in all fields!",
        });
      }
    });
});
