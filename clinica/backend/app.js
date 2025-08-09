// backend/app.js
import express from 'express';
import cors from 'cors';
import { connection } from './db.js';
import {
  listCitas,
  getCita,
  createCita,
  updateCita,
  deleteCita,
} from './crud/citas_crud.js';

const app = express();

// Si usas Vite en 5173:
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

app.get('/', (_req, res) => res.send('API OK 👋'));

// ---- Citas (CRUD) ----
app.get('/citas', listCitas);
app.get('/citas/:id', getCita);
app.post('/citas', createCita);
app.patch('/citas/:id', updateCita); // 👈 cambiado de PUT a PATCH
app.delete('/citas/:id', deleteCita);

/*
app.get('/pacientes', async (_req, res) => {
  const [rows] = await connection.execute('SELECT * FROM pacientes');
  res.json(rows);
});
app.get('/pacientes/:id', async (req, res) => {
  const [rows] = await connection.execute(
    'SELECT * FROM pacientes WHERE id_paciente = ?',
    [req.params.id]
  );
  res.json(rows);
});*/

const PORT = 3000;
app.listen(PORT, () => console.log(`API corriendo en http://localhost:${PORT}`));
