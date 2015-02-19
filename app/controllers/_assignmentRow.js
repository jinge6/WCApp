var args = arguments[0] || { };

$._assignmentRow.open();

$.name.text = args[0];
$.description.text = args[1];
console.log('spitting out description' + args[1]);
console.log('spitting out description' + $.description.text);
