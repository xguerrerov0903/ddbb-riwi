// Handles new course creation functionality.
import { post, get } from "./crud.js";

const url = "http://localhost:3000/usuarios";

// Event listener for the new event form submission
document
  .getElementById("newUserForm")
  .addEventListener("submit", async function (event) {
    // Prevent the default form submission behavior
    event.preventDefault();

    // Create a FormData object from the form
    const formData = new FormData(this);
    const usuario = Object.fromEntries(formData.entries());

    const todos = await get(url);
    const existe =
      Array.isArray(todos) &&
      todos.some(
        (p) =>
          (p.usuario || "") === (usuario.usuario || "")
      );

    if (existe) {
      alert(`Usario ${usuario.usuario} ya está registrado.`);
      return;
    }

    // Post the new event data to the server
    try {
      await post(url, usuario);
      alert("usuario agregado exitosamente");
      this.reset();
    } catch (error) {
      console.error("Error agregando usuario:", error);
    }
  });
