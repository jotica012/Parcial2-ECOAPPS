import express, {
request, response
} from "express";
import { Server
} from "socket.io";
import cors from "cors";

//Serial Port Configuration

import {
    SerialPort,
    ReadlineParser
} from 'serialport';

const protocolConfiguration = {
    path: '/dev/cu.usbmodem141101',
    baudRate: 9600
}

const serialPort = new SerialPort(protocolConfiguration);
const parser = serialPort.pipe(new ReadlineParser());

const PORT = 8080
const expressApp = express()
const httpServer = expressApp.listen(PORT, () => {
    console.table({
        'Game': `http://localhost:${PORT}/game`,
    })

})
const io = new Server(httpServer, {
    path: '/real-time'
})

expressApp.use('/game', express.static('public-game'))
expressApp.use('/game', express.static('game-over'))
expressApp.use('/game', express.static('score'))
expressApp.use(express.json())


io.on('connection', (socket) => {
    console.log('Connected!', socket.id)
    //
})

let currentScore = 0;

expressApp.get('/final-score', (request, response) => {
    response.send({
        content: currentScore
    });
})

/*___________________________________________

1) Create an endpoint to POST player's current score and print it on console
It should send a messago to ARDUINO to turn on and off the lights when the player scores a point
_____________________________________________ */

expressApp.post('/score', (request, response) => {
    gameData = request.body;
    console.log(request.body);
    response.send({Data: `game Data is: ${userData}`})
    console.log(userData);
    
})


/*___________________________________________

2) Create an endpoint to POST that the game is over and turn on all the lights.
_____________________________________________ */
let gameData;
expressApp.post('/game-over', (request, response) => {
gameData = request.body;
console.log(request.body);
response.send({Data: `User Data is: ${gameData}`})
console.log(userData);  //
    
})
let arduinoMessage = {
    actuatorValue: 0,
    btnAValue: 0,
    btnBValue: 0
}

parser.on('data', (data) => {
    console.log(data);
    let dataArray = data.split(' ')
    arduinoMessage.actuatorValue = parseInt(dataArray[0])
    arduinoMessage.btnAValue = parseInt(dataArray[1])
    arduinoMessage.btnBValue = parseInt(dataArray[2])

    /*___________________________________________

3) Use the socket.io instance to send the message from the ARDUINO to the client in the browser

_____________________________________________ */

// PUT IT HERE

ioServer.emit('arduino-message', arduinoMessage);
console.log(arduinoMessage);

});