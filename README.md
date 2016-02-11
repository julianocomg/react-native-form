# react-native-form
A simple react-native component to wrap your form fields and get their values without attaching listeners everywhere.

## Installation
```
npm install --save react-native-form
```

## Usage
Just put how many react-native components (fields) you want inside `<Form>` with the prop `name` defined. For example:

```JS
import Form from 'react-native-form'

<Form ref="form">
  <TextInput name="input" />
  <Switch name="switch" />
  <SliderIOS name="slider" />
  <PickerIOS name="picker" />
  <DatePickerIOS name="datePicker" />
</Form>
```

and then you can get all values by calling `this.refs.form.getValues()`.

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
  <RadioButtons name="radioButtons" />
</Form>
```

## License
react-native-form is licensed under the [MIT license](LICENSE).
