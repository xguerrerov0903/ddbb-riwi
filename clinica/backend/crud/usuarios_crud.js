// backend/crud/usuarios_crud.js
import { connection } from '../db.js';

// GET /usuarios
export async function listUsuarios(_req, res) {
  const [rows] = await connection.execute('SELECT * FROM usuarios');
  res.json(rows); // []
}

// GET /usuarios/:id
export async function getUsuario(req, res) {
  const [rows] = await connection.execute(
    'SELECT * FROM usuarios WHERE id_usuario = ?',
    [req.params.id]
  );
  if (rows.length === 0) return res.status(404).json({ error: 'No existe' });
  res.json(rows[0]);
}

// POST /usuarios
export async function createUsuario(req, res) {
  const { usuario, contrasenia } = req.body;
  if (!usuario || !contrasenia) {
    return res.status(400).json({ error: 'usuario y contrasenia son obligatorios' });
  }

  try {
    const [r] = await connection.execute(
      'INSERT INTO usuarios (usuario, contrasenia) VALUES (?, ?)',
      [usuario, contrasenia]
    );
    const [rows] = await connection.execute(
      'SELECT * FROM usuarios WHERE id_usuario = ?',
      [r.insertId]
    );
    res.status(201).json(rows[0]);
  } catch (e) {
    // Si tienes UNIQUE en usuario, atrapamos duplicados
    if (e?.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'usuario ya existe' });
    }
    console.error(e);
    res.status(500).json({ error: 'Error creando usuario' });
  }
}

// PATCH /usuarios/:id
export async function updateUsuario(req, res) {
  const id = req.params.id;
  const { usuario, contrasenia } = req.body;

  try {
    const [r] = await connection.execute(
      'UPDATE usuarios SET usuario = ?, contrasenia = ? WHERE id_usuario = ?',
      [usuario, contrasenia, id]
    );
    if (r.affectedRows === 0) return res.status(404).json({ error: 'No existe' });

    const [rows] = await connection.execute(
      'SELECT * FROM usuarios WHERE id_usuario = ?',
      [id]
    );
    res.json(rows[0]);
  } catch (e) {
    if (e?.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'usuario ya existe' });
    }
    console.error(e);
    res.status(500).json({ error: 'Error actualizando usuario' });
  }
}

// DELETE /usuarios/:id
export async function deleteUsuario(req, res) {
  const [r] = await connection.execute(
    'DELETE FROM usuarios WHERE id_usuario = ?',
    [req.params.id]
  );
  if (r.affectedRows === 0) return res.status(404).json({ error: 'No existe' });
  return res.sendStatus(204);
}
