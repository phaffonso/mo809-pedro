var mqtt    = require('mqtt');
var brokerUrl = require('./broker-url.js');
var timers = require('timers');


var myId = Math.random().toString(16).substr(2, 8);
var myTopic = 'sensor/' + myId + '/temperature';
var myWillTopic = 'sensor/disconnected';

var client  = mqtt.connect(brokerUrl, {
    will: {
        qos: 2,
        topic: myWillTopic,
        payload: myId
    }
});

function publishTemp(){

    var rand = Math.random();
    var temp = 10 + rand*rand*rand * 200 ;
    if(temp > 200){
        process.exit(); //sensor failure!
    }
    client.publish(myTopic, ''+temp, {qos: 2, retain: true});
}

client.on('connect', function () {
    client.subscribe(myTopic, 
        {
            qos: 2
        }, 
        function (err, granted){
        if(err) throw err;
        console.log("suback received");
        console.log(granted);
    });
    timers.setInterval(publishTemp, 1000);
});

client.on('message', function (topic, message, packet) {
    console.log(message.toString());
});