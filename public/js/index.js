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



// https://api.instagram.com/oauth/authorize
//   ?client_id=2844179692295387
//   &redirect_uri=https://prrrint.herokuapp.com/
//   &scope=user_profile,user_media
//   &response_type=code

 
  // https://api.instagram.com/oauth/access_token \
  // -F client_id=2844179692295387 \
  // -F client_secret=6e83d43ab2064f1cca06d3e454799d9f \
  // -F grant_type=authorization_code \
  // -F redirect_uri=https://prrrint.herokuapp.com/ \
  // -F code= AQAvoJmNTGjWctZX_I_qd5GlSdGPtLjUN5S5TyiChkI55cFqFmYxIPpV1lqHz6TgLQ1U33XHg0KXzr5WStmDp1rjBrwriPVuiZWrFTTU_STru0yo7FmBSnpOPfKC48hVi5TBdStSoU4rMmBdGG_mAEDobUQjxBsN7GFyXJ_JeuSFi2Nd6SwTDf5bwsTMfM_P4UHsyNz8KssF6lKy3ocJ8GrJ5Nweo3MbYbn3mAZhlIkh2A

  // IGQVJXY3ZAQSmIzVi1xNUE0eThQTEIzeWp6UVVad3VEdDZAuQ2NlUkFucVVmY0sxLVNNTUcxTjh5ZAFVNUzBpTWJMX3NLdVlqTWNTUTlObFE1Y084ZAnNlTF9vWF9fWFhSZAEU0WmF2aWhUbng0N3hLZAHNkQTByV2RRYlpFbUxR
  // 17841400032482437


  // https://graph.instagram.com/17841400032482437?fields=id,username&access_token=IGQVJXY3ZAQSmIzVi1xNUE0eThQTEIzeWp6UVVad3VEdDZAuQ2NlUkFucVVmY0sxLVNNTUcxTjh5ZAFVNUzBpTWJMX3NLdVlqTWNTUTlObFE1Y084ZAnNlTF9vWF9fWFhSZAEU0WmF2aWhUbng0N3hLZAHNkQTByV2RRYlpFbUxR


  // https://graph.instagram.com/me?fields=id,username&access_token=IGQVJ...