/**
 * @author Juliano Castilho <julianocomg@gmail.com>
 */
import React, {Component, View} from 'react-native'
import serialize from './serialize'

class Form extends Component {
  /**
   * @param {Object} props
   */
  constructor(props) {
    super(props)

    this.fields = []
  }

  /**
   * @private
   * @param {String} index
   * @param {String} name
   * @param {String} value
   */
  _persistFieldValue(index, name, value) {
    this.fields[index] = {name, value}
  }

  /**
   * @returns {Object}
   */
  getValues() {
    return serialize(this.fields)
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
      'Picker': {
        controlled: true,
        valueProp: 'selectedValue',
        callbackProp: 'onValueChange'
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

    return React.Children.map(elements, (element, fieldIndex) => {
      if (typeof element !== 'object') {
        return element
      }

      const fieldType = element.props.type
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
          fieldIndex,
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

      if (! this.fields[fieldIndex]) {
        this._persistFieldValue(
          fieldIndex,
          fieldName,
          (element.props[allowedField.valueProp] || element.props.value) || allowedField.defaultValue
        )
      }

      if (allowedField.controlled) {
        props[allowedField.valueProp] = this.fields[fieldIndex].value
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

/**
 * @type {Object}
 */
Form.defaultProps = {
  customFields: {}
}

export default Form
