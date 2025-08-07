import mysql from 'mysql2';
import express, { request } from 'express';
import cors from 'cors';

const app = express();

app.use(cors());

// app.listen()

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'lovelace'
})

connection.connect(
    (error) => {
        if (error) throw error;

        console.log('Conectado correctamente')
    }
)

app.get('/clients',(request, response) =>{
    connection.query('SELECT * FROM clients', (error,result)=>{
    // connection.query('SELECT * FROM clients WHERE email= ? AND password = ?', (error,result)=>{
        if (error) throw error;

        response.json(result)
    })
})


app.get('/clients/:id',(request, response) =>{

    const {id} = request.params;

    // request.body ??

    // bcrypt
    connection.query(`SELECT * FROM clients WHERE id = ?`, [id], (error,result)=>{

        if (error) throw error;

        response.json(result)
    })
})

/*connection.query('SELECT * FROM clients', (error,result)=>{
    console.log(JSON.stringify(result));
})*/

app.post('/login'  ,(req,res) =>{

})

app.listen(3000, (error) =>{

    if (error) throw error;

    console.log('Api corriendo en el puerto 3000')
})

