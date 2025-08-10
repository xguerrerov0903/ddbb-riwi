// backend/citas_crud.js
import { connection } from '../db.js';

export async function listCitas(_req, res) {
  const [rows] = await connection.execute('SELECT * FROM citas');
  res.json(rows); // devuelve [] si no hay
}

export async function getCita(req, res) {
  const [rows] = await connection.execute(
    'SELECT * FROM citas WHERE id_cita = ?',
    [req.params.id]
  );
  if (rows.length === 0) return res.status(404).json({ error: 'No existe' });
  res.json(rows[0]);
}

export async function createCita(req, res) {
  const { id_paciente, id_medico, fecha, hora, motivo, descripcion, ubicacion, metodo_pago, estatus } = req.body;

  const [r] = await connection.execute(
    `INSERT INTO citas (id_paciente, id_medico, fecha, hora, motivo, descripcion, ubicacion, metodo_pago, estatus)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [id_paciente, id_medico, fecha, hora, motivo, descripcion ?? null, ubicacion, metodo_pago, estatus]
  );

  const [rows] = await connection.execute(
    'SELECT * FROM citas WHERE id_cita = ?',
    [r.insertId]
  );
  res.status(201).json(rows[0]);
}

export async function updateCita(req, res) {
  const id = req.params.id;
  const { id_paciente, id_medico, fecha, hora, motivo, descripcion, ubicacion, metodo_pago, estatus } = req.body;

  await connection.execute(
    `UPDATE citas
       SET id_paciente=?, id_medico=?, fecha=?, hora=?, motivo=?, descripcion=?, ubicacion=?, metodo_pago=?, estatus=?
     WHERE id_cita=?`,
    [id_paciente, id_medico, fecha, hora, motivo, descripcion ?? null, ubicacion, metodo_pago, estatus, id]
  );

  const [rows] = await connection.execute(
    'SELECT * FROM citas WHERE id_cita = ?',
    [id]
  );
  if (rows.length === 0) return res.status(404).json({ error: 'No existe' });
  res.json(rows[0]);
}

export async function deleteCita(req, res) {
  const [r] = await connection.execute(
    'DELETE FROM citas WHERE id_cita = ?',
    [req.params.id]
  );

  if (r.affectedRows === 0) {
    return res.status(404).json({ error: 'No existe' });
  }

  // Si se borró correctamente:
  return res.sendStatus(204); // "No Content"
}

