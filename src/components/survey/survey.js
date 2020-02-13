import React, { Component } from 'react';
import { Container, Button } from "react-bootstrap";
import surveyQuestion from "../../survey"
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Spinner from "react-bootstrap/Spinner";
import UserForm from "./userForm"
import { API } from "aws-amplify";


const ListSurvey = ({questions}) => {
   return (
         <Row>
            <div>
               <h3>{questions}</h3>
            </div>
         </Row>
   )
};

const ListResult = ({result}, key) => {
   const val = result[1] >= 45 ? "Great Match!" : result[1] >= 30 ? "Getting There!" : "Not a Great Fit :("
   return (
      <Row>
         <div key={key}>
            <h3>{result[0]}</h3>
            <h4><em>{val}</em></h4>
         </div>
      </Row>
   )
};

const questionLength = Object.keys(surveyQuestion).length;



class SurveyForm extends Component {
   constructor(props) {
      super(props);

      this.state = {
         questionNumber : 1,
         firstQuestion: true,
         lastQuestion: false,
         selected: null,
         answerSelected: null,
         survey: null,
         userSelection: [],
         result : null,
         initialized: false,
         startForm: false,
         submitted:false,
         lastSubmittedId: -1
      };

      this.incrementQuestion = this.incrementQuestion.bind(this);
      this.postSurvey = this.postSurvey.bind(this);
      this.startSurvey = this.startSurvey.bind(this);
      this.toFormPage = this.toFormPage.bind(this);
      this.submitUserInfo = this.submitUserInfo.bind(this);
      this.decrementQuestion = this.decrementQuestion.bind(this);
   }

   async componentDidMount() {
      const data = await API.get('fncapi', '/survey');
      console.log("this is data: ");
      console.log(data);
      this.setState({
         survey: data
      });

   };

   toFormPage() {
      this.setState({ startForm: true });
   }
   startSurvey() {
      this.setState({ initialized : true });
   };

   submitUserInfo() {
      this.setState({ submitted : true });
   }

   incrementQuestion() {
         var newNumber = this.state.questionNumber + 1;
         this.state.userSelection.push({
            question: this.state.questionNumber,
            answer: this.state.answerSelected
         });
         console.log(this.state.userSelection);
         this.setState({
            questionNumber: newNumber,
            selected : null,
            answerSelected : null,
            firstQuestion : newNumber === 1,
            lastQuestion: newNumber === questionLength,
            userSelection: this.state.userSelection
         });
   }

   decrementQuestion() {
      const qNo = this.state.questionNumber;
      let newNumber = qNo > 1 ? qNo - 1 : qNo;

      this.state.userSelection.pop();
      let uSel = this.state.userSelection;
      this.setState({
         questionNumber: newNumber,
            selected: null,
            answerSelected: null,
            firstQuestion: newNumber === 1,
            lastQuestion: newNumber === questionLength,
            userSelection: uSel
      });

   }

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

   render() {
      return (
         <div style={{marginTop: '5rem'}}>
            <Container>
               {!this.state.initialized ?
                  <div>
                     <h2>Welcome to Family care!</h2>
                     <Button
                        variant="primary"
                        onClick={this.startSurvey}
                        style={{marginTop: '0.75rem'}}
                     >
                        Get Started
                     </Button>
                  </div>
                  :
                  this.state.survey ?
                     questionLength >= this.state.questionNumber ?
                        <Form>
                           <div>
                              <ListSurvey
                                 keys={`${this.state.questionNumber}`}
                                 questions={this.state.survey[this.state.questionNumber]['question']}
                              />
                              <Row>
                                 <div>
                                    {this.state.survey[this.state.questionNumber]['answer'].map((answer, key) =>
                                       typeof(answer) === 'string' ?
                                          <Form.Check
                                             key={key}
                                             checked={this.state.selected === `${answer}`}
                                             type={'checkbox'}
                                             id={`answer-${key}`}
                                             label={`${answer}`}
                                             onChange={() =>
                                                this.setState({
                                                   selected: answer,
                                                   answerSelected: answer
                                                })
                                             }
                                          />
                                          :
                                          <div key={key}>
                                             <div style={{paddingLeft: '1.25rem'}}>{answer['parent']}</div>
                                             {answer['children'].map((child, secKey) =>
                                                <Form.Check
                                                   style={{paddingLeft:'2.76rem'}}
                                                   key={secKey + key}
                                                   checked={this.state.selected === `${child}`}
                                                   type={'checkbox'}
                                                   id={`answer-${child}`}
                                                   label={`${child}`}
                                                   onChange={() =>
                                                      this.setState({
                                                         selected: child,
                                                         answerSelected: child
                                                      })
                                                   }
                                                />
                                             )}
                                          </div>
                                    )}
                                 </div>
                              </Row>
                           </div>

                           {!this.state.firstQuestion ?
                              <Button
                                 variant="secondary"
                                 onClick={this.decrementQuestion}
                                 style={{marginTop: '0.75rem', marginRight: '0.5rem'}}
                              >
                                 Back
                              </Button>
                              :
                              <div></div>
                           }

                           {this.state.lastQuestion ?
                              <Button
                                 variant="primary"
                                 disabled={this.state.selected === null}
                                 onClick={this.postSurvey}
                                 style={{marginTop: '0.75rem'}}
                              >
                                 Submit
                              </Button>
                              :
                              <Button
                                 disabled={this.state.selected === null}
                                 variant="primary"
                                 onClick={this.incrementQuestion}
                                 style={{marginTop: '0.75rem'}}
                              >
                                 Next
                              </Button>
                           }
                        </Form>
                        :
                        <div>
                           {
                              this.state.result ?
                                 !this.state.startForm ?
                                    <div>
                                       {this.state.result.map((res, key) =>
                                          <ListResult result={res} key={key}/>
                                       )}
                                       <Button
                                          variant="primary"
                                          onClick={this.toFormPage}
                                          style={{marginTop: '0.75rem'}}
                                       >
                                          Next Step!
                                       </Button>
                                    </div>
                                    :
                                    <UserForm lastUserId={this.state.lastSubmittedId}/>
                                 :
                                 <Spinner animation="border" role="status">
                                    <span className="sr-only">Loading...</span>
                                 </Spinner>
                           }

                        </div>
                     :
                     <Spinner animation="border" role="status">
                        <span className="sr-only">Loading...</span>
                     </Spinner>
               }
            </Container>
         </div>

      )
   }

}



export default SurveyForm;
