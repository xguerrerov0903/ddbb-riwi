import { get, get_id, deletes, update, post } from "./crud.js";

const url = "http://localhost:3000/medicos";

// Carga inicial
export async function loadMedicos() {
  const medicos = await get(url);
  printMedicos(medicos);
  setupMedicosTableListener();
}

loadMedicos();

// Render de la tabla
function printMedicos(medicos) {
  const tbody = document.getElementById("medicosTableBody"); // mismo id que ya tienes
  tbody.innerHTML = medicos
    .map(
      (m) => `
      <tr id="${m.id_medico}">
        <td>${m.id_medico}</td>
        <td>${m.nombre}</td>
        <td>${m.especialidad}</td>
        <td>
          <button type="button" value="edit">Editar</button>
          <button type="button" value="delete">Eliminar</button>
        </td>
      </tr>
    `
    )
    .join("");
}

function rePrintMedico(m, tr) {
  tr.innerHTML = `
        <tr id="${m.id_medico}">
        <td>${m.id_medico}</td>
        <td>${m.nombre}</td>
        <td>${m.especialidad}</td>
        <td>
          <button type="button" value="edit">Editar</button>
          <button type="button" value="delete">Eliminar</button>
        </td>
      </tr>
    `;

}

// Hear the event submit (button) of the form
function setupMedicosTableListener() {
  const tbody = document.getElementById("medicosTableBody");

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
      tr.remove(); // elimina solo esta fila, no repintes toda la tabla
    } else if (action === "edit") {
      editMedico(id);
    } else if (action === "save-medico") {
      const id = tr.id;
      // Mantén el mismo patrón por índices
      const inputs = tr.querySelectorAll("input"); // 0:id_paciente, 1:id_medico, 2:fecha, 3:hora, 4:motivo, 5:descripcion
      const existingMedico = await get_id(url, id);
      const updatedMedico = {
        // Usa los datos existentes y actualiza lo editado
        ...existingMedico,
        nombre: inputs[0].value,
        especialidad: inputs[1].value,
      };
      // Update cita in DB
      await update(url, id, updatedMedico);
      rePrintMedico(updatedMedico, tr);
    } else {
      // This case es cancel so dont edit the event
      const original = await get_id(url, id);
      rePrintMedico(original, tr);
    }
  });
  // If the user is not an admin, listen for enroll actions
}

// Function to edit an event
// This function replaces the event row with input fields for editing
async function editMedico(id) {
  const medicoContainer = document.getElementById(id);
  const medico = await get_id(url, id);
  medicoContainer.innerHTML = `
        <td>${medico.id_medico}</td>
    <td><input type="text" value="${medico.nombre}" /></td>
    <td><input type="text" value="${medico.especialidad}" /></td>
    <td>
      <button type="button" value="save-medico">Guardar</button>
      <button type="button" value="cancel-edit">Cancelar</button>
    </td>
    `;
}
