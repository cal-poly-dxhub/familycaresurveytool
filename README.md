This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

To begin install run `npm create react-app <Project name>`

### `npm start`
to run React.JS Single App Application

Replace the package.json file the provided file, and run `npm install` <br>
This will install all the required libraries including `React-Bootstrap` and `aws-amplify`

Current application's backend is powered by `AWS API Gateway` and `AWS Lambda Function`<br>
`AWS-Amplify` is the library that connects React application with `AWS API Gateway` <br>
Although AWS Amplify console automatically set up CloudFormation if it is using DynamoDB,<br>
this application uses `AWS RDS`, and therefore, it needs to be manually configure and set up the CloudFormation or from the AWS console.

Below is the code to configure API
```javascript
API.configure({
   API: {
      endpoints: [
         {
           name: "fncapi",
           endpoint: "<API URL from AWS API Gateway",
           custom_header: async () => {
             return { Authorization : 'token' }
             // Alternatively, with Cognito User Pools use this:
             // return { Authorization: `Bearer ${(await Auth.currentSession()).getAccessToken().getJwtToken()}` }
           }
         }
      ]
   }
});
```

To POST data
```javascript
async postSurvey() {
   this.incrementQuestion();

   let init = {
      "body": this.state.userSelection
   };
   console.log(init);
   const data = await API.post('fncapi', '/survey', init);
   console.log(data);
   this.setState(
      {
         result : data["result"],
         lastSubmittedId: data["lastId"]

      }
   );
}
```
To GET data
```javascript
async componentDidMount() {
   const data = await API.get('fncapi', '/survey');
   console.log("this is data: ");
   console.log(data);
   this.setState({
      survey: data
   });

};
```

### `npm run build`

Because Drupal framework cannot compile and run JSX syn tax nor ES6 script,
React application must be compiled using `Babel.js` and `Webpack`.

These are the required devDependencies which goes into package.json.
```json
"devDependencies": {
  "@babel/core": "^7.6.2",
  "@babel/preset-env": "^7.6.2",
  "@babel/preset-react": "^7.0.0",
  "babel-core": "^6.26.3",
  "babel-loader": "^8.0.6",
  "babel-polyfill": "^6.26.0",
  "babel-preset-es2015": "^6.24.1",
  "babel-preset-stage-0": "^6.24.1",
  "css-loader": "^3.2.0",
  "html-loader": "^0.5.5",
  "html-webpack-plugin": "^3.2.0",
  "react-app-rewired": "^2.1.3",
  "style-loader": "^1.0.0",
  "webpack": "^4.41.0",
  "webpack-cli": "^3.3.9"
}
```

Then, create `.babelrc` which makes rules for jsx syntax and create `webpack.config.js` to configure webpack.

**since we are using async, we need `bable-polyfill`**

Then, edit package.json's build command with below line
`"build": "webpack --mode production”,`

Now run npm run build, and you will see `build.js` inside the `dist` folder

## Drupal
Simply, add the build.js file in designated JS folder in Drupal and add its path in Libraries.yaml

**To edit something in React, it must be build again. There is way to make this automated, but overly complicates the problem.**
