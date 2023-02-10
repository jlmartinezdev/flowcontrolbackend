const mysql = require('mysql');
const mqtt = require('mqtt');
const moment = require('moment');
const altura= 190;
let contadorLectura = 0;
let lecturaAnterior = 0;
let promedio = [];

// Obtener promedio de lectura
const getPromedio = () => {
    if (promedio.length == 10) {
        let total = 0;
        for (var i = promedio.length - 1; i >= 0; i--) {
            total += promedio[i];
        }
        total = total / 10;
        return Math.trunc(total);
    } else {
        return 0;
    }
}

//Agregar datos al arreglo de 10 elementos
const pushData = (data) => {
    if (promedio.length < 10) {
        promedio.push(data);
    } else {
        promedio = [];
        promedio.push(data);
    }
}

// Funcion para calcular Nivel en Porcentaje
const getNivel = (lectura, altura) => {
    contadorLectura++;
    var nivel = 0;
    var distanciaMin = 20;
    if (lectura > altura) {
        lectura = altura;
    }
    if (lectura > distanciaMin) {
        nivel = 100 - ((lectura - distanciaMin) * 100) / altura;
    } else {
        nivel = 100;
    }
    if (nivel < 1) {
        nivel = 0;
    }
    lecturaAnterior = lectura;
    return Math.trunc(nivel);
}
const connection = mysql.createConnection({
    host: 'localhost',
    database: 'nagua',
    user: 'root',
    password: '2792320'
});
connection.connect(function(error) {
    if (error) {
        throw error;
    } else {
        console.log("Conexion exitosa BD");
    }
})

const options = {
    clean: true, // retain session
    connectTimeout: 4000, // Timeout period
    // Authentication information
    clientId: 'backend_servicio',
    username: 'admin',
    password: 'admin',
}
const connectUrl = 'ws://181.174.200.66:8083/mqtt';
const client = mqtt.connect(connectUrl, options)
client.on('connect', () => {
    console.log(`Cliente ${options.username} conectado`);
    client.subscribe('S_T_AGUA', function(err) {})
})
client.on('reconnect', () => {
    console.log('Reconectando...')
})
client.on('error', (error) => {
    console.log('Connection failed:', error)
})
client.on('message', (topic, message) => {
    //console.log('receive message：', message.toString())
    const lectura = JSON.parse(new TextDecoder("utf-8").decode(message));
    const nivel = getNivel(lectura.distancia, altura);
    const litros= lectura.Litros;
    const LxM= lectura.LxM;
    pushData(nivel);
    const p = getPromedio();
    const ahora= moment().format("YYYY-MM-DD HH:mm:ss");
    console.log(`Nivel: ${p}`);
    if (p > 0) {
        connection.query('INSERT INTO nivel SET ?', {
            id_tanque: 10,
            nivel: p,
            fechahora: ahora,
        }, function(error, results, fields) {
            if (error) throw error;
            console.log(results.insertId);
        });
    }
    if(litros > 0){
        connection.query('INSERT INTO caudal SET ?',{
            id_sensor: 2,
            litros: litros,
            litroxm: LxM,
            fechahora: ahora;
        },function(error, results, fields){
            if(error) throw error;
            console.log(results.insertId);
        })
    }
})
client.on('close', function() {
    console.log('Desconectado...')
})