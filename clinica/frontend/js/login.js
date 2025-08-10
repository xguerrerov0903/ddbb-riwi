// Handles login form functionality and validation.
import { get } from "./crud.js";

// Initializes the login functionality by setting up event listeners
export function initLogin() {
  // Check if the user is already logged in
  const loginDiv = document.querySelector(".login");
  const containerDiv = document.querySelector(".container");
  const storedUser = JSON.parse(localStorage.getItem("user"));

  // If user is logged in (in the localStorage is the info), redirect to events page
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin);
  }

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", handleLogout);
  }
}

// Handles user logout functionality
async function handleLogin(e) {
  e.preventDefault();
  const usuario = document.getElementById("usuario").value.trim();
  const contrasenia = document.getElementById("contrasenia").value.trim();

  try {
    // Fetch users from the API to validate login credentials
    const users = await get("http://localhost:3000/usuarios");
    const user = users.find(
      (u) => u.usuario === usuario && u.contrasenia === contrasenia
    );

    // If user is found, store user info in localStorage and redirect to events page
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
      window.location.href = "/citas"; // Redirect to citas page

      // If no user is found, display an error message
    } else {
      document.getElementById("loginError").textContent =
        "Usuario o contraseña incorrectos";
      document.getElementById("loginError").style.display = "block";
    }
  } catch (err) {
    console.error(err);
    document.getElementById("loginError").textContent = "Error en el servidor";
    document.getElementById("loginError").style.display = "block";
  }
}


