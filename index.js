/**
 * @author Juliano Castilho <julianocomg@gmail.com>
 */
var React = require('react-native');
var {View} = React;

var Form = React.createClass({
  /**
   * @constructor
   */
  componentWillMount: function() {
    this.values = {};
  },

  /**
   * @return {Object}
   */
  getDefaultProps: function() {
    return {
      customFields: {}
    }
  },

  /**
   * @param {String} fieldName
   * @param {String} value
   */
  persistFieldValue: function(fieldName, value) {
    this.values[fieldName] = value;
  },

  /**
   * @return {Object}
   */
  getValues: function() {
    return this.values;
  },

  /**
   * @return {Object}
   */
  getAllowedFormFieldTypes: function() {
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
    };
  },

  /**
   * @param  {Array} elements
   * @return {Array}
   */
  createFormFields: function(elements) {
    return React.Children.map(elements, function(element) {
      if (typeof element !== 'object') {
        return element
      }

      var fieldType = element.type.displayName;
      var fieldName = element.props.name;
      var allowedField = this.getAllowedFormFieldTypes()[fieldType];

      var isValidField = (allowedField && fieldName);
      var props = {};

      if (!isValidField) {
        props.children = this.createFormFields(element.props.children);
        return React.cloneElement(element, props);
      }
      
      props[allowedField.callbackProp] = function(value) {
        this.persistFieldValue(fieldName, value)
        if (allowedField.controlled) {
          this.forceUpdate()
        }

        var proxyCallback = element.props[allowedField.callbackProp]

        if (typeof proxyCallback === 'function') {
          proxyCallback(value)
        }
      }.bind(this)
      

      if (!this.values[fieldName]) {
        this.persistFieldValue(
          fieldName,
          (element.props[allowedField.valueProp] || element.props.value) || allowedField.defaultValue
        );
      }

      if (allowedField.controlled) {
        props[allowedField.valueProp] = this.values[fieldName]
      }

      props.children = this.createFormFields(element.props.children);
      return React.cloneElement(element, props);
    }.bind(this))
  },

  render: function() {
    return React.createElement(
      View,
      this.props,
      this.createFormFields(this.props.children)
    );
  }
})

module.exports = Form;
