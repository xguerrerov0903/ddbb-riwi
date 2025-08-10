// backend/app.js
import express from 'express';
import cors from 'cors';
import { connection } from './db.js';
import {
  listCitas, getCita, createCita, updateCita, deleteCita,
} from './crud/citas_crud.js';
import {
  listPacientes, getPaciente, createPaciente, updatePaciente, deletePaciente,
} from './crud/pacientes_crud.js';
import {
  listMedicos, getMedico, createMedico, updateMedico, deleteMedico,
} from './crud/medicos_crud.js';
import {
  listUsuarios, getUsuario, createUsuario, updateUsuario, deleteUsuario
} from './crud/usuarios_crud.js';
import {
  filtrarCitasMedicoFechas,
  filtrarPacientes3Citas,
  filtrarMedicosCitas,
  filtrarMetodosPagoFechas,
} from './crud/consultas_crud.js';

const app = express();

// Si usas Vite en 5173:
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

app.get('/', (_req, res) => res.send('API OK 👋'));

// ---- Citas ----
app.get('/citas', listCitas);
app.get('/citas/:id', getCita);
app.post('/citas', createCita);
app.patch('/citas/:id', updateCita);
app.delete('/citas/:id', deleteCita);

// ---- Pacientes ----
app.get('/pacientes', listPacientes);
app.get('/pacientes/:id', getPaciente);
app.post('/pacientes', createPaciente);
app.patch('/pacientes/:id', updatePaciente);
app.delete('/pacientes/:id', deletePaciente);

// ---- Médicos ----
app.get('/medicos', listMedicos);
app.get('/medicos/:id', getMedico);
app.post('/medicos', createMedico);
app.patch('/medicos/:id', updateMedico);
app.delete('/medicos/:id', deleteMedico);

// ---- Usuarios ----
app.get('/usuarios', listUsuarios);
app.get('/usuarios/:id', getUsuario);
app.post('/usuarios', createUsuario);
app.patch('/usuarios/:id', updateUsuario);
app.delete('/usuarios/:id', deleteUsuario);

// ---- Consultas avanzadas ----
app.get('/consultas/citas-por-medico/:id_medico/:fecha_inicio/:fecha_fin', filtrarCitasMedicoFechas);
app.get('/consultas/pacientes-frecuentes', filtrarPacientes3Citas);
app.get('/consultas/medicos-citas', filtrarMedicosCitas);
app.get('/consultas/pagos-por-metodo/:fecha_inicio/:fecha_fin', filtrarMetodosPagoFechas);


const PORT = 3000;
app.listen(PORT, () => console.log(`API corriendo en http://localhost:${PORT}`));
