function open_win(myip) 
{
	var index=document.getElementById("username");
	var person=index.options[index.selectedIndex].innerHTML;
	//var person="student"
	if(person=="Student")
	{	
		sessionStorage.setItem("channel",document.getElementById("password").value);
		sessionStorage.setItem("studentid", myip);
		window.open("button.html","student");
	}
	if(person=="Teacher")
	{
		sessionStorage.setItem("teacherid", document.getElementById("password").value)
		window.open("test.html","teacher");
	}
	
}

function get_ip () {
	// body...
	return sessionStorage.getItem("studentid");
}

function get_channel () {

	// body...
	return sessionStorage.getItem("channel");
}
