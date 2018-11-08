import React, {Component} from 'react';
import {
  Text,
  Easing,
  SafeAreaView,
  Animated,
  Dimensions,
  StyleSheet,
  View,
  Platform
} from 'react-native';
import Video from 'react-native-video';
import CircleButton from '../components/CircleButton'
import Action from '../action'
import Config from '../config'
import Emoji from 'react-native-emoji'

let {width} = Dimensions.get('window');
export default class Play extends Component {

  constructor(props) {
    super(props)

    this.state = {
      log: 'Please wait...',
      moveAnimation: new Animated.ValueXY({ x: width, y: 0 }),
      isSongAvailable: false,
      userName: '',
      isSongPlaying: false,
      repeat:true
    }
    
  }

  componentDidMount (){
    this._populateData()
  }

  render() {
    let iconPlayer = 'ios-play'
    if (this.state.isSongPlaying) {
      iconPlayer = 'ios-square'
    }

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.messageView}>
          <Text style={styles.messageTitle}>Welcome</Text>
          <Text style={styles.messageTitleUser}> {this.state.userName} </Text>
          <Text style={styles.messageTitle}>to paradise!</Text>
        </View>       
        <View style={styles.player}>
          <CircleButton disabled={!this.state.isSongAvailable} onPress={()=>{
            if (this.state.isSongPlaying) {
              this._stopPlay()
            } else {
              this._startPlay()
            }
          }} iconName={iconPlayer} size={72}/>  
        </View> 
        <Animated.View style={[this.state.moveAnimation.getLayout()]}>        
          <Emoji name="unicorn_face" style={{fontSize: Config.unicornSize}} />
        </Animated.View>
        <Text style={styles.log}>
          {this.state.log}
        </Text>
        <Video
          ref={(ref) => this.player = ref}
          repeat={this.state.repeat} 
          source={{uri: encodeURI(Config.songURL)}}
          onBuffer={()=> this.setState({log: 'Song buffering...'})}
          onError={()=> this.setState({log: 'Error loading song'})}    
          onEnd={()=> this._playAgain()}      
          onLoad={()=> this.setState({isSongAvailable: true, log: 'Song available'})}          
          paused={!this.state.isSongPlaying}
       />
        
       <View style={styles.exitBtn}>
          <CircleButton onPress={this._logout} iconName={'ios-log-out'} size={52}/>         
        </View> 
      </SafeAreaView>
      
    )
  }

  _animateStart = () => {
    Animated.timing(this.state.moveAnimation, {
      toValue: {x: -1 * Config.unicornSize, y: 0},
      duration: Config.unicornAnimateDuration,
      easing: Easing.linear
    }).start((done)=>{
      if (done.finished) {
        this.state.moveAnimation.setValue({ x: width, y: 0 })
        this._animateStart()
      }
    })    
  }  

  _playAgain(){
    if (Platform.OS === 'android') {
      this._stopPlay()
    }   
  }

  _startPlay(){
    this._animateStart()
    this.setState({isSongPlaying: true, repeat: true})
  }

  _stopPlay(){
    this.state.moveAnimation.stopAnimation((v)=>{
      this.state.moveAnimation.setValue({ x: width, y: 0 })
    })
    this.setState({isSongPlaying: false, repeat: false}, () => this.player.seek(0))      
  }  

  _logout = () => {
    this._stopPlay()
    Action.logout()
    this.props.navigation.push('Login', {logout: true})
  }

  async _populateData() {
    let account = await Action.getLoginAccount()
    if (account) {
      this.setState({
        userName: account.name
      })      
    }
  }  
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  messageView: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  messageTitle: {
    fontWeight: 'bold',
    fontSize: 24,
    color: '#222'
  },
  messageTitleUser: {
    fontWeight: 'bold',
    fontSize: 24,
    color: '#DF0065'
  },
  exitBtn: {
    position: 'absolute',
    bottom: 40,
    right: 40
  },
  player: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20
  },
  log: {
    textAlign: 'center',
    fontWeight: 'bold'
  }
});