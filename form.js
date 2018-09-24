/**
 * @author Juliano Castilho <julianocomg@gmail.com>
 */
import React from 'react'
import {View} from 'react-native'
import serialize from './serialize'

class Form extends React.Component {
  /**
   * @param {Object} props
   */
  constructor(props) {
    super(props)

    this.fields = {}
    this.formFields = {};
  }

  /**
   * @private
   * @param {String} id
   * @param {String} name
   * @param {String} value
   */
  _persistFieldValue(id, name, value) {
    this.fields[id] = {name, value}
  }

  /**
   * @returns {Object}
   */
  getValues() {
    let fieldsArray = []

    Object.keys(this.fields).map((id, index) => {
      fieldsArray[index] = this.fields[id]
    })

    return serialize(fieldsArray)
  }

  /**
  * @private
  * @param {String} id
  * @param {String} name
  * @param {String} ref
  */
  _persistFieldRef(id, name, value) {
      this.formFields[id] = {name, value}
  }

  /**
  * @returns {Object}
  */
  getRefs() {
      let fieldsArray = []

      Object.keys(this.formFields).map((id, index) => {
          var tempRef = Object.assign({}, this.formFields[id])
          var _refs = this.refs
          // value 其实就是 ref 参数的名字 // value actually is 'ref'
          tempRef.name = tempRef.value // 这里其实只用value // here just same as the value
          tempRef.value = _refs[tempRef.value] // 这里获得对应的ref // here get the ref
          fieldsArray[index] = tempRef
      })

      return serialize(fieldsArray)
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
      'Slider': {
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

  /**
   * @return [ReactComponent]
   */
  _createFormFields(elements) {
    const allowedFieldTypes = this._getAllowedFormFieldTypes()

    return React.Children.map(elements, (element, fieldIndex) => {
      if (typeof element !== 'object' || element === null) {
        return element
      }

      const fieldType = element.props.type
      const fieldName = element.props.name
      const allowedField = allowedFieldTypes[fieldType]
      const isValidField = !!(allowedField && fieldName)
      const fieldId = fieldName + element.key

      let props = {}

      if (fieldName) {
        // set refs
        if (!this.formFields[fieldId]) {
            this._persistFieldRef(
              fieldId,
              fieldName,
              (element.ref || element.props.name) || fieldName
            )
        }

        props.ref = this.formFields[fieldId].value;
      };

      // binding values changed
      if (! isValidField) {
        if (fieldType == 'Accordion') {
          return React.cloneElement(element, {
            ...props,
            children: this._createFormFields(element.props.content)
          })
        } else {
          return React.cloneElement(element, {
            ...props,
            children: this._createFormFields(element.props.children)
          })
        }
      }

      props[allowedField.callbackProp] = value => {
        this._persistFieldValue(
          fieldId,
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

      if (!this.fields[fieldId]) {
        this._persistFieldValue(
          fieldId,
          fieldName,
          (element.props[allowedField.valueProp] || element.props.value) || allowedField.defaultValue
        )
      }

      if (allowedField.controlled) {
        props[allowedField.valueProp] = this.fields[fieldId].value
      }

      return React.cloneElement(element, {
        ...props,
        children: this._createFormFields(element.props.children)
      })
    })
  }

  /**
   * @returns {ReactComponent}
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
