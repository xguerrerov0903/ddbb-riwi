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

const PORT = 3000;
app.listen(PORT, () => console.log(`API corriendo en http://localhost:${PORT}`));
