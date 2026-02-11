# Collaboration

Thanks for your interest in our solution. Having specific examples of replication and usage allows us to continue to grow and scale our work. If you clone or use this repository, kindly shoot us a quick email to let us know you are interested in this work!

<wwps-cic@amazon.com>

# Disclaimers

**Customers are responsible for making their own independent assessment of the information in this document.**

**This document:**


Customers are responsible for making their own independent assessment of the information in this document. 

This document: 

(a) is for informational purposes only, 

(b) references AWS product offerings and practices, which are subject to change without notice, 

(c) does not create any commitments or assurances from AWS and its affiliates, suppliers or licensors. AWS products or services are provided “as is” without warranties, representations, or conditions of any kind, whether express or implied. The responsibilities and liabilities of AWS to its customers are controlled by AWS agreements, and this document is not part of, nor does it modify, any agreement between AWS and its customers, and 

(d) is not to be considered a recommendation or viewpoint of AWS. 

Additionally, you are solely responsible for testing, security and optimizing all code and assets on GitHub repo, and all such code and assets should be considered: 

(a) as-is and without warranties or representations of any kind, 

(b) not suitable for production environments, or on production or other critical data, and 

(c) to include shortcuts in order to support rapid prototyping such as, but not limited to, relaxed authentication and authorization and a lack of strict adherence to security best practices. 

All work produced is open source. More information can be found in the GitHub repo. 
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
