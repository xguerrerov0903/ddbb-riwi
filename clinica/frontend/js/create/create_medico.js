// Handles new course creation functionality.
import { post } from "../crud.js";

const url = "http://localhost:3000/medicos";

// Event listener for the new event form submission
document
  .getElementById("newMedicoForm")
  .addEventListener("submit", async function (event) {
    // Prevent the default form submission behavior
    event.preventDefault();

    // Create a FormData object from the form
    const formData = new FormData(this);
    const medico = Object.fromEntries(formData.entries());

    // Post the new event data to the server
    try {
      await post(url, medico);
      alert("Medico agregado exitosamente");
      this.reset();
    } catch (error) {
      console.error("Error agregando medico:", error);
    }
  });
