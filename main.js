// @flow

import React from 'react';
import ReactDOM from 'react-dom';

// MODEL
type State = {requestType: RequestType, requestQuestion: RequestType, openTicketField: bool, ticketQuestion: string}
type Props = {state: State}

// UPDATE
type UpdateMessage = 'stringFieldChange' | 'requestTypeButtonClick' | 'questionClick' | 'openTicketField' | 'ticketFieldChange' | 'submitRequest'
type RequestType = 'pledge' | 'project' | '' | 'projectQuestion1' | 'projectQuestion2' | 'pledgeQuestion1' | 'pledgeQuestion2'
type StringFieldEvent = {target: {value: string}}

class App extends React.Component {
  state: State;

  constructor(props) {
    super(props);
    this.state = {requestType: '', requestQuestion: '', openTicketField: false, ticketQuestion: ''};
    (this:any).update = this.update.bind(this);
    (this:any).receiveUpdateWithClosure = this.receiveUpdateWithClosure.bind(this);
    (this:any).handlerequestTypeButtonClick = this.handlerequestTypeButtonClick.bind(this);
    (this:any).handleQuestionClick = this.handleQuestionClick.bind(this);
    (this:any).openTicketField = this.openTicketField.bind(this);
    (this:any).handleTicketFieldChange = this.handleTicketFieldChange.bind(this);
    (this:any).submitRequest = this.submitRequest.bind(this);
  }

  update({eventName, eventMessage, value}: {eventName: UpdateMessage, eventMessage: any, value: any}) {
    switch(eventName) {
      case 'requestTypeButtonClick':
        this.handlerequestTypeButtonClick(eventMessage);
        break;
      case 'questionClick':
        this.handleQuestionClick(eventMessage);
        break;
      case 'openTicketField':
        this.openTicketField();
        break;
      case 'ticketFieldChange':
        this.handleTicketFieldChange(value);
        break;
      case 'submitRequest':
        this.submitRequest();
        break;
    }
  }

  submitRequest() {
    console.log('submitting!');
  }

  handleTicketFieldChange(value: StringFieldEvent) {
    this.setState({requestType: this.state.requestType, requestQuestion: this.state.requestQuestion, openTicketField: this.state.openTicketField, ticketQuestion: value.target.value});
  }

  handlerequestTypeButtonClick(requestType: RequestType) {
    this.setState({requestType: requestType, requestQuestion: '', openTicketField: false, ticketQuestion: ''})
  }

  handleQuestionClick(questionType: RequestType) {
    this.setState({requestType: this.state.requestType, requestQuestion: questionType, openTicketField: false, ticketQuestion: ''})
  }

  openTicketField() {
    this.setState({requestType: this.state.requestType, requestQuestion: this.state.requestQuestion, openTicketField: true, ticketQuestion: this.state.ticketQuestion})
  }

  receiveUpdateWithClosure(eventName: UpdateMessage, eventMessage: any) {
    const update = this.update
    return function(event: any) {
      update({eventName: eventName, eventMessage: eventMessage, value: event});
    }
  }

  render() {
    return <ContactFlow str='string' state={this.state} handleChange={this.receiveUpdateWithClosure}/>
  }
};

const ContactFlow = ({state, handleChange}: { state: State, handleChange: Function}) => (
  <div>
    <div>
      <Buttons state={state} handleChange={handleChange}/>
    </div>
    <div>
      { state.requestType=='' ? null : <Questions requestType={state.requestType} handleChange={handleChange}/> }
    </div>
    <div>
      { state.requestQuestion=='' ? null : <Answer requestQuestion={state.requestQuestion} handleChange={handleChange}/> }
    </div>
    <div>
      { state.openTicketField==false ? null : <TicketField ticketQuestion={state.ticketQuestion} handleChange={handleChange}/> }
    </div>
  </div>
);

const Buttons = ({handleChange}: { handleChange: Function}) => (
  <div>
    <h2>My Request Is About:</h2>
    <Button handleChange={handleChange} eventName='requestTypeButtonClick' eventMessage='pledge' displayCopy='A Pledge'/>
    <span>|</span>
    <Button handleChange={handleChange} eventName='requestTypeButtonClick' eventMessage='project' displayCopy='A Project'/>
  </div>
);

const Button = ({handleChange, eventName, eventMessage, displayCopy}: { handleChange: Function, eventName: UpdateMessage, eventMessage: RequestType, displayCopy: string}) => (
  <input type="button" value={displayCopy} onClick={handleChange(eventName, eventMessage)}/>
);

const Question = ({handleChange, eventName, eventMessage, displayCopy}: { handleChange: Function, eventName: UpdateMessage, eventMessage: RequestType, displayCopy: string}) => (
  <input type="button" value={displayCopy} onClick={handleChange(eventName, eventMessage)}/>
);

const Questions = ({requestType, handleChange}: { requestType: RequestType, handleChange: Function}) => {
  if (requestType=='project') {
    return (
      <div>
        <Question handleChange={handleChange} eventName='questionClick' eventMessage='projectQuestion1' displayCopy='What is my project?'/>
        <span>|</span>
        <Question handleChange={handleChange} eventName='questionClick' eventMessage='projectQuestion2' displayCopy='When will it end?'/>
      </div>
    );
  } else {
    return (
      <div>
        <Question handleChange={handleChange} eventName='questionClick' eventMessage='pledgeQuestion1' displayCopy='What is my pledge?'/>
        <span>|</span>
        <Question handleChange={handleChange} eventName='questionClick' eventMessage='pledgeQuestion2' displayCopy='When will it arrive?'/>
      </div>
    );
  };
};

const Answer = ({requestQuestion, handleChange}: { requestQuestion: RequestType, handleChange: Function}) => (
  <div>
    <p>This is the answer to your question, {requestQuestion}</p>
    <NeedHelp handleChange={handleChange} />
  </div>
)

const NeedHelp = ({handleChange}: { handleChange: Function}) => (
  <input type="button" value='still need help?' onClick={handleChange('openTicketField')}/>
);

const TicketField = ({ticketQuestion, handleChange}: { ticketQuestion: string, handleChange: Function }) => (
  <div>
    <textarea value={ticketQuestion} onChange={handleChange('ticketFieldChange')}/>
    <input type="button" value='submit it!' onClick={handleChange('submitRequest')}/>
  </div>
);

ReactDOM.render(<App />, document.getElementById('app'));
