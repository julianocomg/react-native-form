/**
 * @author Juliano Castilho <julianocomg@gmail.com>
 */
import React, { Component, View } from 'react-native'

class Form extends Component {
  constructor(props) {
    super(props)
    this.values = {}
  }

  /**
   * @private
   * @param {String} fieldName
   * @param {String} value
   */
  _persistFieldValue(
    fieldName,
    value
  ) {
    this.values[fieldName] = value
  }

  /**
   * @returns {Object}
   */
  getValues() {
    return this.values
  }

  /**
   * @returns {Object}
   */
  _getAllowedFormFieldTypes() {
    return {
      ...this.props.customFields,
      'TextInput': {
        defaultValue: '',
        valueProp: 'defaultValue',
        callbackProp: 'onChangeText'
      },
      'Switch': {
        controlled: true,
        valueProp: 'value',
        callbackProp: 'onValueChange'
      },
      'SliderIOS': {
        valueProp: 'value',
        callbackProp: 'onSlidingComplete'
      },
      'PickerIOS': {
        controlled: true,
        valueProp: 'selectedValue',
        callbackProp: 'onValueChange'
      },
      'DatePickerIOS': {
        controlled: true,
        valueProp: 'date',
        callbackProp: 'onDateChange'
      }
    }
  }

  _createFormFields(elements) {
    const allowedFieldTypes = this._getAllowedFormFieldTypes()

    return React.Children.map(elements, element => {
      if (typeof element !== 'object') {
        return element
      }

      const fieldType = element.type.displayName || element.type.name
      const fieldName = element.props.name
      const allowedField = allowedFieldTypes[fieldType]
      const isValidField = (allowedField && fieldName)

      if (! isValidField) {
        return React.cloneElement(element, {
          children: this._createFormFields(element.props.children)
        })
      }

      const props = {}

      props[allowedField.callbackProp] = value => {
        this._persistFieldValue(
          fieldName,
          value
        )

        if (allowedField.controlled) {
          this.forceUpdate()
        }

        const proxyCallback = element.props[allowedField.callbackProp]

        if (typeof proxyCallback === 'function') {
          proxyCallback(value)
        }
      }

      if (! this.values[fieldName]) {
        this._persistFieldValue(
          fieldName,
          (element.props[allowedField.valueProp] || element.props.value) || allowedField.defaultValue
        )
      }

      if (allowedField.controlled) {
        props[allowedField.valueProp] = this.values[fieldName]
      }

      return React.cloneElement(element, {
        ...props,
        children: this._createFormFields(element.props.children)
      })
    })
  }

  /**
   * @returns {ReactElement}
   */
  render() {
    return (
      <View {...this.props}>
        {this._createFormFields(this.props.children)}
      </View>
    )
  }
}

Form.defaultProps = {
  customFields: {}
}

export default Form
