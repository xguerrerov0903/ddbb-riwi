// backend/crud/medicos_crud.js
import { connection } from '../db.js';

// GET /medicos
export async function listMedicos(_req, res) {
  const [rows] = await connection.execute('SELECT * FROM medicos');
  res.json(rows);
}

// GET /medicos/:id
export async function getMedico(req, res) {
  const [rows] = await connection.execute(
    'SELECT * FROM medicos WHERE id_medico = ?',
    [req.params.id]
  );
  if (rows.length === 0) return res.status(404).json({ error: 'No existe' });
  res.json(rows[0]);
}

// POST /medicos
export async function createMedico(req, res) {
  const { nombre, especialidad } = req.body;
  if (!nombre) return res.status(400).json({ error: 'nombre es obligatorio' });

  const [r] = await connection.execute(
    'INSERT INTO medicos (nombre, especialidad) VALUES (?, ?)',
    [nombre, especialidad ?? null]
  );
  const [rows] = await connection.execute(
    'SELECT * FROM medicos WHERE id_medico = ?',
    [r.insertId]
  );
  res.status(201).json(rows[0]);
}

// PATCH /medicos/:id
export async function updateMedico(req, res) {
  const id = req.params.id;
  const { nombre, especialidad } = req.body;

  const [r] = await connection.execute(
    'UPDATE medicos SET nombre=?, especialidad=? WHERE id_medico=?',
    [nombre, especialidad ?? null, id]
  );
  if (r.affectedRows === 0) return res.status(404).json({ error: 'No existe' });

  const [rows] = await connection.execute(
    'SELECT * FROM medicos WHERE id_medico = ?',
    [id]
  );
  res.json(rows[0]);
}

// DELETE /medicos/:id
export async function deleteMedico(req, res) {
  const [r] = await connection.execute(
    'DELETE FROM medicos WHERE id_medico = ?',
    [req.params.id]
  );
  if (r.affectedRows === 0) return res.status(404).json({ error: 'No existe' });
  return res.sendStatus(204);
}
