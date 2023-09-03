const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

// const requestLogger = (request, response, next) => {
//     console.log('Method:', request.method)
//     console.log('Path:  ', request.path)
//     console.log('Body:  ', request.body)
//     console.log('---')
//     next()
// }

// const unknownEndpoint = (request, response) => {
//     response.status(404).send({ error: 'unknown endpoint' })
// }

app.use(express.json())
app.use(cors())
app.use(express.static('dist'))


//create new token body
morgan.token('body', (req, res) => {
    return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
// app.use(requestLogger)
// app.use(unknownEndpoint)

let data = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
    response.json(data)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id

    const person = data.find(person => person.id === Number(id))
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = data.find(p => p.id === id)
    if (!person) {
        response.status(404).end()
        return
    }

    data = data.filter(person => person.id !== Number(id))
    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const newPesron = request.body

    if (!newPesron.name) {
        response.status(409).json({ error: 'name is required' }).end()
        return
    }

    if (!newPesron.number) {
        response.status(409).json({ error: 'number is required' }).end()
        return
    }

    if (data.find(p => p.name === newPesron.name)) {
        response.status(409).json({ error: 'name must be unique' }).end()
        return
    }

    newPesron.id = Math.floor(Math.random() * 288888888888)
    data = data.concat(newPesron)
    response.json(newPesron)
})

app.put('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = data.find(p => p.id === id)
    if (!person) {
        response.status(404).json({ "error": "person is not exist" })
        return
    }

    console.log();

    data = data.map(p => p.id === id ? request.body : p)
    response.status(205).json({ "success": "data updated" })
})

app.get('/info', (request, response) => {
    response.send(
        `<p>Phonebook has info for ${data.length} people</p>
        <p>${new Date()}</p>`
    )

    server.close()
    server.closeAllConnections()
})

app.post('api/persons')




const PORT = process.env.PORT || 3001
const server = app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
})


