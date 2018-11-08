"use strict";

//Function to send an AJAX request when a user creates or updates a payment
var handlePayment = function handlePayment(e) {
	//Prevent the form from submitting
	e.preventDefault();

	//Handle invalid input
	if ($("#name").val() === '' || $("#cost").val() === '' || $("#dueDate").val() === '') {
		handleError("All fields are required");
		return false;
	}

	//Send the AJAX request
	sendAjax($("#payment-form").attr("method"), $("#payment-form").attr("action"), $("#payment-form").serialize(), redirect);

	//Prevent the form from changing pages
	return false;
};

//Function to use React to dynamically create the payment form
var PaymentForm = function PaymentForm(props) {
	var costLabel = 'Cost';
	var dateLabel = 'Due Date';
	var submitLabel = 'Create Payment';
	var method = 'POST';
	var action = '/createPayment';
	var createButtonClass = 'active-button';
	var updateButtonClass = 'inactive-button';

	//Change label if this is the update form
	if (props.isUpdate) {
		costLabel = "Updated " + costLabel;
		dateLabel = "Updated " + dateLabel;
		submitLabel = 'Update Payment';
		method = 'PUT';
		action = '/updatePayment';
		createButtonClass = 'inactive-button';
		updateButtonClass = 'active-button';
	}

	return React.createElement(
		"form",
		{ id: "payment-form", name: "payment-form",
			onSubmit: handlePayment,
			action: action,
			method: method },
		React.createElement(
			"label",
			{ htmlFor: "name" },
			"Payment"
		),
		React.createElement("input", { className: "input-button", type: "text", name: "name", placeholder: "Payment Name" }),
		React.createElement(
			"label",
			{ htmlFor: "cost" },
			costLabel
		),
		React.createElement("input", { className: "input-button", type: "number", name: "cost", placeholder: "$Amount" }),
		React.createElement(
			"label",
			{ htmlFor: "dueDate" },
			dateLabel
		),
		React.createElement("input", { className: "input-button", id: "datepicker", name: "dueDate", placeholder: "MM/DD/YYYY" }),
		React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
		React.createElement("input", { id: "payment-form-submit", className: "submit input-button", type: "submit", value: submitLabel })
	);
};

//Function to render forms and setup page links
var setup = function setup(csrf) {
	var createButton = document.getElementById('create-button');
	var updateButton = document.getElementById('update-button');

	createButton.onclick = function (e) {
		ReactDOM.render(React.createElement(PaymentForm, { csrf: csrf }), document.getElementById("form-creation-content"));

		createButton.classList.add('active-button');
		createButton.classList.remove('inactive-button');

		updateButton.classList.add('inactive-button');
		updateButton.classList.remove('active-button');

		$("#datepicker").datepicker({
			format: 'mm/dd/yyyy',
			startDate: '-3d'
		});
	};

	updateButton.onclick = function (e) {
		ReactDOM.render(React.createElement(PaymentForm, { csrf: csrf, isUpdate: "true" }), document.getElementById("form-creation-content"));

		updateButton.classList.add('active-button');
		updateButton.classList.remove('inactive-button');

		createButton.classList.add('inactive-button');
		createButton.classList.remove('active-button');

		$("#datepicker").datepicker({
			format: 'mm/dd/yyyy',
			startDate: '-3d'
		});
	};

	document.getElementById('logout-button').onclick = function () {
		sendAjax('GET', '/logout', null, null);
	};

	document.getElementById('display-page-button').onclick = function (e) {
		sendAjax('GET', '/display', null, null);
	};

	ReactDOM.render(React.createElement(PaymentForm, { csrf: csrf }), document.getElementById("form-creation-content"));

	$("#datepicker").datepicker({
		format: 'mm/dd/yyyy',
		startDate: '-3d'
	});
};

//Function to get a CSRF token from the server for security
var getToken = function getToken() {
	sendAjax('GET', '/getToken', null, function (data) {
		setup(data.csrfToken);
	});
};

//Note: $(document).ready() is similar to window.onload = init;
//Make a call to get the token and render the forms
//when the page loads
$(document).ready(function () {
	getToken();
});
"use strict";

//Function to display errors
var handleError = function handleError(message) {
	//const errorMessage = document.querySelector("#errorMessage");
	//errorMessage.textContent = message;
	console.log(message);
};

//Function to redirect the user to another page
var redirect = function redirect(response) {
	window.location = response.redirect;
};

//Function to send an AJAX request to the server
var sendAjax = function sendAjax(type, action, data, callback) {
	$.ajax({
		cache: false,
		type: type,
		url: action,
		data: data,
		dataType: "json",
		success: function success(json) {
			callback(json);
		},
		error: function error(xhr, status, _error) {
			var messageObj = JSON.parse(xhr.responseText);
			handleError(messageObj.error);
		}
	});
};
