import React, { Component } from 'react'
import { StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native'
import { Form, Item, Input, Label, Button, Text, Toast, View } from 'native-base'
import Action from '../action'
import Config from '../config'

const offset = (Platform.OS === 'android') ? -200 : 0;
export default class Register extends Component {
  
  constructor (props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      name: '',
      emailMode: {success: false, error: false},
      passwordMode: {success: false, error: false},
      nameMode: {success: false, error: false}
    }
  }

  componentWillMount(){
    this._logUserIfActive()
  }

  render () {
    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView keyboardVerticalOffset={offset} style={styles.keyboardAvoidContainer} behavior={'padding'}>
          <Text style={styles.registerText}>Register with us!</Text>
          <Form>
            <Item stackedLabel success={this.state.emailMode.success} error={this.state.emailMode.error}>
              <Label style={styles.fieldLabel}>Emails</Label>
              <Input placeholder={'john.doe@gmail.com'} value={this.state.email} onChangeText={(text)=>{
                this.setState({email: text})
                this._checkFieldValidity('email', text)
              }}/>
            </Item>
            <Item stackedLabel success={this.state.passwordMode.success} error={this.state.passwordMode.error}>
              <Label style={styles.fieldLabel}>Password</Label>
              <Input placeholder={'At least 6 chars of letters and numbers'} secureTextEntry value={this.state.password} onChangeText={(text)=>{
                this.setState({password: text})
                this._checkFieldValidity('password', text)
              }} />
            </Item>
            <Item stackedLabel success={this.state.nameMode.success} error={this.state.nameMode.error}>
              <Label style={styles.fieldLabel}>Name</Label>
              <Input placeholder={'Letters only'}  value={this.state.name} onChangeText={(text)=>{
                this.setState({name: text})
                this._checkFieldValidity('name', text)
              }} />
            </Item>
          </Form>
          <Button style={styles.formBtn} onPress={this._register} disabled={!this._isRegBtnEnabled()}>
            <Text>Register</Text>
          </Button>
          <Button transparent style={styles.formBtn} onPress={() => {
            this.props.navigation.navigate('Login')
          }}>
            <Text style={styles.loginLnk}>Login</Text>
          </Button>
        </KeyboardAvoidingView>
      </SafeAreaView>
    )
  }

  async _logUserIfActive() {
    let account = await Action.getLoginAccount()
    if (account) {
      this.props.navigation.navigate('Play')
    }
  }

  _checkFieldValidity(fieldType, text){
    const fieldsModes = {
      email: 'emailMode',
      password: 'passwordMode',
      name: 'nameMode'
    }

    const fieldsValidators = {
      email: Action.validateEmail,
      password: Action.validatePassword,
      name: Action.validateName
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

  _register = async () => {
    const result = await Action.register(this.state.email, this.state.password, this.state.name)
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

  _isRegBtnEnabled(){
    return (this.state.emailMode.success === true &&
    this.state.passwordMode.success === true &&
    this.state.nameMode.success === true)
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
