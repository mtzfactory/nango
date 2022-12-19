import { Nango } from '@nangohq/node-client';

var action: string;
var syncId: number;
let nango = new Nango();

try {
    action = process.argv.slice(2)[0]!;
} catch (e) {
    console.log("Pass in an action as 1st argument: pause, resume, cancel, trigger.");
    process.exit(1);
}

try {
    syncId = +process.argv.slice(2)[1]!;
} catch (e) {
    console.log("Pass in a async ID as 2nd argument.");
    process.exit(1);
}

switch (action) {
    case 'pause':
        nango.pause(syncId);
        break;
    case 'resume':
       nango.resume(syncId);
        break;
    case 'cancel':
        nango.cancel(syncId);
        break;
    case 'trigger':
        nango.trigger(syncId);
        break;
    default:
        console.log("Unknown action name, should be: pause, resume, cancel, trigger");
}