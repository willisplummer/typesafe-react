// @flow

import React from 'react';
import ReactDOM from 'react-dom';

type UpdateMessage = 'stringFieldChange'
type State = {value: string}
type Props = {state: State}
type StringFieldEvent = {target: {value: string}}

class App extends React.Component {
  state: State;

  constructor(props) {
    super(props);
    this.state = {value: ''};
    (this:any).update = this.update.bind(this);
    (this:any).receiveUpdateWithClosure = this.receiveUpdateWithClosure.bind(this);
    (this:any).handleStringFieldChange = this.handleStringFieldChange.bind(this);
  }

  update({eventName, value}: {eventName: UpdateMessage, value: any}) {
    switch(eventName) {
      case 'stringFieldChange':
        this.handleStringFieldChange(value);
        break;
    }
  }

  handleStringFieldChange(value: StringFieldEvent) {
    this.setState({value: value.target.value});
  }

  receiveUpdateWithClosure(eventName: UpdateMessage) {
    const update = this.update
    return function(event: any) {
      update({eventName: eventName, value: event});
    }
  }

  render() {
    return <HelloWorld str='string' state={this.state} handleChange={this.receiveUpdateWithClosure}/>
  }
};

const HelloWorld = ({state, handleChange}: { state: Object, handleChange: Function }) => (
  <div>
    <div>
      <p>{state.value}</p>
    </div>
    <div>
    <p>{handleChange}</p>
      <StringField state={state} handleChange={handleChange} />
    </div>
  </div>
);

const StringField = ({state, handleChange}: { state: Object, handleChange: Function }) => (
  <input type='text' value={state.value} onChange={handleChange('stringFieldChange')}/>
);

ReactDOM.render(<App />, document.getElementById('app'));
