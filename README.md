# react-native-form
A simple react-native component to wrap your form fields and get their values with just one single method \o/

<br/>
### How to install
Install with `npm install react-native-form` and voilà!

<br/>
### How to use?
Just put how many react-native components (fields) you want inside `<Form>`, with the prop `name` defined. And that's it.

```javascript
import Form from 'react-native-form'

<Form ref="example">
  <TextInput name="lala" />
  <SwitchAndroid name="lele" />
  <SwitchIOS name="lili" />
  <SliderIOS name="lolo" />
  <PickerIOS name="lulu" />
  <DatePickerIOS name="lululu" />
</Form>
```
Now you can get the form value by calling `this.refs.example.getValues()`

<br/>
###License
react-native-form is licensed under the [MIT license](LICENSE).
