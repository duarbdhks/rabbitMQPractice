const express = require('express')
const app = express()
const PORT = 5002
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
    channel.consume('session', (data) => {
      console.log(`Received data at 5002(session-service): ${Buffer.from(data.content)}`)
      channel.ack(data)
    })
  } catch (e) {
    console.log(e, 'session connect')
  }
}


app.listen(PORT, () => {
  console.log(`session server: localhost:${PORT}`)
})
