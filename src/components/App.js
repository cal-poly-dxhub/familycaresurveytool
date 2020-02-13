import React from 'react';
import './App.css';
import SurveyForm from './survey/survey';
import 'bootstrap/dist/css/bootstrap.css';
import API from '@aws-amplify/api'


API.configure({
  API: {
    endpoints: [
      {
        name: "fncapi",
        endpoint: "https://3ixdg8lx98.execute-api.us-west-2.amazonaws.com/beta",
        custom_header: async () => {
          return { Authorization : 'token' }
          // Alternatively, with Cognito User Pools use this:
          // return { Authorization: `Bearer ${(await Auth.currentSession()).getAccessToken().getJwtToken()}` }
        }
      }
    ]
  }
});

function App() {
  return (
    <SurveyForm/>
  );
}

export default App;
