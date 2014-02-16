//
var userid;
var channelid;
window.onload= init;

function init(){
	channelid = sessionStorage.getItem("studentchannel");
	userid = sessionStorage.getItem("studentid");;
	requestToken();
}
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

requestToken = function(){
	var getTokenURI = '/gettoken?userid=' + userid ;
	var httpRequest = makeRequest(getTokenURI,true);
	httpRequest.onreadystatechange = function(){
		if (httpRequest.readyState === 4) {
			if (httpRequest.status === 200) {
				openChannel(httpRequest.responseText);
			}else {
				alert('There was a problem with the request.');
			}
		}
	}
};

openChannel = function(token) {
	var channel = new goog.appengine.Channel(token);
	var socket = channel.open();
	socket.onopen = onSocketOpen;
	socket.onmessage = onSocketMessage;
	socket.onerror = onSocketError;
	socket.onclose = onSocketClose;
};

onSocketError = function(error){
	alert("Error is <br/>"+error.description+" <br /> and HTML code"+error.code);
};

onSocketOpen = function() {

	// socket opened
};

onSocketClose = function() {
	alert("Socket Connection closed");
};

onSocketMessage = function(message) {
	var messageXML =  ((new DOMParser()).parseFromString(message.data, "text/xml"));
	var messageType = messageXML.documentElement.getElementsByTagName("type")[0].firstChild.nodeValue;
	var messageChannel =  messageXML.documentElement.getElementsByTagName("channel")[0].firstChild.nodeValue;
	if(messageType === "AnswerReceived" && messageChannel === channelid){
	}

};

sendMessage = function(answer){
	var sendMessageURI = '/message_s?channel=' + channelid + '&message=' + answer + '&to=' + sessionStorage.getItem("teacherid") +'&from='+userid ;
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