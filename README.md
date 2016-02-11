# react-native-form
A simple react-native component to wrap your form fields and get their values without attaching listeners everywhere.

## Installation
```
npm install --save react-native-form
```

## Usage
Just put how many react-native components (fields) you want inside `<Form>` with the prop `name` as your key to retrieve the value, and the prop `type` to define the field type. For example:

```JS
import Form from 'react-native-form'

<Form ref="form">
  <TextInput type="TextInput" name="input" />
  <Switch type="Switch" name="switch" />
  <SliderIOS type="SliderIOS" name="slider" />
  <PickerIOS type="PickerIOS" name="picker" />
  <DatePickerIOS type="DatePickerIOS" name="datePicker" />
</Form>
```

And then you can get all the values by calling `this.refs.form.getValues()`.

*NOTE:* We need the prop `type` because react strips the component displayName when compiling for production.

## Do you want to use custom fields?

Just pass a `customFields` prop. Check out this example using the [react-native-radio-buttons](https://github.com/ArnaudRinquin/react-native-radio-buttons) field:

```JS
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

## License
react-native-form is licensed under the [MIT license](LICENSE).
