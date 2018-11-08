//Function to send an AJAX request when a user creates or updates a payment
const handlePayment = (e) => {
	//Prevent the form from submitting
	e.preventDefault();
	
	//Handle invalid input
	if ($("#name").val() === '' || $("#cost").val() === '' || $("#dueDate").val() === ''){
		handleError("All fields are required");
		return false;
	}
	
	//Send the AJAX request
	sendAjax($("#payment-form").attr("method"), $("#payment-form").attr("action"), $("#payment-form").serialize(), redirect);
	
	//Prevent the form from changing pages
	return false;
};

//Function to use React to dynamically create the payment form
const PaymentForm = (props) => {
	let costLabel = 'Cost';
	let dateLabel = 'Due Date'
	let submitLabel = 'Create Payment';
	let method = 'POST';
	let action = '/createPayment';
	let createButtonClass = 'active-button';
	let updateButtonClass = 'inactive-button';
	
	//Change label if this is the update form
	if (props.isUpdate){
		costLabel = `Updated ${costLabel}`;
		dateLabel = `Updated ${dateLabel}`;
		submitLabel = 'Update Payment';
		method = 'PUT';
		action = '/updatePayment';
		createButtonClass = 'inactive-button';
		updateButtonClass = 'active-button';
	}
	
	return(
		<form id="payment-form" name="payment-form"
			onSubmit={handlePayment}
			action={action}
			method={method}>
			<label htmlFor="name">Payment</label>
			<input className="input-button" type="text" name="name" placeholder="Payment Name" />
			<label htmlFor="cost">{costLabel}</label>
			<input className="input-button" type="number" name="cost" placeholder="$Amount" />
			<label htmlFor="dueDate">{dateLabel}</label>
			<input className="input-button" id="datepicker" name="dueDate" placeholder="MM/DD/YYYY" />
			<input type="hidden" name="_csrf" value={props.csrf} />
			<input id="payment-form-submit" className="submit input-button" type="submit" value={submitLabel} />
		</form>
	);
};

//Function to render forms and setup page links
const setup = (csrf) => {
	const createButton = document.getElementById('create-button');
	const updateButton = document.getElementById('update-button');
	
	createButton.onclick = (e) => {
		ReactDOM.render(
			<PaymentForm csrf={csrf} />,
			document.getElementById("form-creation-content")
		);
		
		createButton.classList.add('active-button');
		createButton.classList.remove('inactive-button');
		
		updateButton.classList.add('inactive-button');
		updateButton.classList.remove('active-button');
		
		$("#datepicker").datepicker({
			format: 'mm/dd/yyyy',
			startDate: '-3d'
		});
	};
	
	updateButton.onclick = (e) => {
		ReactDOM.render(
			<PaymentForm csrf={csrf} isUpdate="true" />,
			document.getElementById("form-creation-content")
		);
		
		updateButton.classList.add('active-button');
		updateButton.classList.remove('inactive-button');
		
		createButton.classList.add('inactive-button');
		createButton.classList.remove('active-button');
		
		$("#datepicker").datepicker({
			format: 'mm/dd/yyyy',
			startDate: '-3d'
		});
	};
	
	document.getElementById('logout-button').onclick = () => {
		sendAjax('GET', '/logout', null, null);
	};
	
	document.getElementById('display-page-button').onclick = (e) => {
		sendAjax('GET', '/display', null, null);
	};
	
	ReactDOM.render(
		<PaymentForm csrf={csrf} />,
		document.getElementById("form-creation-content")
	);
	
	$("#datepicker").datepicker({
		format: 'mm/dd/yyyy',
		startDate: '-3d'
	});
};

//Function to get a CSRF token from the server for security
const getToken = () => {
	sendAjax('GET', '/getToken', null, (data) => {
		setup(data.csrfToken);
	});
};

//Note: $(document).ready() is similar to window.onload = init;
//Make a call to get the token and render the forms
//when the page loads
$(document).ready(function(){
	getToken();
});