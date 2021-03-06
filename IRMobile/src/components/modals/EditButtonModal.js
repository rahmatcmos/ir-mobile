import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  BackHandler,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'

import { connect } from 'react-redux'
import _ from 'lodash'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import TextButton from './../TextButton'
import { editButton } from '../../actions'
import { isAndroid } from '../../utils'

import buttonCategories from '../../dictionaries/buttons'
import { BUTTON_RADIUS } from '../../constants/dimensions'
import { BLANK_SPACE } from '../../constants/ui'
import themes from '../../constants/themes'

class EditButtonModal extends Component {

  state = {
    selectedIcon: null,
    newTitle: '',
  }

  static propTypes = {
    button: PropTypes.object.isRequired,
    onSubmit: PropTypes.func.isRequired,
    theme: PropTypes.string.isRequired,
    editButton: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)
    const { icon, title } = props.button
    if (isAndroid) BackHandler.addEventListener('hardwareBackPress', this.captureAndroidBackPress)
    this.state = { selectedIcon: icon,  newTitle: title}
  }

  captureAndroidBackPress = () => {
    this.props.onSubmit()
    BackHandler.removeEventListener('hardwareBackPress', this.captureAndroidBackPress)
    return true
  }

  renderIconButton = (iconName, index) => {
    const { ICON_SELECTED_BACKGROUND_COLOR, MODAL_BACKGROUND_COLOR, MODAL_TEXT_COLOR } = themes[this.props.theme]
    const selected = this.state.selectedIcon === iconName
    return (
      <TouchableOpacity
        key={index}
        onPress={() => this.setState({ selectedIcon: iconName })}
        style={[styles.icon, selected && { backgroundColor: ICON_SELECTED_BACKGROUND_COLOR}]}
      >
        <Icon
          name={iconName}
          size={30}
          color={selected ? MODAL_BACKGROUND_COLOR : MODAL_TEXT_COLOR}
        />
      </TouchableOpacity>
    )
  }

  renderIconCategory = ({ title, icons }, key) => {
    const { MODAL_TEXT_COLOR } = themes[this.props.theme]
    return (
      <View key={key}>
        <Text style={[styles.categoryTitle, { color: MODAL_TEXT_COLOR, borderBottomColor: MODAL_TEXT_COLOR }]}>{title}</Text>
        <View style={styles.iconContainer}>
          { icons.map(this.renderIconButton) }
        </View>
      </View>
    )
  }

  onOkPress = () => {
    const updatedButton = {
      ...this.props.button,
      icon: this.state.selectedIcon,
      title: this.state.newTitle,
    }
    this.props.editButton(updatedButton)
    this.props.onSubmit()
  }

  renderBlankSpaceOption = () => {
    const { ICON_SELECTED_BACKGROUND_COLOR, MODAL_BACKGROUND_COLOR, MODAL_TEXT_COLOR } = themes[this.props.theme]
    const selected = this.state.selectedIcon === BLANK_SPACE
    return (
      <TouchableOpacity
        onPress={() => this.setState({ selectedIcon: BLANK_SPACE })}
        style={[ selected && { backgroundColor: ICON_SELECTED_BACKGROUND_COLOR}, styles.blankSpaceButton]}
      >
        <Text style={{ fontWeight: 'bold', color: selected ? MODAL_BACKGROUND_COLOR : MODAL_TEXT_COLOR }}>Blank Space</Text>
      </TouchableOpacity>
    )
  }

  render() {
    const { onSubmit } = this.props
    const { PRIMARY_DARK, MODAL_BACKGROUND_COLOR } = themes[this.props.theme]
    return (
      <View style={styles.wrapper}>
        <View style={[styles.container, { backgroundColor: MODAL_BACKGROUND_COLOR }]}>

          <ScrollView style={styles.scrollView}>
            <TextInput
              style={styles.textInput}
              onChangeText={text => this.setState({ newTitle: text })}
              value={this.state.newTitle}
              autoCorrect={false}
              underlineColorAndroid={PRIMARY_DARK}
              placeholder="button label"
            />
            { _.map(buttonCategories, this.renderIconCategory) }
            {this.renderBlankSpaceOption()}

          </ScrollView>

          <View style={styles.confirmButtonContainer}>
            <TextButton
              text="Cancel"
              buttonStyle={styles.confirmButton}
              onPress={onSubmit}
            />
            <TextButton
              text="Ok"
              buttonStyle={styles.confirmButton}
              onPress={this.onOkPress}
            />
          </View>
        </View>
      </View>
    )
  }
}

EditButtonModal.defaultProps = {
  onSubmit: () => {},
}

const mapStateToProps = (state, ownProps) => ({
  theme: state.settings.theme,
  button: state.buttons[ownProps.buttonId],
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  editButton: updatedButton => dispatch(editButton(ownProps.buttonId, updatedButton))
})

export default connect(mapStateToProps, mapDispatchToProps)(EditButtonModal)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    borderRadius: BUTTON_RADIUS,
  },
  wrapper: {
    ...StyleSheet.absoluteFillObject,
    padding: 10,
  },
  categoryTitle: {
    marginTop: 10,
    fontSize: 15,
    borderBottomWidth: 0.5,
  },
  confirmButtonContainer: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    height: 60,
  },
  confirmButton: {
    padding: 20,
  },
  iconContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  icon: {
    width: 40,
    height: 40,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    borderRadius: BUTTON_RADIUS,
  },
  scrollView: {
    flex: 1,
    padding: 10,
  },
  textInput: {
    flex: 1,
    height: 45,
    padding: 5,
    marginBottom: 13,
    borderRadius: BUTTON_RADIUS,
    backgroundColor: 'rgba(0, 0, 0, .1)',
  },
  blankSpaceButton: {
    flex: 1,
    padding: 10,
    borderRadius: BUTTON_RADIUS,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20
  },
})
