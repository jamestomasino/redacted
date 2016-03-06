/*global
chrome
*/

function save_options() {
	var inp = document.getElementById('redact_list').childNodes;
	var redacted = [];

	for (var i=0; i < inp.length; i++) {
		if (inp[i].value) redacted.push (inp[i].value);
	}

	chrome.storage.sync.set({
		"redactPatterns": redacted
	}, function() {
		var status = document.getElementById('status');
		status.textContent = 'Options saved.';
		setTimeout(function() {
			status.textContent = '';
		}, 750);
	});
}

function restore_options() {
	chrome.storage.sync.get({
		redactPatterns: ['trump', 'donald']
	}, function(items) {
		var list = document.getElementById('redact_list');
		for (var i=0; i < items.redactPatterns.length; i++) {
			if (items.redactPatterns[i]) {
				var inp = create_element('<input value="' + items.redactPatterns[i] + '">');
				list.appendChild(inp);
			}
		}
	});
}

function add_pattern () {
	var list = document.getElementById('redact_list');
	var inp = create_element('<input>');
	list.appendChild(inp);
}

function create_element ( str ) {
	var frag = document.createDocumentFragment();
	var elem = document.createElement('div');
	elem.innerHTML = str;
	while (elem.childNodes[0]) {
		frag.appendChild(elem.childNodes[0]);
	}
	return frag;
};

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
document.getElementById('plus').addEventListener('click', add_pattern);
