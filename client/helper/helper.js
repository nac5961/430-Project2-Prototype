//Function to display errors
const handleError = (message) => {
	//const errorMessage = document.querySelector("#errorMessage");
	//errorMessage.textContent = message;
	console.log(message);
};

//Function to redirect the user to another page
const redirect = (response) => {
	window.location = response.redirect;
};

//Function to send an AJAX request to the server
const sendAjax = (type, action, data, callback) => {
	$.ajax({
		cache: false,
		type: type,
		url: action,
		data: data,
		dataType: "json",
		success: function(json){
			callback(json);
		},
		error: function(xhr, status, error){
			var messageObj = JSON.parse(xhr.responseText);
			handleError(messageObj.error);
		}
	});
};