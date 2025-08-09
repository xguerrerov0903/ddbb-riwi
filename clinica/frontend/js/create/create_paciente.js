// Handles new course creation functionality.
import { post, get } from "../crud.js";

const url = "http://localhost:3000/pacientes";

// Event listener for the new event form submission
document
  .getElementById("newPacienteForm")
  .addEventListener("submit", async function (event) {
    // Prevent the default form submission behavior
    event.preventDefault();

    // Create a FormData object from the form
    const formData = new FormData(this);
    const paciente = Object.fromEntries(formData.entries());

    const todos = await get(url);
    const existe =
      Array.isArray(todos) &&
      todos.some(
        (p) =>
          (p.email || "").toLowerCase() === (paciente.email || "").toLowerCase()
      );

    if (existe) {
      alert(`Email ${paciente.email} ya está registrado.`);
      return;
    }

    // Post the new event data to the server
    try {
      await post(url, paciente);
      alert("Paciente agregado exitosamente");
      this.reset();
    } catch (error) {
      console.error("Error agregando paciente:", error);
    }
  });
