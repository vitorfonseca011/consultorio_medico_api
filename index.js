const express = require('express')
const mysql = require('mysql2')

const app = express()

const conexao = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', 
    database: 'consultorio_medico'
})

conexao.connect()

app.use(express.json())

const produtos = []

app.post('/consultas', (req, res) => {
    const consulta = {
        paciente: req.body.paciente,
        medico: req.body.medico,
        especialidade: req.body.especialidade,
        data: req.body.data,
        horario: req.body.horario,
        observacoes: req.body.observacoes 
    }

    if (!consulta.paciente || typeof consulta.paciente != 'string' || consulta.paciente.trim() == '') {
        return res.status(400).send('Nome do paciente é obrigatório e deve ser uma string não vazia.');
    }

    if (!consulta.medico || typeof consulta.medico != 'string' || consulta.medico.trim() == '') {
        return res.status(400).send('Nome do médico é obrigatório e deve ser uma string não vazia.');
    }

    if (!consulta.especialidade || typeof consulta.especialidade != 'string' || consulta.especialidade.trim() == '') {
        return res.status(400).send('especialidade é obrigatório e deve ser uma string não vazia.');
    }

    if (!consulta.observacoes || typeof consulta.observacoes != 'string' || consulta.observacoes.trim() == '') {
        return res.status(400).send('observações é obrigatório e deve ser uma string não vazia.');
    }

    if (!consulta.data) {
        return res.status(400).send('Informar a data é obrigatório.');
    }

    if (!consulta.horario) {
        return res.status(400).send('Informar o horário é obrigatório.');
    }

    conexao.query(
        'INSERT INTO consultas (paciente, medico, especialidade, data, horario, observacoes) VALUES (?, ?, ?, ?, ?, ?)',
        [consulta.paciente, consulta.medico, consulta.especialidade, consulta.data, consulta.horario, consulta.observacoes],
        () => {
            res.status(201).send('Paciente cadastrado com sucesso!')
        }
    )

})

app.get('/consultas', (req, res) => {
    conexao.query('SELECT paciente, medico, especialidade, data, horario, observacoes FROM consultas', (err, results) => {
        if(err) {
            return res.status(500).send("Erro ao buscar paciente");
        }
        res.status(200).send(results)
    })
    
})

app.listen(3000, () => {
    console.log("Servidor backend rodando em http://localhost:3000")
})
