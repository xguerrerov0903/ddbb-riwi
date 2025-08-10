import { get, get_id, deletes, update, post } from "./crud.js";

const url = "http://localhost:3000/pacientes";

// Carga inicial
export async function loadPacientes() {
  const pacientes = await get(url);
  printPacientes(pacientes);
  setupPacientesTableListener();
}

loadPacientes();

// Render de la tabla
function printPacientes(pacientes) {
  const tbody = document.getElementById("pacientesTableBody"); // mismo id que ya tienes
  tbody.innerHTML = pacientes
    .map(
      (p) => `
      <tr id="${p.id_paciente}">
        <td>${p.nombre}</td>
        <td>${p.email}</td>
        <td>
          <button type="button" value="edit">Editar</button>
          <button type="button" value="delete">Eliminar</button>
        </td>
      </tr>
    `
    )
    .join("");
}

function rePrintPaciente(p, tr) {
  tr.innerHTML = `
      <tr id="${p.id_paciente}">
        <td>${p.nombre}</td>
        <td>${p.email}</td>
        <td>
          <button type="button" value="edit">Editar</button>
          <button type="button" value="delete">Eliminar</button>
        </td>
      `;
}

// Hear the event submit (button) of the form
function setupPacientesTableListener() {
  const tbody = document.getElementById("pacientesTableBody");

  // Avoid multiple listeners: clone the node and replace it (removes listeners)
  const newTbody = tbody.cloneNode(true);
  tbody.parentNode.replaceChild(newTbody, tbody);

  newTbody.addEventListener("click", async function (event) {
    event.preventDefault();
    // Check if the clicked element is a button
    if (event.target.tagName !== "BUTTON") return;
    const tr = event.target.closest("tr");
    const id = tr.id;
    const action = event.target.value;
    // Check if the action is delete
    if (action === "delete") {
      await deletes(url, id);
      tr.remove();
    } else if (action === "edit") {
      editPaciente(id);
    } else if (action === "save_paciente") {
      const id = tr.id;
      // Mantén el mismo patrón por índices
      const inputs = tr.querySelectorAll("input");
      const nuevoNombre = inputs[0].value.trim();
      const nuevoEmail = inputs[1].value.trim();

      // Traer todos los pacientes
      const todos = await get(url);

      // Verificar si existe otro paciente con el mismo email
      const existe =
        Array.isArray(todos) &&
        todos.some(
          (p) =>
            p.email === nuevoEmail && p.id_paciente.toString() !== id.toString()
        );

      if (existe) {
        alert(`El email "${nuevoEmail}" ya está registrado en otro paciente.`);
        return;
      }

      // Obtener el paciente original
      const existingPaciente = await get_id(url, id);

      // Crear objeto actualizado
      const updatedPaciente = {
        ...existingPaciente,
        nombre: nuevoNombre,
        email: nuevoEmail,
      };
      // Update cita in DB
      await update(url, id, updatedPaciente);
      rePrintPaciente(updatedPaciente, tr);
    } else {
      const original = await get_id(url, id);
      rePrintPaciente(original, tr);
    }
  });
  // If the user is not an admin, listen for enroll actions
}

// Function to edit an event
// This function replaces the event row with input fields for editing
async function editPaciente(id) {
  const pacienteContainer = document.getElementById(id);
  const paciente = await get_id(url, id);
  pacienteContainer.innerHTML = `
        <td>${paciente.id_paciente}</td>
    <td><input type="text" value="${paciente.nombre}" /></td>
    <td><input type="email" value="${paciente.email}" /></td>
    <td>
      <button type="button" value="save_paciente">Guardar</button>
      <button type="button" value="cancel_edit">Cancelar</button>
    </td>
    `;
}
