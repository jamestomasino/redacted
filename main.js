/*global
chrome
*/
(function(){

	var isRedacted = true;
	var redactedOptions = {
		"redactPatterns": ["trump"]
	};

	function setRedactedOptions ( myOptions ) {
		chrome.storage.sync.clear(function () {
			chrome.storage.sync.set(redactedOptions, function() {});
		});
	}

	function getRedactedOptions ( text ) {
		chrome.storage.sync.get(null, function ( myOptions ) {
			redactedOptions = myOptions || redactedOptions;
			if(isRedacted) {
				redact();
			}
		});
	}


	chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
		switch (request.functiontoInvoke) {
			case "toggleRedacted":
				if (isRedacted) {
					isRedacted = false;
					unRedact();
				} else {
					isRedacted = true;
					redact();
				}
				break;
			default:
				break;
		}
	});

	jQuery.fn.redact = function(pattern) {
		var regex = typeof(pattern) === "string" ? new RegExp(pattern, "i") : pattern;
		function innerRedact(node, pattern) {
			var skip = 0;
			if (node.nodeType === 3) {
				var pos = node.data.search(regex);
				if (pos >= 0 && node.data.length > 0) {
					var match = node.data.match(regex);
					var spanNode = document.createElement('span');
					spanNode.className = 'redacted';
					var middleBit = node.splitText(pos);
					var endBit = middleBit.splitText(match[0].length);
					var middleClone = middleBit.cloneNode(true);
					spanNode.appendChild(middleClone);
					middleBit.parentNode.replaceChild(spanNode, middleBit);
					skip = 1;
				}
			} else if (node.nodeType === 1 && node.childNodes && !/(script|style)/i.test(node.tagName)) {
				for (var i = 0; i < node.childNodes.length; i++) {
					i += innerRedact(node.childNodes[i], pattern);
				}
			}
			return skip;
		}

		return this.each(function() {
			innerRedact(this, pattern);
		});
	};

	jQuery.fn.unredact = function() {
		return this.find("span.redacted ").each(function() {
			this.parentNode.firstChild.nodeName;
			with (this.parentNode) {
				replaceChild(this.firstChild, this);
				normalize();
			}
		}).end();
	};

	$(document).ready(function() {
		getRedactedOptions();
	});

	function redact() {
		var r = redactedOptions.redactPatterns;
		for (var i=0; i < r.length; ++i) {
			$('body').redact(r[i]);
		}
	}

	function unRedact() {
		var r = redactedOptions.redactPatterns;
		for (var i=0; i < r.length; ++i) {
			$('body').unredact(r[i]);
		}
	}

})();
