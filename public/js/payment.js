import axios from 'axios'
paypal
  .Buttons({
    onClick: function() {
    },
    createOrder: function(data, actions) {
      // This function sets up the details of the transaction, including the amount and line item details.
      return actions.order.create({
        purchase_units: [
          {
            amount: {
              currency: 'ILS',
              details: {
                subtotal: '1.09',
                shipping: '0.02',
                tax: '0.33'
              },
              total: '1.44'
            },
            payee: {
              email: 'seller@example.com'
            },
            shipping_address: {
              line1: '2211 N First Street',
              line2: 'Building 17',
              city: 'San Jose',
              country_code: 'Israel',
              postal_code: '95131'
            },
            redirect_urls: {
              return_url: 'https://example.com/return',
              cancel_url: 'https://example.com/cancel'
            },
            items: [
              {
                name: 'NeoPhone',
                price: '0.54',
                currency: 'ILS',
                quantity: '1'
              }
            ]
          }
        ]
      })
    },
    onApprove: function(data, actions) {
      // This function captures the funds from the transaction.
      return actions.order.capture().then(function(details) {
        // This function shows a transaction success message to your buyer.
        alert('Transaction completed by ' + details.payer.name.given_name)

         // Call your server to save the transaction
         return axios.post('/paypal-transaction-complete', {
            orderID: data.orderID
         })
      })
    }
  })
  .render('#paypal-button-container')
