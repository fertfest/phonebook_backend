require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const app = express()

// const requestLogger = (request, response, next) => {
//     console.log('Method:', request.method)
//     console.log('Path:  ', request.path)
//     console.log('Body:  ', request.body)
//     console.log('---')
//     next()
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

app.get('/api/persons', (request, response, next) => {
    Person.find({})
        .then(result => {
            response.json(result)
        })
        .catch(error => {
            next(error)
        })
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(result => {
            response.json(result)
        })
        .catch(error => {
            next(error)
        })
})

app.delete('/api/persons/:id', (request, response, next) => {
    const id = Number(request.params.id)

    Person.findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => {
            next(error)
        })
})

app.post('/api/persons', (request, response, next) => {
    const newPesron = new Person({
        ...request.body
    })

    if (!newPesron.name) {
        response.status(409).json({ error: 'name is required' }).end()
        return
    }

    if (!newPesron.number) {
        response.status(409).json({ error: 'number is required' }).end()
        return
    }

    Person.find({})
        .then(allPeople => {
            if (allPeople.find(p => p.name === newPesron.name)) {
                response.status(409).json({ error: 'name must be unique' }).end()
                return
            }

            newPesron.save({ validateBeforeSave: true }).then(result => {
                response.json(result)
            }).catch(error => {
                next(error)
            })
        })
        .catch(error => {
            next(error)
        })

})

app.put('/api/persons/:id', (request, response, next) => {

    const person = {
        name: request.body.name,
        number: request.body.number
    }

    console.log(person);

    Person.findByIdAndUpdate(
        request.params.id,
        person,
        { new: true, runValidators: true, context: 'query' })
        .then(updatedPerson => {
            response.json(updatedPerson)
        })
        .catch(error => {
            next(error)
        })
})

app.get('/info', (request, response, next) => {
    Person.countDocuments({})
        .then(result => {
            response.set('Content-Type', 'text/html').write(`<p>Phonebook has info for ${result} people</p>
            <p>${new Date()}</p>`)
            response.end()
        })
        .catch(error => {
            response.json(error)
        })
    // server.close()
    // server.closeAllConnections()
})


const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })

    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }

    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
const server = app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
})
