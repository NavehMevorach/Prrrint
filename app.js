const path = require('path')
const express = require('express')
const Customer = require('./models/customerModel')
const nodemailer = require('nodemailer')
const paypal = require('@paypal/checkout-server-sdk')
const client = require('./paypalConfig')

// Create the express App
const app = express()

// 1) Global MiddleWare
// Serving static files
app.use(express.static(path.join(__dirname, 'public')))

// Body Parser - Reading data from body into req.body
app.use(
  express.json({
    limit: '10kb'
  })
)

// EMAIL SENDER FUNCTION
const sendPasswordReset = async (user, address) => {
  const transport = nodemailer.createTransport({
    service: 'SendGrid',
    auth: {
      user: process.env.SENDGRID_USERNAME,
      pass: process.env.SENDGRID_PASSWORD
    }
    // host: process.env.EMAIL_HOST,
    // port: process.env.EMAIL_PORT,
    // auth: {
    //   user: process.env.EMAIL_USERNAME,
    //   pass: process.env.EMAIL_PASSWORD
    // }
  })
  // Render a template

  // Define the Email Options
  const mailOptions = {
    from: `Jonas Schmedtmann <${process.env.EMAIL_FROM}>`,
    to: user.email,
    subject: 'Transaction Verification',
    text: 'htmlToText.fromString(html)'
  }
  // Create a transport
  await transport.sendMail(mailOptions)
}

// --- Routes ---

app.get('/', async (req, res) => {
  // Send static page
  res.sendFile('Index.html');
})


app.post('/paypal-transaction-complete', async (req, res) => {
  // 1. Get the order ID from the request body
  const orderID = req.body.orderID
  const url = req.body.url.trim()

  // 2. Call PayPal to get the transaction details
  let request = new paypal.orders.OrdersGetRequest(orderID)
  let data
  let order
  try {
    order = await client().execute(request)
    const orderShort = order.result.purchase_units[0].shipping
    const email = order.result.payer.email_address
    data = { ...orderShort.address, ...orderShort.name, url, email }
  } catch (err) {
    // 3. Handle any errors from the call
    console.error(err)
    return res.status(500).json({
      status: 'failed',
      message: 'Failed to verify the transaction'
    })
  }
  try {
    // 4. Save the transaction in your database
    const doc = await Customer.create(data)
  } catch (err) {
    console.error(err)
    return res.status(500).json({
      status: 'failed',
      message: 'Failed to upload the data to the DB'
    })
  }
  try {
    // Send EMAIL to the client
    await sendPasswordReset(data)
  } catch (err) {
    console.error(err)
    return res.status(500).json({
      status: 'failed',
      message: 'Failed to send the email to the client'
    })
  }

  // 5. Return a successful response to the client
  return res.status(200).json({
    status: 'success',
    message: 'The transaction been verified'
  })
})

module.exports = app

/*
-- TODO --
 Add Trim to the validation of url
 3. Deploy to heroku and only then purchase a cheap domain name.
 4. Send the website to few friends for validation (with  the fake sb paypal)
 5. add the real PAYPAL 
 6. improve seo
 7. Do research for the process behind the app - Who to work with, Prices, Shipping price 
 8. Research for Google adwords

*/
