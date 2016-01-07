# react-native-form
A simple react-native component to wrap your form fields and get their values without attaching listeners everywhere.

Advantages:
- You'll avoid to track values by your own;
- `<Form>` tracks all known components for you, doesn't matter how deep they're;
- Exposes a simple API to retrieve the value.
- Compatible with [react-native-radio-buttons](https://github.com/ArnaudRinquin/react-native-radio-buttons)

<br/>
### How to install?
`npm install react-native-form` and voilà!

<br/>
### How to use?
Just put how many react-native components (fields) you want inside `<Form>`, with the prop `name` defined. And that's it.

```javascript
var Form = require('react-native-form')

<Form ref="example">
  <TextInput name="lala" />
  <SwitchAndroid name="lele" />
  <SwitchIOS name="lili" />
  <SliderIOS name="lolo" />
  <PickerIOS name="lulu" />
  <DatePickerIOS name="lululu" />
  <RadioButtons name="lyly" />
</Form>
```
Now you can get the form value by calling `this.refs.example.getValues()`

<br/>
### License
react-native-form is licensed under the [MIT license](LICENSE).
