# react-native-form
A simple react-native component to wrap your form fields and get their values without attaching listeners everywhere.

Advantages:
- You'll avoid to track values by your own;
- `<Form>` tracks all known components for you, doesn't matter how deep they're;
- Exposes a simple API to retrieve the value.

<br/>
## How to install?
`npm install react-native-form` and voilà!

<br/>
## How to use?
Just put how many react-native components (fields) you want inside `<Form>`, with the prop `name` defined. And that's it.

```javascript
var Form = require('react-native-form')

<Form ref="form">
  <TextInput name="lala" />
  <Switch name="lele" />
  <SliderIOS name="lili" />
  <PickerIOS name="lolo" />
  <DatePickerIOS name="lulu" />
</Form>
```
Now you can get the form value by calling `this.refs.form.getValues()`

<br/>
## Do you want custom fields?
Just pass a `customFields` prop. Check out this example using the [react-native-radio-buttons](https://github.com/ArnaudRinquin/react-native-radio-buttons) field:

```javascript
var myCustomFields = {
  'RadioButtons': {
    controlled: true,
    valueProp: 'selectedOption',
    callbackProp: 'onSelection',
  }
}

<Form ref="form" customFields={myCustomFields}>
  <RadioButtons name="lyly" />
</Form>
```

<br/>
## License
react-native-form is licensed under the [MIT license](LICENSE).
