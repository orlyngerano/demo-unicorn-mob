import React, { Component } from 'react'
import { StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native'
import { Form, Item, Input, Label, Button, Text, Toast } from 'native-base'
import Action from '../action'
import Config from '../config'

const offset = (Platform.OS === 'android') ? -200 : 0;
export default class Login extends Component {
  
  constructor (props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      emailMode: {success: false, error: false},
      passwordMode: {success: false, error: false}
    }
  }

  componentWillMount(){
    if (this.props.navigation.getParam('logout') === true){
      alert('You got logged out!')
    }
  }

  render () {
    
    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView keyboardVerticalOffset={offset} style={styles.keyboardAvoidContainer} behavior={'padding'}>
          <Text style={styles.registerText}>Login</Text>
          <Form>
            <Item floatingLabel success={this.state.emailMode.success} error={this.state.emailMode.error}>
              <Label style={styles.fieldLabel}>Email</Label>
              <Input value={this.state.email} onChangeText={(text)=>{
                this.setState({email: text})
                this._checkFieldValidity('email', text)
              }}/>
            </Item>
            <Item floatingLabel success={this.state.passwordMode.success} error={this.state.passwordMode.error}>
              <Label style={styles.fieldLabel}>Password</Label>
              <Input secureTextEntry value={this.state.password} onChangeText={(text)=>{
                this.setState({password: text})
                this._checkFieldValidity('password', text)
              }} />
            </Item>
          </Form>
          <Button style={styles.formBtn} onPress={this._login} disabled={!this._isLogBtnEnabled()}>
            <Text>Login</Text>
          </Button>
          <Button transparent style={styles.formBtn} onPress={() => {
            this.props.navigation.navigate('Register')
          }}>
            <Text style={styles.loginLnk}>Register</Text>
          </Button>
        </KeyboardAvoidingView>
      </SafeAreaView>
    )
  }

  _checkFieldValidity(fieldType, text){
    const fieldsModes = {
      email: 'emailMode',
      password: 'passwordMode'
    }

    const fieldsValidators = {
      email: Action.validateEmail,
      password: Action.validatePassword
    }    

    if (text.length === 0) {
      this.setState({[fieldsModes[fieldType]]: {success: false, error: false}})
    } else {
      const valid = fieldsValidators[fieldType](text)
      this.setState({[fieldsModes[fieldType]]: {
        success: valid, 
        error: !valid}})
    }
  }

  _login = async () => {
    const result = await Action.login(this.state.email, this.state.password)
    if (result.ok === false) {
      Toast.show({
        text: result.message,
        type: 'danger',
        duration: 3000
      })
    } else {
      this.props.navigation.navigate('Play')
    }
  }

  _isLogBtnEnabled(){
    return (this.state.emailMode.success === true &&
    this.state.passwordMode.success === true)
  }  
}

let styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  keyboardAvoidContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20
  },
  formBtn: {
    marginTop: 50,
    width: '100%',
    justifyContent: 'center'
  },
  loginLnk: {
    color: Config.primaryColor
  },
  fieldLabel: {
    fontWeight: 'bold'
  },
  registerText:{
    fontWeight: 'bold',
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 15
  }
})
