import '@babel/polyfill'
import { validURL } from './validation'
import axios from 'axios'

const searchInput = document.querySelector('.header__search')
const photoInput = document.querySelector('.header__photos')
const photoError = document.querySelector('.err-message--photo')
const searchError = document.querySelector('.err-message--search')

let url
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
      if (serverRes.data.status === 'success')
        window.location.href = '/success.html'
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

const getUserInfo = async (userProfile = '3lianaxz') => {
  var response = await axios.get(
    `https://www.instagram.com/${userProfile}/?__a=1`
  )
  const userInfo = response.data.graphql.user
  const allURL = userInfo.edge_owner_to_timeline_media.edges.map(
    el => el.node.display_url
  )
}

getUserInfo()
