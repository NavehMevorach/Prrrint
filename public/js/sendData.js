import axios from 'axios'
const sendData = async data => {
    try {
      const res = await axios.post('/api/v1/send-data', {
        name: data[0],
        email: data[1],
        country: data[2],
        address: data[3],
        zipCode: data[4],
        photoAmount: data[6],
        closingPrice: data[7],
        url: data[8]
      });
      if (res.data.status === 'success') {
        console.log('Your data been saved')
      }
    } catch (err) {
      console.log(err)
      throw err
    }
  }
export default sendData
