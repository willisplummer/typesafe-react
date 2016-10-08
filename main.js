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
    return <HelloWorld str='string' state={this.state} handleChange={this.receiveUpdateWithClosure}/>
  }
};

const HelloWorld = ({state, handleChange}: { state: State, handleChange: Function }) => (
  <div>
    <ContactFlow state={state} handleChange={handleChange} />
  </div>
);

const ContactFlow = ({state, handleChange}: { state: State, handleChange: Function}) => (
  <div>
    <div>
      <Buttons state={state} handleChange={handleChange}/>
    </div>
    <div>
      { state.requestType=='' ? null : <Questions state={state} handleChange={handleChange}/> }
    </div>
    <div>
      { state.requestQuestion=='' ? null : <Answer state={state} handleChange={handleChange}/> }
    </div>
    <div>
      { state.openTicketField==false ? null : <TicketField state={state} handleChange={handleChange}/> }
    </div>
  </div>
);

const Buttons = ({state, handleChange}: { state: State, handleChange: Function}) => (
  <div>
    <h2>My Request Is About:</h2>
    <Button state={state} handleChange={handleChange} eventName='requestTypeButtonClick' eventMessage='pledge' displayCopy='A Pledge'/>
    <span>|</span>
    <Button state={state} handleChange={handleChange} eventName='requestTypeButtonClick' eventMessage='project' displayCopy='A Project'/>
  </div>
);

const Button = ({state, handleChange, eventName, eventMessage, displayCopy}: { state: State, handleChange: Function, eventName: UpdateMessage, eventMessage: RequestType, displayCopy: string}) => (
  <input type="button" value={displayCopy} onClick={handleChange(eventName, eventMessage)}/>
);

const Question = ({state, handleChange, eventName, eventMessage, displayCopy}: { state: State, handleChange: Function, eventName: UpdateMessage, eventMessage: RequestType, displayCopy: string}) => (
  <input type="button" value={displayCopy} onClick={handleChange(eventName, eventMessage)}/>
);

const Questions = ({state, handleChange}: { state: State, handleChange: Function}) => {
  if (state.requestType=='project') {
    return (
      <div>
        <Question state={state} handleChange={handleChange} eventName='questionClick' eventMessage='projectQuestion1' displayCopy='What is my project?'/>
        <span>|</span>
        <Question state={state} handleChange={handleChange} eventName='questionClick' eventMessage='projectQuestion2' displayCopy='When will it end?'/>
      </div>
    );
  } else {
    return (
      <div>
        <Question state={state} handleChange={handleChange} eventName='questionClick' eventMessage='pledgeQuestion1' displayCopy='What is my pledge?'/>
        <span>|</span>
        <Question state={state} handleChange={handleChange} eventName='questionClick' eventMessage='pledgeQuestion2' displayCopy='When will it arrive?'/>
      </div>
    );
  };
};

const Answer = ({state, handleChange}: { state: State, handleChange: Function}) => (
  <div>
    <p>This is the answer to your question, {state.requestQuestion}</p>
    <NeedHelp state={state} handleChange={handleChange} />
  </div>
)

const NeedHelp = ({state, handleChange}: { state: State, handleChange: Function}) => (
  <input type="button" value='still need help?' onClick={handleChange('openTicketField')}/>
);

const TicketField = ({state, handleChange}: { state: Object, handleChange: Function }) => (
  <div>
    <textarea value={state.ticketQuestion} onChange={handleChange('ticketFieldChange')}/>
    <input type="button" value='submit it!' onClick={handleChange('submitRequest')}/>
  </div>
);

ReactDOM.render(<App />, document.getElementById('app'));
