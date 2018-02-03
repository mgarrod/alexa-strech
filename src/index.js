//zip -r ../yourfilename.zip *

'use strict';
var Alexa = require("alexa-sdk");

var NUMBEROFSTRETCHES = 0;
var TIMEBETWEENSTRETCHES = 0;

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.registerHandlers(handlers, numberOfStretchesHandlers, timeBetweenStretchHandlers);
    alexa.execute();
};

var handlers = {
    'NewSession': function() {
        this.handler.state = '_NUMBERSTATE';

        this.emit(':ask', 'How many stretches will you be doing?');
    },
    'LaunchRequest': function () {

        this.handler.state = '_NUMBERSTATE';

        this.emit(':ask', 'How many stretches will you be doing?');
        
    },
    "AMAZON.StopIntent": function() {
        this.emit(':tell', "Thanks for stretching!");  
    },
};

var numberOfStretchesHandlers = Alexa.CreateStateHandler('_NUMBERSTATE', {
	'NewSession': function () {
        this.handler.state = '';
        this.emitWithState('NewSession'); // Equivalent to the Start Mode NewSession handler
    },
    'NumberOfStrechesIntent': function() {
        
        this.handler.state = '_TIMESTATE';

        NUMBEROFSTRETCHES = parseInt(this.event.request.intent.slots.NumberOfStretches.value);

        this.emit(':ask', 'How many seconds between streches?');

    },
    'AMAZON.HelpIntent': function() {
        this.emit(':tell', "Goodbye!");
    },
    "AMAZON.StopIntent": function() {
        this.emit(':tell', "Goodbye!");  
    },
    "AMAZON.CancelIntent": function() {
        console.log("CANCELINTENT");
    },
    'SessionEndedRequest': function () {
        this.emit(':tell', "Goodbye!");
    },
    'Unhandled': function() {
        this.emit(':tell', "Unhandled!");
    }

});

var timeBetweenStretchHandlers = Alexa.CreateStateHandler('_TIMESTATE', {
	'NewSession': function () {
        this.handler.state = '';
        this.emitWithState('NewSession'); // Equivalent to the Start Mode NewSession handler
    },
    'TimeBetweenStretchIntent': function() {
        
        //this.handler.state = '';

        //this.emit(':tell', parseInt(this.event.request.intent.slots.TimeBetweenStretches.value));

        TIMEBETWEENSTRETCHES = parseInt(this.event.request.intent.slots.TimeBetweenStretches.value);
        TIMEBETWEENSTRETCHES = TIMEBETWEENSTRETCHES > 120 ? 1 : TIMEBETWEENSTRETCHES;
        NUMBEROFSTRETCHES = NUMBEROFSTRETCHES > 50 ? 1 : NUMBEROFSTRETCHES;

        var numberOfSets = 3;

        var message = 'ok. let\'s get started with three sets of ' + NUMBEROFSTRETCHES + ' stretches, each lasting ' + TIMEBETWEENSTRETCHES + ' seconds. Start in 3 <break time="1s"/> 2 <break time="1s"/> 1 <break time="1s"/> <emphasis level="strong">annnnd</emphasis> stretch. ';
        for (var i=0;i < NUMBEROFSTRETCHES;i++) {
           
            for (var ii=0;ii < numberOfSets;ii++) {

                for (var iii=0;iii < Math.ceil(TIMEBETWEENSTRETCHES / 10);iii++) {
                    var newTime = (TIMEBETWEENSTRETCHES - (10 * (iii+1)));
                    newTime = newTime > 0 ? 10 : 10 + newTime;
                    message += '<break time="' + newTime + 's"/>';
                }

                if (i != NUMBEROFSTRETCHES && ii < numberOfSets - 1) {
                    message += 'break 5 seconds ';
                }
                
                if (ii < 2) {
                    message += '<break time="5s"/> <emphasis level="strong">annnnd</emphasis> stretch ';
                }
                else {
                    if (i < NUMBEROFSTRETCHES - 1) {
                        message += 'break 10 seconds and go to next position <break time="10s"/> <emphasis level="strong">annnnd</emphasis> stretch ';
                    }
                    else {
                        message += 'done. Nice Job. You will be running again before you know it.';
                    }
                }

            }
        }
        // //var message = 'ok. start in 3 <break time="1s"/> 2 <break time="1s"/> 1 <break time="1s"/> go. <break time="5s"/> break 5 seconds <break time="5s"/> go <break time="5s"/> break 5 seconds <break time="5s"/> go <break time="5s"/> break 5 seconds for next position <break time="5s"/> go <break time="5s"/> break 5 seconds <break time="5s"/> go <break time="5s"/> break 5 seconds <break time="5s"/> go <break time="5s"/> break 5 seconds done';
        this.emit(':tell', message);

    },
    'AMAZON.HelpIntent': function() {
        this.emit(':tell', "Goodbye!");
    },
    "AMAZON.StopIntent": function() {
        this.emit(':tell', "Goodbye!");  
    },
    "AMAZON.CancelIntent": function() {
        console.log("CANCELINTENT");
    },
    'SessionEndedRequest': function () {
        this.emit(':tell', "Goodbye!");
    },
    'Unhandled': function() {
        this.emit(':ask', "Sorry, I didn't quite get that. Please say the number of seconds you would like to stretch, followed by, seconds.");
    }

});


