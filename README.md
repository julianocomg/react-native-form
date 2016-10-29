# react-native-form
A simple react-native component to wrap your form fields and get their values without attaching listeners everywhere.

## Installation
```
npm install --save react-native-form
```

## Usage
Just put your fields inside the form, with 2 props: 

***`name`*** => Your key to retrieve the value (required)

***`type`*** => The field type (required)

***`key`*** => Required for fields with the same name


```javascript
import Form from 'react-native-form'

<Form ref="form">
  <View>
    <View>
      <TextInput type="TextInput" name="myTextInput" /> // Yes, it doesn't matter how deep they are :)
    </View>
  </View>
  
  <Switch type="Switch" name="mySwitch" />
  <Slider type="Slider" name="mySlider" />
  <DatePickerIOS type="DatePickerIOS" name="myBirthday" />
  <Picker type="Picker" name="myPicker" />
  
  <PickerIOS type="PickerIOS" name="pickers[ios]" /> // Yes, we support form serialization, like the web
</Form>
```

And then you can call ***`this.refs.form.getValues()`***. 
You will get an object with all the values serialized. Simple as that.

## Do you want to use custom fields?

Just pass the prop ***`customFields`*** to the form. Check out the example below using the [react-native-radio-buttons](https://github.com/ArnaudRinquin/react-native-radio-buttons) field:

```javascript
var customFields = {
  'RadioButtons': {
    controlled: true,
    valueProp: 'selectedOption',
    callbackProp: 'onSelection',
  }
}

<Form ref="form" customFields={customFields}>
  <RadioButtons type="RadioButtons" name="radioButtons" />
</Form>
```

## Support for Accordion

If you have form fields under an Accordion component, add:

```javascript
type="Accordion"
```

to the Accordion component to have Form include the Accordion children.


## License
react-native-form is licensed under the [MIT license](LICENSE).
