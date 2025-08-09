import mysql from 'mysql2';
import fs from 'fs';
import csv from 'csv-parser';
import { parse } from 'csv-parse/sync';

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'clinica'
});

connection.connect((error) => {
  if (error) throw error;
  console.log("Conectado correctamente a la base de datos");
});

async function main() {
  // Leer CSV completo
  const raw = fs.readFileSync('data_crudclinic.csv', 'utf8');
  const rows = parse(raw, {
    columns: true,
    skip_empty_lines: true
  });

  for (const row of rows) {
    try {
      const idPaciente = await getOrCreatePacienteAsync(row["Nombre Paciente"], row["Correo Paciente"]);
      const idMedico   = await getOrCreateMedicoAsync(row["Médico"], row["Especialidad"]);
      await insertCitaAsync(idPaciente, idMedico, row);

      console.log(`Cita insertada para paciente ${idPaciente} y médico ${idMedico}`);
    } catch (e) {
      console.error("Error procesando fila:", e.message);
    }
  }

  console.log("Importación finalizada");
  connection.end();
}

main().catch(err => {
  console.error("Fallo general:", err);
});

// -------- helpers (sin modificar tus rows; email sí se normaliza aquí) --------

function getOrCreatePaciente(nombre, email, callback) {
  const emailNorm = email.toString().trim().toLowerCase();

  connection.query(
    "SELECT id_paciente FROM pacientes WHERE email = ?",
    [emailNorm],
    (err, results) => {
      if (err) return callback(err);

      if (results.length > 0) {
        return callback(null, results[0].id_paciente);
      }

      connection.query(
        "INSERT INTO pacientes (nombre, email) VALUES (?, ?)",
        [nombre, emailNorm],
        (err, result) => {
          if (err) return callback(err);
          callback(null, result.insertId);
        }
      );
    }
  );
}

function getOrCreateMedico(nombre, especialidad, callback) {
  connection.query(
    "SELECT id_medico FROM medicos WHERE nombre = ? AND especialidad = ?",
    [nombre, especialidad],
    (err, results) => {
      if (err) return callback(err);

      if (results.length > 0) {
        return callback(null, results[0].id_medico);
      }

      connection.query(
        "INSERT INTO medicos (nombre, especialidad) VALUES (?, ?)",
        [nombre, especialidad],
        (err, result) => {
          if (err) return callback(err);
          callback(null, result.insertId);
        }
      );
    }
  );
}

// ===== Wrappers en promesas para usar con await =====
function getOrCreatePacienteAsync(nombre, email) {
  return new Promise((resolve, reject) => {
    getOrCreatePaciente(nombre, email, (err, id) => {
      if (err) reject(err);
      else resolve(id);
    });
  });
}

function getOrCreateMedicoAsync(nombre, especialidad) {
  return new Promise((resolve, reject) => {
    getOrCreateMedico(nombre, especialidad, (err, id) => {
      if (err) reject(err);
      else resolve(id);
    });
  });
}

function insertCitaAsync(idPaciente, idMedico, row) {
  return new Promise((resolve, reject) => {
    connection.query(
      `INSERT INTO citas
        (id_paciente, id_medico, fecha, hora, motivo, descripcion, ubicacion, metodo_pago, estatus)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        idPaciente,
        idMedico,
        row["Fecha Cita"],
        row["Hora Cita"],
        row["Motivo"],
        row["Descripción"],
        row["Ubicación"],
        row["Método de Pago"],
        row["Estatus Cita"],
      ],
      (err) => err ? reject(err) : resolve()
    );
  });
}