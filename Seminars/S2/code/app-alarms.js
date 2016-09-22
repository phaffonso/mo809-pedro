var mqtt    = require('mqtt');
var brokerUrl = require('./broker-url.js');
var client  = mqtt.connect(brokerUrl);

var timers = require('timers');

var myTopic =     'sensor/+/temperature';
var myWillTopic = 'sensor/disconnected';
var myTopicActuator = 'actuator/sprinkler/activate';

client.on('connect', function () {
    client.subscribe(myTopic, {qos: 2}, function (err, granted){
        if(err) throw err;
        console.log("suback received");
        console.log(granted);
    });
    client.subscribe(myWillTopic, {qos: 2}, function (err, granted){
        if(err) throw err;
        console.log("suback received");
        console.log(granted);
    });
});

client.on('message', function (topic, message, packet) {
    if(topic == myWillTopic){
        console.log('WARNING!!! client: '+message+' disconnected');
    }else{
        if(message * 1 > 120){
            console.log('WARNING!!! '+topic+' is:'+ message.toString());
            client.publish(myTopicActuator, '', {qos: 2, retain: true});
        }
    }
});