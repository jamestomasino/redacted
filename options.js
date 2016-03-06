/*global
chrome
*/

function save_options() {
	var redacted = [document.getElementById('redact_list').value];
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

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
	// Use default value color = 'red' and likesColor = true.
	chrome.storage.sync.get({
		redactPatterns: ['trump']
	}, function(items) {
		document.getElementById('redact_list').value = items.redactPatterns[0];
	});
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
