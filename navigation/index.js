import { createStackNavigator } from 'react-navigation'
import {LoginScreen, PlayScreen, RegisterScreen} from '../screen'

export default createStackNavigator({
  Register: {
    screen: RegisterScreen,
    navigationOptions: {
      header: null
    }
  },
  Login: {
    screen: LoginScreen,
    navigationOptions: {
      header: null
    }
  },
  Play: {
    screen: PlayScreen,
    navigationOptions: {
      header: null
    }
  }
})
