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
	let method = 'POST';
	let action = '/createPayment';
	
	//Change label if this is the update form
	if (props.isUpdate){
		costLabel = `Updated ${costLabel}`;
		dateLabel = `Updated ${dateLabel}`;
		method = 'PUT';
		action = '/updatePayment';
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
			<input className="input-button" date-provide="datepicker" data-date-format="mm/dd/yyyy" name="dueDate" placeholder="MM/DD/YYYY" />
			<input type="hidden" name="_csrf" value={props.csrf} />
			<input id="payment-form-submit" className="submit input-button" type="submit" value="Update Payment" />
		</form>
	);
};

//Function to render forms and setup page links
const setup = (csrf) => {
	document.getElementById('create-button').onclick = (e) => {
		ReactDOM.render(
			<PaymentForm csrf={csrf} />,
			document.getElementById("form-creation-content")
		);
	};
	
	document.getElementById('update-button').onclick = (e) => {
		ReactDOM.render(
			<PaymentForm csrf={csrf} isUpdate="true" />,
			document.getElementById("form-creation-content")
		);
	};
	
	document.getElementById('display-page-button').onclick = (e) => {
		sendAjax('GET', '/display', null, () => {});
	};
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