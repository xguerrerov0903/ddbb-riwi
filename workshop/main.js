import mysql from 'mysql2'
import express from 'express'

const app =  express()
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Qwe.123*',
    database: 'gestion_academica_universidad',
})

connection.connect(function (err) {
    if (err) {
        console.error(err)
    }
    console.log('conectado correctamente')

    app.get('clientes', function (req, res) {
        connection.query('SELECT * FROM estudiantes', (err, result) => {
            if (err) throw err
            console.log(JSON.stringify(result))
        })
    })
})
app.listen(3000, (error) => {
    if (error) throw error;
    console.log('Servidor rodando')
})