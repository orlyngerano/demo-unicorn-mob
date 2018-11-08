import React, {Component} from 'react'
import { Root } from 'native-base'
import RootNav from './navigation'
export default class App extends Component {
  render () {
    return (
      <Root>
        <RootNav />
      </Root>
    )
  }
}
