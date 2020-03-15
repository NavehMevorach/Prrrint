// Check for valid URL
export const validURL = url => {
  // OPTION 2
  const patternFacebook = new RegExp(
    /(https?)?:?(www)?facebook\.com\/(media).{3}/
  )
  const patternInstagram = new RegExp(
    /(https?)?:?(www)?instagram\.com\/[a-z0-9_].{3}/
  )
  const patternDrive = new RegExp(
    /(https?)?:?(www)?drive\.google\.com\/(drive)/
  )
  const patternPhotos = new RegExp(/(https?)?:?(www)?photos\.google\.com/)

  if (patternFacebook.test(url)) return true
  if (patternInstagram.test(url)) return true
  if (patternDrive.test(url)) return true
  if (patternPhotos.test(url)) return true

  return false
}

// Final Validation
export const finalShippingValidation = fields => {
  if (fields.includes('')) {
    return { status: false, message: '' }
  }
  const [name, last, email, , town, , amount] = fields
  if (!name.match(/[\u0590-\u05FF]/))
    return {
      status: false,
      message: 'The name field can only contain hebrew letters',
      field: 'name'
    }
  if (!last.match(/[\u0590-\u05FF]/))
    return {
      status: false,
      message: 'The last name field can only contain hebrew letters',
      field: 'last'
    }
  const emailRe = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  if (!email.toLowerCase().match(emailRe))
    return {
      status: false,
      message: 'The email is not valid please try again',
      field: 'email'
    }
  if (!town.match(/[\u0590-\u05FF]/))
    return {
      status: false,
      message: 'The town field can only contain hebrew letters',
      field: 'town'
    }
  if (!amount.match(/^[1-9]\d*$/) || (amount * 1 <= 1000 && amount * 1 >= 30)) {
    return {
      status: false,
      message: 'Please write a number between: 30 - 1000',
      field: 'amount'
    }
  }

  return { status: true, data: [...fields] }
}
// Dynamic Validation
export const dynamicShippingValidation = field => {
  // Name Validation
  const value = field.value
  const name = field.id
  if (name === 'name' || name === 'last' || name === 'town') {
    const re = /[\u0590-\u05FF]/
    if (value.match(re)) {
      return true
    }
    return false
  }
  // Email Validation
  else if (name === 'email') {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if (value.toLowerCase().match(re)) {
      return true
    }
    return false
  } else if (name === 'amount') {
    if (value.match(/^[0-9]*$/) && value * 1 <= 1000 && value * 1 >= 30) {
      return true
    }
    return false
  }
  return !!value
}
