# react-loose-forms.bootstrap3
layouts and inputs that work with [react-loose-forms](https://github.com/espeakers/react-loose-forms) and bootstrap3

## Inputs
Check out the [inputs](https://github.com/espeakers/react-loose-forms.bootstrap3/tree/master/inputs) directory to see what's available.

## Layouts
Check out the [layouts](https://github.com/espeakers/react-loose-forms.bootstrap3/tree/master/layouts) directory to see what's available.

## Installing
```sh
$ npm install --save react-loose-forms.bootstrap3
```
Then put this somewhere at the root of your project, before you mount your react app to the page.
```js
require("react-loose-forms.bootstrap3").install(require("react-loose-forms/InputTypes"));
```
What that does is call `InputTypes.setInputType` for all the input types in this projects `inputs` folder.

## FYI
This project follows [semantic versioning](http://semver.org/) for releases.

## License
MIT
