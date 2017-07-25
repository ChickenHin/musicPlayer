function createXHR() {
	var request = null;
	try {
		request = new XMLHttpRequest();
	} catch(trymicrosoft) {
		try {
			request = new ActiveXObject("msxml2.XMLHTTP");
		} catch(othermicrosoft) {
			try {
				request = new ActiveXObject("Microsoft.XMLHTTP");
			} catch(failed) {
				request = false;
			}
		}
	} 
	if(!request) {
		alert("Error initializing XMLHttpRequest!");
	} else {
		return request;
	}
}

function getText() {
	var lrcBlock = document.getElementById('lyric');
	var xhr = createXHR();
	if(xhr!=null) {
		xhr.open("get","../lrc/陈一发儿 - 童话镇.xml",true);
		xhr.onreadystatechange = function() {
			if(xhr.readystate == 4) {
				if((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
					lrcBlock.innerHTML = xhr.responseXML;
				} else {
					alert("fail to request");
				}
			}
		}
		xhr.send(null);
	}
	
}
getText();
