function open_win(myip) 
{
	var index=document.getElementById("username");
	var person=index.options[index.selectedIndex].innerHTML;
	sessionStorage.setItem("studentchannel",document.getElementById("password").value);
	sessionStorage.setItem("studentid", myip);
	sessionStorage.setItem("teacherchannel",document.getElementById("password").value);
	sessionStorage.setItem("teacherid", document.getElementById("password").value)
	//var person="student"
	if(person=="Student")
	{	

		window.open("button.html","student");
	}
	if(person=="Teacher")
	{

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
