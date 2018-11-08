'use strict';

//Function to make an AJAX request to get the payments from the server
var loadAllPayments = function loadAllPayments(csrf) {
	sendAjax('GET', '/getPayments', null, function (data) {
		ReactDOM.render(React.createElement(PaymentList, { csrf: csrf, payments: data.payments }), document.getElementById('results-content'));
	});
};

//Function to dynamically create the UI for displaying the payments
var PaymentList = function PaymentList(props) {
	//Render UI that says no payments were found
	if (props.payments.length === 0) {
		return React.createElement(
			'div',
			null,
			React.createElement(
				'h3',
				{ id: 'not-found', className: 'highlight' },
				'No payments were found'
			)
		);
	}

	var today = new Date();
	today.setDate(today.getDate() - 1);
	var tomorrow = new Date();
	var dayAfterTomorrow = new Date();
	dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);

	//Use array.map to create UI for each payment
	var paymentNodes = props.payments.map(function (payment) {
		var timeLeft = void 0;
		var timeIcon = 'clock-icon';
		var dueDate = new Date(payment.dueDate);
		var dueDateString = dueDate.getMonth() + 1 + '/' + dueDate.getDate() + '/' + dueDate.getFullYear();

		if (dueDate < today) {
			timeLeft = 'Overdue';
			timeIcon = 'overdue-icon';
		} else if (dueDate < tomorrow) {
			timeLeft = 'Today';
		} else if (dueDate < dayAfterTomorrow) {
			timeLeft = 'Tomorrow';
		} else {
			timeLeft = 'Later';
		}

		return React.createElement(
			'div',
			{ className: 'payment' },
			React.createElement(
				'h3',
				{ className: 'payment-name highlight' },
				payment.name
			),
			React.createElement(
				'h3',
				{ className: 'payment-cost highlight' },
				'$',
				payment.cost
			),
			React.createElement(
				'div',
				{ className: 'payment-icons-container' },
				React.createElement(
					'ul',
					{ className: 'date-icons' },
					React.createElement(
						'li',
						{ className: 'calendar-icon' },
						dueDateString
					),
					React.createElement(
						'li',
						{ className: timeIcon },
						timeLeft
					)
				),
				React.createElement(
					'ul',
					{ className: 'options-icons' },
					React.createElement(
						'li',
						{ className: 'edit-icon' },
						'Edit'
					),
					React.createElement(
						'li',
						{ className: 'delete-icon' },
						'Delete'
					)
				)
			)
		);
	});

	//Render the list we just created
	return React.createElement(
		'div',
		null,
		paymentNodes
	);
};

//Function to render forms and setup page links
var setup = function setup(csrf) {
	loadAllPayments(csrf);

	document.getElementById('logout-button').onclick = function () {
		sendAjax('GET', '/logout', null, null);
	};

	document.getElementById('create-page-button').onclick = function () {
		sendAjax('GET', '/create', null, null);
	};
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
