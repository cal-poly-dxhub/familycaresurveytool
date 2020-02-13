import React, { Component } from 'react';
import { Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card"
import { API } from "aws-amplify";

class UserForm extends Component {
   constructor(props) {
      super(props);

      this.state = {
         submitted: false,
         formControls: {
            firstName: {
               value: ''
            },
            lastName: {
               value: ''
            },
            email: {
               value: ''
            },
            primaryNumber: {
               value: ''
            },
            secondaryNumber: {
               value: ''
            },
            firstDate: {
               value: ''
            },
            firstTime: {
               value: ''
            },
            secondDate: {
               value: ''
            },
            secondTime: {
               value: ''
            },
            thirdDate: {
               value: ''
            },
            thirdTime: {
               value: ''
            },
         },
         bestContactMorning: false,
         bestContactAfternoon: false,
         bestContactEvening: false,
         termsAgree: false
      };

      this.handleChange = this.handleChange.bind(this);
      this.submitResponse = this.submitResponse.bind(this);
      this.validateForm = this.validateForm.bind(this);
   }

   handleChange = event => {
      const name = event.target.name;
      const value = event.target.value;

      this.setState({
         formControls: {
            ...this.state.formControls,
            [name]: {
               ...this.state.formControls[name],
               value
            }
         }
      });
   };

   async submitResponse() {
      console.log('sending user data . . .');
      console.log(this.state);
      let userInfo = {
         "body" : {
            ...this.state.formControls,
            bestContactEvening: this.state.bestContactEvening,
            bestContactAfternoon: this.state.bestContactAfternoon,
            bestContactMorning: this.state.bestContactMorning,
            termsAgree: this.state.termsAgree,
            lastId: this.props.lastUserId
         }
      };
      console.log("this is userInfo object: ");
      console.log(userInfo);
      const data = await API.post('fncapi', '/surveyresult', userInfo);
      console.log(data);
      this.setState({
         submitted: true
      })
   };

   validateForm = () => {
      let control = this.state.formControls;

      if (control.firstName.value && control.lastName.value && control.email.value && control.primaryNumber.value
       && control.firstDate.value && control.firstTime.value && control.secondDate.value && control.secondTime.value
       && this.state.termsAgree
       && (this.state.bestContactMorning || this.state.bestContactEvening || this.state.bestContactAfternoon))
         return true;

      return false;
   };

   render() {
      return (
         <div>

            {
               !this.state.submitted ?

                  <Card style={{padding: '2rem'}}>
                     <h2>Please fill out the form below with your information!</h2>
                  <Form>
                     <Form.Row>
                        <Form.Group as={Col} controlId="formFirstName">
                           <Form.Label>First Name *</Form.Label>
                           <Form.Control
                              placeholder="First Name"
                              name="firstName"
                              value={this.state.formControls.firstName.value}
                              onChange={this.handleChange}
                           />
                        </Form.Group>

                        <Form.Group as={Col} controlId="formLastName">
                           <Form.Label>Last Name *</Form.Label>
                           <Form.Control
                              placeholder="Last Name"
                              name="lastName"
                              value={this.state.formControls.lastName.value}
                              onChange={this.handleChange}
                           />
                        </Form.Group>
                     </Form.Row>

                     <Form.Group controlId="formEmail">
                        <Form.Label>Email *</Form.Label>
                        <Form.Control
                           type="email"
                           placeholder="Email"
                           name="email"
                           value={this.state.formControls.email.value}
                           onChange={this.handleChange}
                        />
                     </Form.Group>

                     <Form.Row>
                        <Form.Group as={Col} controlId="formPrimaryNumber">
                           <Form.Label>Primary Phone Number *</Form.Label>
                           <Form.Control
                              placeholder="Primary Phone Number"
                              name="primaryNumber"
                              value={this.state.formControls.primaryNumber.value}
                              onChange={this.handleChange}
                           />
                        </Form.Group>

                        <Form.Group as={Col} controlId="formSecondaryNumnber">
                           <Form.Label>Secondary Phone Number</Form.Label>
                           <Form.Control
                              placeholder="Secondary Phone Number"
                              name="secondaryNumber"
                              value={this.state.formControls.secondaryNumber.value}
                              onChange={this.handleChange}
                           />
                        </Form.Group>
                     </Form.Row>
                     <Form.Row>
                        <Form.Group id="formGridCheckbox">
                           <h4>Best Time to Contact *</h4>
                           <Form.Group as={Col} md="4" controlId="Morning">
                              <Form.Check
                                 type="checkbox"
                                 label="Morning"
                                 onChange={() =>
                                    this.setState(
                                       {
                                          bestContactMorning: !this.state.bestContactMorning
                                       }
                                  )}
                              />
                           </Form.Group>
                           <Form.Group as={Col} md="4" controlId="Afternoon">
                              <Form.Check
                                 type="checkbox"
                                 label="Afternoon"
                                 onChange={() =>
                                    this.setState(
                                    {
                                          bestContactAfternoon : !this.state.bestContactAfternoon
                                       }
                                 )}
                              />
                           </Form.Group>
                           <Form.Group as={Col} md="4" controlId="Evening">
                              <Form.Check
                                 type="checkbox"
                                 label="Evening"
                                 onChange={() =>
                                    this.setState({
                                       bestContactEvening: !this.state.bestContactEvening
                                 })}
                              />

                           </Form.Group>
                        </Form.Group>
                     </Form.Row>

                     <Form.Row>
                        <Form.Group as={Col} controlId="formFirstDateTime">
                           <Form.Label>1. *</Form.Label>
                           <Form.Control
                              placeholder="Date"
                              name="firstDate"
                              value={this.state.formControls.firstDate.value}
                              onChange={this.handleChange}
                           />
                           <Form.Control
                              placeholder="Time"
                              name="firstTime"
                              value={this.state.formControls.firstTime.value}
                              onChange={this.handleChange}
                           />
                        </Form.Group>

                        <Form.Group as={Col} controlId="formSecondDateTime">
                           <Form.Label>2. *</Form.Label>
                           <Form.Control
                              placeholder="Date"
                              name="secondDate"
                              value={this.state.formControls.secondDate.value}
                              onChange={this.handleChange}
                           />
                           <Form.Control
                              placeholder="Time"
                              name="secondTime"
                              value={this.state.formControls.secondTime.value}
                              onChange={this.handleChange}
                           />
                        </Form.Group>
                        <Form.Group as={Col} controlId="formThirdDateTime">
                           <Form.Label>3.</Form.Label>
                           <Form.Control
                              placeholder="Date"
                              name="thirdDate"
                              value={this.state.formControls.thirdDate.value}
                              onChange={this.handleChange}
                           />
                           <Form.Control
                              placeholder="Time"
                              name="thirdTime"
                              value={this.state.formControls.thirdTime.value}
                              onChange={this.handleChange}
                           />
                        </Form.Group>
                     </Form.Row>

                     <Form.Row>
                        <Form.Group>
                           <Form.Check
                              type="checkbox"
                              label="Please check to grant permission to send survey information to FCNI"
                              onChange={() =>
                                 this.setState({
                                    termsAgree: !this.state.termsAgree
                                 })}
                           />
                        </Form.Group>
                     </Form.Row>

                     <Button
                        variant="primary"
                        disabled={this.validateForm() === false}
                        onClick={this.submitResponse}
                     >
                        Submit
                     </Button>
                  </Form>
                  </Card>
                  :
                  <h2>Your form is submitted! We'll get back to you soon!</h2>
            }
         </div>
      );
   }
}

export default UserForm;