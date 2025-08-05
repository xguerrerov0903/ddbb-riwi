import mysql from 'mysql2';
import express, { request } from 'express';

const app = express();

app.listen()

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Qwe.123*',
    database: 'lovelace'
})

connection.connect(
    (error) => {
        if (error) throw error;

        console.log('Conectado correctamente')
    }
)

app.get('/clients',(request, response) =>{
    response.json({
        message: 'Esto es un mensaje'
    })
})

/*connection.query('SELECT * FROM clients', (error,result)=>{
    console.log(JSON.stringify(result));
})*/

app.listen(3000, () =>{
    console.log('Api corriendo en el puerto 3000')
})

