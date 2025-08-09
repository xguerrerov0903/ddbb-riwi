import { get, get_id, deletes, update, post } from "./crud.js";

const url = "http://localhost:3000/pacientes";

// Carga inicial
export async function loadPacientes() {
  const pacientes = await get(url);
  printPacientes(pacientes);
  setupPacientesTableListener
  ();
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
      const updatePacientes = await get(url);
      printPacientes(updatePacientes);
    } else if (action === "edit") {
      editPaciente(id);
    } else if (action === "save_paciente") {
      const id = tr.id;
      // Mantén el mismo patrón por índices
      const inputs = tr.querySelectorAll("input"); // 0:id_paciente, 1:id paciente, 2:fecha, 3:hora, 4:motivo, 5:descripcion
      const existingPaciente = await get_id(url, id);
      const updatedPaciente = {
        // Usa los datos existentes y actualiza lo editado
        ...existingPaciente,
        nombre: inputs[0].value,
        email: inputs[1].value
      };
      // Update cita in DB
      await update(url, id, updatedPaciente);

      // Reprint pacientes after update
      const updatePacientes = await get(url);
      printPacientes(updatePacientes);
    } else {
      // This case es cancel so dont edit the event
      const updatePaciente = await get(url);
      // Reprint the events without changes
      printPacientes(updatePaciente);
    }
  });
  // If the user is not an admin, listen for enroll actions
}

// Function to edit an event
// This function replaces the event row with input fields for editing
async function editPaciente(id) {
  const pacienteContainer = document.getElementById(id);
  const paciente = await get_id(url, id);
  pacienteContainer.innerHTML =  `
        <td>${paciente.id_paciente}</td>
    <td><input type="text" value="${paciente.nombre}" /></td>
    <td><input type="email" value="${paciente.email}" /></td>
    <td>
      <button type="button" value="save-paciente">Guardar</button>
      <button type="button" value="cancel-edit">Cancelar</button>
    </td>
    `;
}
