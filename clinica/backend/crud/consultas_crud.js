import { connection } from "../db.js";

export async function filtrarCitasMedicoFechas(req, res) {
  const { id_medico, fecha_inicio, fecha_fin } = req.body;

  const [rows] = await connection.execute(
    `SELECT m.nombre as Medico, m.especialidad, c.*
        FROM citas  c
        JOIN medicos m ON c.id_medico = m.id_medico
        WHERE c.? = 2 AND c.fecha BETWEEN ? AND ?
        ORDER BY c.fecha;

     VALUES (?, ?, ?)`,
    [id_medico, fecha_inicio, fecha_fin]
  );
  res.json(rows);
}

export async function filtrarPacientes3Citas(_req, res) {
  const [rows] = await connection.execute(
    `SELECT p.*, 
    COUNT(c.id_cita) AS Total_citas
    FROM pacientes p
    JOIN citas c ON c.id_paciente = p.id_paciente
    GROUP BY p.id_paciente	
    HAVING COUNT(*) >= 3`
  );
  res.json(rows);
}

export async function filtrarMedicosCitas(_req, res) {
  const [rows] = await connection.execute(
    `SELECT 
       m.*,
       COUNT(c.id_cita) AS Total_citas
     FROM medicos m
     JOIN citas c ON c.id_medico = m.id_medico
     WHERE c.fecha BETWEEN DATE_SUB(CURDATE(), INTERVAL 1 MONTH) AND CURDATE()
     GROUP BY m.id_medico` 
  );
  res.json(rows);
}

export async function filtrarMetodosPagoFechas(req, res) {
  const { fecha_inicio, fecha_fin } = req.body;

  const [rows] = await connection.execute(
    `SELECT 
	c.metodo_pago, COUNT(id_cita) AS Total_citas
    FROM citas c
    WHERE c.fecha BETWEEN ? AND ?
    GROUP BY c.metodo_pago

     VALUES (?, ?)`,
    [fecha_inicio, fecha_fin]
  );
  res.json(rows);
}
