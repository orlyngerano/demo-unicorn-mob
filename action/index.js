import { AsyncStorage } from 'react-native'

export default {
  register: async function (email, password, name) {
    const result = {
      ok: true,
      message: 'Account Registered'
    }

    let account = await AsyncStorage.getItem(email)
    if (account !== null) {
      result.message = 'Account already exist'
      return result
    }

    account = JSON.stringify({
      email: email,
      password: password,
      name: name
    })

    await AsyncStorage.multiSet([[email, account], ['login', account]])

    return result
  },
  login: async function (email, password) {
    const result = {
      ok: true,
      message: 'Success'
    }
    let account = await AsyncStorage.getItem(email)
    if (account !== null) {
      let accountObj = JSON.parse(account)
      if (accountObj.password === password) {
        await AsyncStorage.setItem('login', JSON.stringify(accountObj))
      } else {
        result.message = 'Wrong password'
        result.ok = false
      }
    } else {
      result.message = 'Account does not exist'
      result.ok = false
    }
    return result
  },
  logout: async function () {
    await AsyncStorage.removeItem('login')
    return true
  },
  getLoginAccount: async function () {
    const account = await AsyncStorage.getItem('login')
    if (account != null) {
      return JSON.parse(account)
    }
    return null
  },
  validateEmail: function (email) {
    return (/(.+)@(.+){2,}\.(.+){2,}/.test(email))
  },
  validatePassword: function (password) {
    return (/^[a-zA-z0-9]{6,}$/.test(password))
  },
  validateName: function (name) {
    return (/^[a-zA-z]+$/.test(name))
  }
}
