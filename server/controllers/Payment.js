// Import custom files
const models = require('../models');

// Get the Payment Model
const Payment = models.Payment;

// Function to display the creation/update page
const creationPage = (req, res) => res.render('create', { csrfToken: req.csrfToken() });

// Function to display the display page
const displayPage = (req, res) => {
  Payment.PaymentModel.findAllByOwner(req.session.account._id, (err, docs) => {
		// Check for errors
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

		// Render the page with the data
    return res.render('display', { csrfToken: req.csrfToken(), payments: docs });
  });
};

// Function to get all the payments for the user
const getAllPayments = (req, res) => {
  Payment.PaymentModel.findAllByOwner(req.session.account._id, (err, docs) => {
		// Check for errors
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

		// Send the data in the response
    return res.json({ payments: docs });
  });
};

// Function to create a payment
const createPayment = (req, res) => {
  const name = `${req.body.name}`;
  const cost = req.body.cost;
  const today = new Date();
  today.setDate(today.getDate() - 1);
  const dueDate = new Date(req.body.dueDate);

	// Validate data
  if (!name || !cost || !dueDate) {
    return res.status(400).json({ error: 'All fields are required' });
  }

	// Make sure due date is not before the current data
  if (dueDate < today) {
    return res.status(400).json({ error: 'Due date must be today or later' });
  }

	// Create the data to save to the database
  const paymentData = {
    ownerId: req.session.account._id,
    name,
    cost,
    dueDate,
  };

	// Create a new document with that data to save to the database
  const newPayment = new Payment.PaymentModel(paymentData);

	// Perform the save
  const savePromise = newPayment.save();

	// If save successful (redirect to display page)
  savePromise.then(() => {
    res.json({ redirect: '/display' });
  });

	// If save failed (notify user)
  savePromise.catch((err) => {
    console.log(err);

    if (err.code === 11000) {
      return res.status(400).json({ error: 'Payment already exists' });
    }

    return res.status(400).json({ error: 'An error occurred' });
  });

  return savePromise;
};

// Function to update a payment
const updatePayment = (req, res) => {
  const name = `${req.body.name}`;
  const cost = req.body.cost;
  const dueDate = new Date(req.body.dueDate);

	// Validate data
  if (!name || !cost || !dueDate) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const updatedPayment = {
    cost,
    dueDate,
  };

  return Payment.PaymentModel.updateOneByOwner(name, req.session.account._id, updatedPayment,
  (err, doc) => {
	// Check for errors
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

		// No document returned, notify user
    if (!doc) {
      console.log('no match');
      return res.json({ redirect: '/create' });
    }

    console.log('match');
    return res.json({ redirect: '/display' });
  });
};

// Function to delete a payment
const deletePayment = (req, res) => {
  const name = `${req.body.name}`;

	// Validate data
  if (!name) {
    return res.status(400).json({ error: 'Payment name is required' });
  }

  return Payment.PaymentModel.deleteOneByOwner(name, req.session.account._id, (err, doc) => {
		// Check for errors
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

		// Nothing deleted (notify user)
    if (!doc) {
      return res.json({ message: 'Invalid payment name' });
    }

    return res.json({ message: 'Payment Deleted' });
  });
};

module.exports = {
  creationPage,
  displayPage,
  getAllPayments,
  create: createPayment,
  update: updatePayment,
  remove: deletePayment,
};
