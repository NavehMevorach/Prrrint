import axios from 'axios'


// Change Progress Bar
const changeNavActiveStep = num => {
  document.querySelectorAll('.header__nav p').forEach(el => {
    const stepNum = parseInt(el.textContent.split(' ')[1], 10)
    if (stepNum === num) {
      el.classList.add('active')
    } else {
      el.classList.remove('active')
    }
  })
}

// Change The Display to different step
let lastStep
export const changeStep = (toStepNum, direction) => {
  if (true) {
    // Send URL to server
    if (direction === 'forward') {
      // Change Display to the Next step
      document
        .querySelector(`.stage-${toStepNum - 1}`)
        .classList.toggle('form--hide')
      document
        .querySelector(`.stage-${toStepNum - 1}`)
        .classList.toggle('form--show')
      document
        .querySelector(`.stage-${toStepNum}`)
        .classList.toggle('form--show')
      document
        .querySelector(`.stage-${toStepNum}`)
        .classList.toggle('form--hide')
    } else {
      if (lastStep === 3) {
        // document
        //   .querySelector(`.stage-${toStepNum + 2}`)
        //   .classList.add('form--hide')
        // document
        //   .querySelector(`.stage-${toStepNum + 2}`)
        //   .classList.remove('form--show')
        location.reload(true)
      } else {
        document
          .querySelector(`.stage-${toStepNum + 1}`)
          .classList.add('form--hide')
        document
          .querySelector(`.stage-${toStepNum + 1}`)
          .classList.remove('form--show')
        document
          .querySelector(`.stage-${toStepNum}`)
          .classList.add('form--show')
        document
          .querySelector(`.stage-${toStepNum}`)
          .classList.remove('form--hide')
      }
    }
    lastStep = toStepNum

    // document.querySelector(`.stage-${countProcessStage}`).style.display = 'none'
    // countProcessStage === 3 ? (countProcessStage = 1) : (countProcessStage += 1)
    // document.querySelector(`.stage-${countProcessStage}`).style.display =
    //   countProcessStage === 2 ? 'grid' : 'flex'

    // Change the progress bar
    changeNavActiveStep(toStepNum)
  } else {
    window.alert('Error')
  }
}

// Send The URL to the server
export const sendUrl = async url => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:8000/api/v1/send-url',
      data: {
        url
      }
    })
  } catch (err) {
    throw err
  }
}

export const removeErrorMsg = fields => {
  fields.forEach(el => el.classList.remove('err-message--show'))
} 
