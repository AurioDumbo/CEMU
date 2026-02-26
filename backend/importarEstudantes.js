const mysql = require('mysql2/promise');
const xlsx = require('xlsx');

async function importarExcel() {

  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'cemu'
  });

  try {

    console.log("Conectado a MySQL");

    // Leer Excel
    const workbook = xlsx.readFile('estudantes_fen.xlsx');
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet);

    for (const row of data) {

      // 🔹 Validar campos obligatorios
      if (!row.Nome || !row.Sobrenome || !row.Sexo || !row.Curso_ID) {
        console.log("Registro omitido:", row);
        continue;
      }

      // 🔹 Convertir undefined a null automáticamente
      const estudante = {
        Nome: row.Nome ?? null,
        Sobrenome: row.Sobrenome ?? null,
        Sexo: row.Sexo ?? null,
        Curso_ID: row.Curso_ID ?? null,
        Telefone: row.Telefone ?? null,
        Email: row.Email ?? null,
        Estado: row.Estado ?? 'Pendente',
        Faculdade_ID: row.Faculdade_ID ?? 1
      };

      await connection.execute(
        `INSERT INTO Estudante
        (Nome, Sobrenome, Sexo, Curso_ID, Telefone, Email, Estado, Faculdade_ID)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          estudante.Nome,
          estudante.Sobrenome,
          estudante.Sexo,
          estudante.Curso_ID,
          estudante.Telefone,
          estudante.Email,
          estudante.Estado,
          estudante.Faculdade_ID
        ]
      );
    }

    console.log("Importación finalizada correctamente");

  } catch (error) {
    console.error("Error en la importación:", error.message);
  } finally {
    await connection.end();
  }
}

importarExcel();