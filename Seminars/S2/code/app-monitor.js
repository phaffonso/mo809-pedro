var mqtt    = require('mqtt');
var brokerUrl = require('./broker-url.js');
var client  = mqtt.connect(brokerUrl);

var timers = require('timers');

var myId = Math.random() * 10000;

var myTopic = 'sensor/+/temperature';

client.on('connect', function () {
    client.subscribe(myTopic, {qos: 2}, function (err, granted){
        if(err) throw err;
        console.log("suback received");
        console.log(granted);
    });
});

client.on('message', function (topic, message, packet) {
    console.log(topic+': '+message.toString());
});