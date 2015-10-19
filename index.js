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
      'TextInput': {
        defaultValueProp: 'defaultValue',
        callbackProp: 'onChangeText'
      },
      'SwitchIOS': {
        defaultValueProp: 'value',
        callbackProp: 'onValueChange'
      },
      'SwitchAndroid': {
        defaultValueProp: 'value',
        callbackProp: 'onValueChange'
      },
      'SliderIOS': {
        defaultValueProp: 'value',
        callbackProp: 'onSlidingComplete'
      },
      'PickerIOS': {
        defaultValueProp: 'selectedValue',
        callbackProp: 'onValueChange'
      },
      'DatePickerIOS': {
        defaultValueProp: 'date',
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
      var fieldType = element.type.displayName;
      var fieldName = element.props.name;
      var allowedField = this.getAllowedFormFieldTypes()[fieldType];

      var isValidField = (allowedField && fieldName);
      var props = {};

      if (isValidField) {
        props[allowedField.callbackProp] = function(value) {
          this.persistFieldValue(fieldName, value)
          var proxyCallback = element.props[allowedField.callbackProp]

          if (typeof proxyCallback === 'function') {
            proxyCallback(value)
          }
        }
      }

      if (isValidField && !this.values[fieldName]) {
        this.persistFieldValue(
          fieldName,
          element.props[allowedField.defaultValueProp] || element.props.value
        );
      }

      props.children = this.createFormFields(element.props.children);
      return React.cloneElement(element, props);
    })
  },

  /**
   * @param  {Object} nextProps
   * @return {Boolean}
   */
  shouldComponentUpdate: function(nextProps) {
    return nextProps.children !== this.props.children;
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
