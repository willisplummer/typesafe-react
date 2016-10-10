// @flow

import React from 'react';
import ReactDOM from 'react-dom';

// MODEL
type State =  { requestType: RequestType
              , requestQuestion: RequestType
              , openTicketField: bool
              , ticketQuestion: string
              , error: string
              }
type Props = {state: State}

// UPDATE
type UpdateMessage = 'stringFieldChange'
                    | 'requestTypeButtonClick'
                    | 'questionClick'
                    | 'openTicketField'
                    | 'ticketFieldChange'
                    | 'submitRequest'

type RequestType = 'pledge'
                  | 'project'
                  | ''
                  | 'projectQuestion1'
                  | 'projectQuestion2'
                  | 'pledgeQuestion1'
                  | 'pledgeQuestion2'

type StringFieldEvent = {target: {value: string}}

class App extends React.Component {
  state: State;

  constructor(props) {
    super(props);
    this.state =  { requestType: ''
                  , requestQuestion: ''
                  , openTicketField: false
                  , ticketQuestion: ''
                  , error: ''
                  };
    (this:any).update = this.update.bind(this);
    (this:any).receiveUpdateWithClosure = this.receiveUpdateWithClosure.bind(this);
    (this:any).handlerequestTypeButtonClick = this.handlerequestTypeButtonClick.bind(this);
    (this:any).handleQuestionClick = this.handleQuestionClick.bind(this);
    (this:any).openTicketField = this.openTicketField.bind(this);
    (this:any).handleTicketFieldChange = this.handleTicketFieldChange.bind(this);
    (this:any).submitRequest = this.submitRequest.bind(this);
    (this:any).validateTicketField = this.validateTicketField.bind(this);
  }

  update({eventName, eventMessage, value}: {eventName: UpdateMessage, eventMessage: any, value: any}) {
    switch(eventName) {
      case 'requestTypeButtonClick':
        this.setState(this.handlerequestTypeButtonClick(eventMessage));
        break;
      case 'questionClick':
        this.setState(this.handleQuestionClick(eventMessage));
        break;
      case 'openTicketField':
        this.setState(this.openTicketField());
        break;
      case 'ticketFieldChange':
        this.setState(this.handleTicketFieldChange(value));
        break;
      case 'submitRequest':
        this.submitRequest(); // this isn't good because it should return state like every other branch
        break;
    }
  }

  submitRequest() {
    if (this.validateTicketField(this.state.ticketQuestion).error === '') {
      console.log('submitting!');
    } else {
      console.log('didnt submit because of errors')
    };
  };

  handleTicketFieldChange(value: StringFieldEvent): State  {
    return (
      { requestType: this.state.requestType
      , requestQuestion: this.state.requestQuestion
      , openTicketField: this.state.openTicketField
      , ticketQuestion: value.target.value
      , error: ''
      }
    )
  };

  validateTicketField(ticketQuestion: string): State {
      if (ticketQuestion === '') {
        return (
          { requestType: this.state.requestType
          , requestQuestion: this.state.requestQuestion
          , openTicketField: this.state.openTicketField
          , ticketQuestion: this.state.ticketQuestion
          , error: 'ask a question!'
          }
        );
      } else {
        return (this.state);
      };
    };

  handlerequestTypeButtonClick(requestType: RequestType): State {
    return (
      { requestType: requestType
      , requestQuestion: ''
      , openTicketField: false
      , ticketQuestion: ''
      , error: ''
      }
    )
  };

  handleQuestionClick(questionType: RequestType): State {
    return (
      { requestType: this.state.requestType
      , requestQuestion: questionType
      , openTicketField: false
      , ticketQuestion: ''
      , error: ''
      }
    )
  };

  openTicketField() {
    return (
      { requestType: this.state.requestType
      , requestQuestion: this.state.requestQuestion
      , openTicketField: true
      , ticketQuestion: this.state.ticketQuestion
      , error: ''
      }
    )
  };

  receiveUpdateWithClosure(eventName: UpdateMessage, eventMessage: any) {
    const update = this.update
    return function(event: any) {
      update({eventName: eventName, eventMessage: eventMessage, value: event});
    }
  }

  render(): React$Element<any> {
    return <ContactFlow
              str='string'
              state={this.state}
              handleChange={this.receiveUpdateWithClosure}
            />
  };
};

const ContactFlow = ({state, handleChange}: { state: State, handleChange: Function}): React$Element<any> => (
  <div>
    <div>
      <Buttons
        state={state}
        handleChange={handleChange}
      />
    </div>
    <div>
      { state.requestType=='' ? null : <Questions requestType={state.requestType} handleChange={handleChange}/> }
    </div>
    <div>
      { state.requestQuestion=='' ? null : <Answer requestQuestion={state.requestQuestion} handleChange={handleChange}/> }
    </div>
    <div>
      { state.openTicketField==false ? null : <TicketField ticketQuestion={state.ticketQuestion} handleChange={handleChange} error={state.error}/> }
    </div>
  </div>
);

const Buttons = ({handleChange}: { handleChange: Function}): React$Element<any> => (
  <div>
    <h2>My Request Is About:</h2>
    <Button
      handleChange={handleChange}
      eventName='requestTypeButtonClick'
      eventMessage='pledge'
      displayCopy='A Pledge'
    />
    <Button
      handleChange={handleChange}
      eventName='requestTypeButtonClick'
      eventMessage='project'
      displayCopy='A Project'
    />
  </div>
);

const Button = ({handleChange, eventName, eventMessage, displayCopy}: { handleChange: Function, eventName: UpdateMessage, eventMessage: RequestType, displayCopy: string}): React$Element<any> => (
  <input
    type="button"
    value={displayCopy}
    onClick={handleChange(eventName, eventMessage)}
  />
);

const Question = ({handleChange, eventName, eventMessage, displayCopy}: { handleChange: Function, eventName: UpdateMessage, eventMessage: RequestType, displayCopy: string}): React$Element<any> => (
  <input
    type="button"
    value={displayCopy}
    onClick={handleChange(eventName, eventMessage)}
  />
);

const Questions = ({requestType, handleChange}: { requestType: RequestType, handleChange: Function}): React$Element<any> => {
  if (requestType=='project') {
    return (
      <div>
        <Question
          handleChange={handleChange}
          eventName='questionClick'
          eventMessage='projectQuestion1'
          displayCopy='What is my project?'
        />
        <Question
          handleChange={handleChange}
          eventName='questionClick'
          eventMessage='projectQuestion2'
          displayCopy='When will it end?'
        />
      </div>
    );
  } else {
    return (
      <div>
        <Question
          handleChange={handleChange}
          eventName='questionClick'
          eventMessage='pledgeQuestion1'
          displayCopy='What is my pledge?'
        />
        <Question
          handleChange={handleChange}
          eventName='questionClick'
          eventMessage='pledgeQuestion2'
          displayCopy='When will it arrive?'
        />
      </div>
    );
  };
};

const Answer = ({requestQuestion, handleChange}: { requestQuestion: RequestType, handleChange: Function}): React$Element<any> => (
  <div>
    <p>This is the answer to your question, {requestQuestion}</p>
    <NeedHelp handleChange={handleChange} />
  </div>
)

const NeedHelp = ({handleChange}: { handleChange: Function}): React$Element<any> => (
  <input
    type="button"
    value='still need help?'
    onClick={handleChange('openTicketField')}
  />
);

const TicketField = ({ticketQuestion, handleChange, error}: { ticketQuestion: string, handleChange: Function, error: string }): React$Element<any> => {
  const textFieldStyle = error ==='' ? {} : {border: '3px red solid'}
  const errorStyle = {color: 'red'}

  return (
    <div>
      <textarea
        value={ticketQuestion}
        style={textFieldStyle}
        onChange={handleChange('ticketFieldChange')}
      />
      <input
        type="button"
        value='submit it!'
        onClick={handleChange('submitRequest')}
      />
      { error=='' ? null : <p style={errorStyle}>{error}</p> }
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('app'));
