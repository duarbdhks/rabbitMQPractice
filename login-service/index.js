const express = require('express')
const app = express()
const PORT = 5001
const amqp = require('amqplib')
const body = require('body-parser')
let channel, connection

app.use(body.json())
connect()

async function connect () {
  try {
    const amqpServer = `amqp://duarbdhks:1234@localhost:35672`
    connection = await amqp.connect(amqpServer)
    channel = await connection.createChannel()
    await channel.assertQueue('session')
  } catch (e) {
    console.log(e, 'login connect')
  }
}

const createSession = async (user) => {
  await channel.sendToQueue('session', Buffer.from(JSON.stringify(user)))
  await channel.close()
  await connection.close()
}

app.post('/login', (req, res) => {
  const { username, password } = req.body
  const user = { username, password }
  createSession(user)
  res.send(user)
})

app.listen(PORT, () => {
  console.log(`login server: localhost:${PORT}`)
})
