//Function to make an AJAX request to get the payments from the server
const loadAllPayments = (csrf) => {
	sendAjax('GET', '/getPayments', null, (data) => {
		ReactDOM.render(
			<PaymentList csrf={csrf} payments={data.payments} />,
			document.getElementById('results-content')
		);
	});
};

//Function to dynamically create the UI for displaying the payments
const PaymentList = (props) => {
	//Render UI that says no payments were found
	if (props.payments.length === 0){
		return(
			<div>
				<h3 id="not-found" className="highlight">No payments were found</h3>
			</div>
		);
	}
	
	const today = new Date();
	today.setDate(today.getDate() - 1);
	const tomorrow = new Date();
	const dayAfterTomorrow = new Date();
	dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);
	
	//Use array.map to create UI for each payment
	const paymentNodes = props.payments.map((payment) => {
		let timeLeft;
		let timeIcon = 'clock-icon';
		const dueDate = new Date(payment.dueDate);
		const dueDateString = `${dueDate.getMonth() + 1}/${dueDate.getDate()}/${dueDate.getFullYear()}`;
		
		if (dueDate < today){
			timeLeft = 'Overdue';
			timeIcon = 'overdue-icon';
		}
		else if (dueDate < tomorrow){
			timeLeft = 'Today';
		}
		else if (dueDate < dayAfterTomorrow){
			timeLeft = 'Tomorrow';
		}
		else{
			timeLeft = 'Later';
		}
		
		
		return(
			<div className="payment">
				<h3 className="payment-name highlight">{payment.name}</h3>
				<h3 className="payment-cost highlight">${payment.cost}</h3>
				<div className="payment-icons-container">
					<ul className="date-icons">
						<li className="calendar-icon">{dueDateString}</li>
						<li className={timeIcon}>{timeLeft}</li>
					</ul>
					<ul className="options-icons">
						<li className="edit-icon">Edit</li>
						<li className="delete-icon">Delete</li>
					</ul>
				</div>
			</div>
		);
	});
	
	//Render the list we just created
	return(
		<div>
			{paymentNodes}
		</div>
	);
};

//Function to render forms and setup page links
const setup = (csrf) => {
	loadAllPayments(csrf);
	
	document.getElementById('logout-button').onclick = () => {
		sendAjax('GET', '/logout', null, null);
	};
	
	document.getElementById('create-page-button').onclick = () => {
		sendAjax('GET', '/create', null, null);
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