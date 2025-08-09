// Handles new course creation functionality.
import { post, get_id } from "../crud.js";

const url = "http://localhost:3000/citas";
const url_paciente = "http://localhost:3000/pacientes";
const url_medico = "http://localhost:3000/medicos";


// Event listener for the new event form submission

document
  .getElementById("newCitaForm")
  .addEventListener("submit", async function (event) {
    // Prevent the default form submission behavior
    event.preventDefault();

    // Create a FormData object from the form
    const formData = new FormData(this);
    const user = Object.fromEntries(formData.entries());

      // Asegura números
  const id_paciente = user.id_paciente ? Number(user.id_paciente) : null;
  const id_medico   = user.id_medico   ? Number(user.id_medico)   : null;

  // Reglas: ambos deben existir (ajusta si quieres que sea solo uno)
  if (!id_paciente || !id_medico) {
    alert("Debes ingresar ID de paciente y médico.");
    return;
  }

  const [pacienteOK, medicoOK] = await Promise.all([
    get_id(url_paciente, id_paciente),
    get_id(url_medico, id_medico),
  ]);

  if (!pacienteOK || pacienteOK.error) {
    alert(`El paciente con id ${id_paciente} no existe.`);
    return;
  }
  if (!medicoOK || medicoOK.error) {
    alert(`El médico con id ${id_medico} no existe.`);
    return;
  }
    // Post the new event data to the server
    try {
      await post(url, user);
      alert("Cita agregada exitosamente");
      this.reset();
    } catch (error) {
      console.error("Error creando la cita:", error);
    }
  });

