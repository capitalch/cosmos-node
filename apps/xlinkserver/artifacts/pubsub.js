let Rx = require('rxjs');
let subject = new Rx.Subject();
function filterOn(id) {
    return (subject.filter(d => (d.id === id)));
};
exports.filterOn=filterOn;

function emit(id, options,fn) {
    subject.next({id: id, data: options,fn:fn});
};
exports.emit=emit;