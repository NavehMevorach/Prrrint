import '@babel/polyfill'
import { validURL } from './validation'
import axios from 'axios'

const searchInput = document.querySelector('.header__search')
const photoInput = document.querySelector('.header__photos')
const photoError = document.querySelector('.err-message--photo')
const searchError = document.querySelector('.err-message--search')

let url
let actionStatus
let price

paypal
  .Buttons({
    style: {
      color: 'blue'
    },
    onClick: function(data, actions) {
      url = searchInput.value
      const isURL = validURL(url)
      if (isURL) {
        // Remove Existing Error message
        if (searchError.classList[2]) {
          searchError.classList.remove('err-message--show')
        }
        if (photoInput.value && photoInput.value * 1 >= 30) {
          // Remove previous Error messages
          photoError.classList.remove('err-message--show')
          // Calculate the price
          const photoAmount =
            document.querySelector('.header__photos').value * 1
          price = String(0.9 * photoAmount)
          // Enable The Paypal Button
          return true
        } else {
          photoError.classList.add('err-message--show')
          return false
        }
      } else {
        searchError.classList.add('err-message--show')
        return false
      }
    },
    enableStandardCardFields: true,
    createOrder: function(data, actions) {
      return actions.order.create({
        purchase_units: [
          {
            amount: {
              value: price,
              currency_code: 'ILS'
            }
          }
        ]
      })
    },
    onApprove: async (data, actions) => {
      actions.order.capture()
      // Call your server to save the transaction
      const serverRes = await axios.post('/paypal-transaction-complete', {
        orderID: data.orderID,
        url: searchInput.value
      })
      console.log(serverRes)
      if (serverRes.data.status === 'success') window.location.href = '/success.html'
    },
    onError: function(err, data) {
      // Show an error page here, when an error occurs
      console.log(err)
      console.log(data)
      // Redirect to an Error Page...
      window.location.href = '/error.html'

    }
  })
  .render('#paypal-button-container')

// SELECT ALL THE NECESSARY ELEMENTS FROM THE DOCUMENT
// const goToStepTwoBtn = document.querySelector('.header__submit')
// const paypalBtn = document.querySelector('.paypal-btn')
// const goToHomepageBtn = document.querySelector('.go-to-homepage')
// const goStepBackBtn = document.querySelector('.header__nav-step--1')
// const allInputs = document.querySelectorAll('.shipping__input')
// let status, message, field, data

// goToStepTwoBtn.addEventListener('click', e => {
//   e.preventDefault()
//   //  URL validation
//   url = searchInput.value
//   const isURL = validURL(url)
//   if (isURL) {
//     // Remove Existing Error message
//     if (searchInput.nextElementSibling.classList[1]) {
//       searchInput.nextElementSibling.classList.remove('err-message--show')
//     }
//     // Change Display to the next Shipping form
//     changeStep(2, 'forward')

//     // ADD EVENT LISTENER TO GO  STEP BACK BTN
//     goStepBackBtn.addEventListener(
//       'click',
//       () => {
//         changeStep(1)
//       },
//       { once: true }
//     )
//   } else {
//     searchInput.nextElementSibling.classList.add('err-message--show')
//   }
// })

// Track after changes in the shipping form
// and inform the client if he enter the correct data

// allInputs.forEach(el =>
//   el.addEventListener('input', () => {
//     // Need to Fix it!!! Right now it sending the first argument in the array for each field
//     dynamicShippingValidation(el)
//       ? (el.style.borderBottomColor = 'green')
//       : (el.style.borderBottomColor = 'red')
//   })
// )

/*
// Send the client to homepage
goToHomepageBtn.addEventListener('click', e => {
  e.preventDefault()
  // Reload the page and go back to Hope page
  location.reload(true)
})

*/

/*
goToPaymentBtn.addEventListener('click', e => {
  e.preventDefault()
  const ShippingDetailsArr = Array.from(allInputs).map(el => el.value.trim())
  const { status, message, field, data } = finalShippingValidation(
    ShippingDetailsArr
  )
  if (status) {
    removeErrorMsg(document.querySelectorAll('.err-message'))

    // Get the Photos Amount value and calculate the price
    const photosAmount = data[5] === 'all' ? 1000 : data[5] * 1
    const photosPrice = photosAmount * 0.9

    const updatedData = [...data, photosAmount, photosPrice, url]

    // Send all the data to the server
    sendData(updatedData)

    // Go to payment get away

    // Send to thank you page
    changeStep(3, 'forward')
  } else {
    removeErrorMsg(document.querySelectorAll('.err-message'))
    if (!message) {
      goToPaymentBtn.nextElementSibling.classList.add('err-message--show')
    } else {
      const selectedField = document.getElementById(field).nextElementSibling
      selectedField.textContent = message
      selectedField.classList.add('err-message--show')
    }
  }
})

*/

// onClick: function() {
//   const ShippingDetailsArr = Array.from(allInputs).map(el =>
//     el.value.trim()
//   )
//   const validationRes = finalShippingValidation(ShippingDetailsArr)

//   ;({ status, message, field, data } = validationRes)
//   // Show a validation error if the checkbox is not checked
//   if (status) {
//     removeErrorMsg(document.querySelectorAll('.err-message'))

//     // Get the Photos Amount value and calculate the price

//     data[7] = String(parseInt(data[7], 10) * 0.9)
//     console.log(data[0])

//     // Send all the data to the server
//     actionStatus.enable()
//   } else {
//     // actionStatus.disable()
//     removeErrorMsg(document.querySelectorAll('.err-message'))
//     if (!message) {
//       paypalBtn.nextElementSibling.classList.add('err-message--show')
//     } else {
//       const selectedField = document.getElementById(field)
//         .nextElementSibling
//       selectedField.textContent = message
//       selectedField.classList.add('err-message--show')
//     }
//   }
// }
