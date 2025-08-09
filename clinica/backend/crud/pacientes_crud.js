// backend/crud/pacientes_crud.js
import { connection } from '../db.js';

// GET /pacientes
export async function listPacientes(_req, res) {
  const [rows] = await connection.execute('SELECT * FROM pacientes');
  res.json(rows);
}

// GET /pacientes/:id
export async function getPaciente(req, res) {
  const [rows] = await connection.execute(
    'SELECT * FROM pacientes WHERE id_paciente = ?',
    [req.params.id]
  );
  if (rows.length === 0) return res.status(404).json({ error: 'No existe' });
  res.json(rows[0]);
}

// POST /pacientes
export async function createPaciente(req, res) {
  const { nombre, email } = req.body;
  if (!nombre || !email) {
    return res.status(400).json({ error: 'nombre y email son obligatorios' });
  }

  try {
    const [r] = await connection.execute(
      'INSERT INTO pacientes (nombre, email) VALUES (?, ?)',
      [nombre, email]
    );
    const [rows] = await connection.execute(
      'SELECT * FROM pacientes WHERE id_paciente = ?',
      [r.insertId]
    );
    res.status(201).json(rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error creando paciente' });
  }
}

// PATCH /pacientes/:id
export async function updatePaciente(req, res) {
  const id = req.params.id;
  const { nombre, email } = req.body;

  try {
    const [r] = await connection.execute(
      'UPDATE pacientes SET nombre=?, email=? WHERE id_paciente=?',
      [nombre, email, id]
    );
    if (r.affectedRows === 0) return res.status(404).json({ error: 'No existe' });

    const [rows] = await connection.execute(
      'SELECT * FROM pacientes WHERE id_paciente = ?',
      [id]
    );
    res.json(rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error actualizando paciente' });
  }
}

// DELETE /pacientes/:id
export async function deletePaciente(req, res) {
  const [r] = await connection.execute(
    'DELETE FROM pacientes WHERE id_paciente = ?',
    [req.params.id]
  );
  if (r.affectedRows === 0) return res.status(404).json({ error: 'No existe' });
  return res.sendStatus(204);
}
