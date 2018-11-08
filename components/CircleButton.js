import React from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import Config from '../config'

const CircleButton = function (props) {
  const halfSize = props.size / 2
  const btnStyle = {
    width: props.size,
    height: props.size,
    borderRadius: halfSize
  }

  if (props.disabled) {
    btnStyle['opacity'] = 0.5
  }

  return (
    <TouchableOpacity disabled={props.disabled} onPress={props.onPress} activeOpacity={0.5}>
      <View style={[btnStyle, styles.container, props.style]}>
        <Icon name={props.iconName} size={halfSize} color={'#fff'} />
      </View>
    </TouchableOpacity>
  )
}

CircleButton.propTypes = {
  iconName: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  style: PropTypes.any,
  size: PropTypes.number.isRequired,
  disabled: PropTypes.bool
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Config.primaryColor,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export default CircleButton
