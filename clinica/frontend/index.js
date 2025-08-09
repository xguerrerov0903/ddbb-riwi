// Main script to handle SPA routing and logic.

// Define the routes for the application
const routes = {
  "/": "/citas.html",
  "/citas": "/citas.html",
  "/medicos": "/medicos.html",
  "/pacientes": "/pacientes.html",
  "/create/create_cita": "/create/create_cita.html",
  "/create/create_medico": "/create/create_medico.html",
  "/create/create_paciente": "/create/create_paciente.html"
  /*  
    
    "/create/create-medico": "/create/create-medico.html",
    "/create/create-paciente": "/create/create-paciente.html",
    "/login": "/login.html",*/
};

// Function to handle navigation and load the appropriate content
document.body.addEventListener("click", (e) => {
  if (e.target.matches("[data-link]")) {
    e.preventDefault();
    navigate(e.target.getAttribute("href"));
  } 
});

// Handle logout button click
const logoutButton = document.getElementById("logoutButton");

// Event listener of the logout button
logoutButton.addEventListener("click", function () {
  // Clear user data from localStorage and redirect to login page
  localStorage.removeItem("user"); 
  window.location.href = "/login"; 
});


// Function to navigate to a specific path and load the corresponding content
async function navigate(pathname) {
  const route = routes[pathname];
  const html = await fetch(route).then((res) => res.text());
  document.getElementById("content").innerHTML = html;
  history.pushState({}, "", pathname);

  const user = JSON.parse(localStorage.getItem("user"));

  // The views are protected by the user permissions
  if (pathname === "/" || pathname === "/citas") {
    import("./js/citas.js").then((module) => {
      module.loadCitas();
    });
  } else if (pathname === "/medicos") {
    import("./js/medicos.js").then((module) => {
      module.loadMedicos();
    });
    } else if (pathname === "/pacientes") {
    import("./js/pacientes.js").then((module) => {
      module.loadPacientes();
    })
} else if (pathname === "/create/create_cita") {
  import("./js/create/create_cita.js")
} else if (pathname === "/create/create_medico") {
  import("./js/create/create_medico.js")
}else if (pathname === "/create/create_paciente") {
  import("./js/create/create_paciente.js")
}


}

window.addEventListener("popstate", () => navigate(location.pathname));

document.addEventListener("DOMContentLoaded", () => {
  navigate(location.pathname);
});


