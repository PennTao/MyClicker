var userid;
var channelid;
var channel;
var socket;
window.onload= init;
var result = new Array();



//general ajax function for all requests 
function makeRequest(url,async) {
	var httpRequest;
	if (window.XMLHttpRequest) {
		// Mozilla, Safari, ...
		httpRequest = new XMLHttpRequest();
	} else if (window.ActiveXObject) {
		// IE
		try {
			httpRequest = new ActiveXObject("Msxml2.XMLHTTP");
		} 
		catch (e) {
			try {
				httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
			} 
			catch (e) {}
		}
	}

	if (!httpRequest) {
		alert('Giving up :( Cannot create an XMLHTTP instance');
		return false;
	}
	httpRequest.open('POST', url,async);
	httpRequest.send();
	return httpRequest;
}


function init(){
	channelid = sessionStorage.getItem("teacherchannel");
	userid = sessionStorage.getItem("teacherid");;
	requestToken();
	 
}


requestToken = function(){
	var getTokenURI = '/gettoken?userid=' + userid ;
	var httpRequest = makeRequest(getTokenURI,true);
	httpRequest.onreadystatechange = function(){
		if (httpRequest.readyState === 4) {
			if (httpRequest.status === 200) {
				channel = new goog.appengine.Channel(httpRequest.responseText);
				openChannel();
			}else {
				alert('There was a problem with the request.');
			}
		}
	}
};

openChannel = function() {
	socket = channel.open();
	socket.onopen = onSocketOpen;
	socket.onmessage = onSocketMessage;
	socket.onerror = onSocketError;
	socket.onclose = onSocketClose;
};
closeChannel = function() {
	socket.close();
}
onSocketError = function(error){
	alert("Error is <br/>"+error.description+" <br /> and HTML code"+error.code);
};

onSocketOpen = function() {
	// socket opened
	sendClear();
	
};

onSocketClose = function() {
	alert("Vote finished");
};

onSocketMessage = function(message) {

	var messageXML =  ((new DOMParser()).parseFromString(message.data, "text/xml"));
	var messageType = messageXML.documentElement.getElementsByTagName("type")[0].firstChild.nodeValue;
	var messageChannel =  messageXML.documentElement.getElementsByTagName("channel")[0].firstChild.nodeValue;
	if(messageType === "StudentAnswer" && messageChannel === channelid){
		sendMessage(message);
	}
	if(messageType === "updateResult" && messageChannel === channelid){
		
		result[0] = messageXML.documentElement.getElementsByTagName("ansA")[0].firstChild.nodeValue;
		result[1] = messageXML.documentElement.getElementsByTagName("ansB")[0].firstChild.nodeValue;
		result[2] = messageXML.documentElement.getElementsByTagName("ansC")[0].firstChild.nodeValue;
		result[3] = messageXML.documentElement.getElementsByTagName("ansD")[0].firstChild.nodeValue;
		
	}

};

sendMessage = function(answer){
	
	var messageXML =  ((new DOMParser()).parseFromString(answer.data, "text/xml"));
	
	var messageFrom = messageXML.documentElement.getElementsByTagName("from")[0].firstChild.nodeValue;
	var choice = messageXML.documentElement.getElementsByTagName("message")[0].firstChild.nodeValue;
	var sendMessageURI = '/message_i?channel=' + channelid +  '&message=' + choice + '&to=' + messageFrom +'&from='+userid ;
	var httpRequest = makeRequest(sendMessageURI,true);
	
	httpRequest.onreadystatechange = function(){
		if (httpRequest.readyState === 4) {
			if (httpRequest.status === 200) {
				}else {
				alert('There was a problem with the request.');
			}
		}
	}
}

sendClear = function(){
	var sendMessageURI = '/message_i?channel=' + channelid +  '&message=clear_all';
	var httpRequest = makeRequest(sendMessageURI,true);
	result[0] = 0;
	result[1] = 0;
	result[2] = 0;
	result[3] = 0;
	httpRequest.onreadystatechange = function(){
		if (httpRequest.readyState === 4) {
			if (httpRequest.status === 200) {
				}else {
				alert('There was a problem with the request.');
			}
		}
	}
}
function getResult(){
	return result;
}