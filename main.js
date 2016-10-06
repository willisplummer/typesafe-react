// @flow

import React from 'react';
import ReactDOM from 'react-dom';

var initialState = {value: null}


const App = React.createClass ({
  getInitialState: function() {
    return this.props
  },

  update: function({eventName, value}) {
    console.log(eventName, value.target.value);
    switch(eventName) {
      case 'stringFieldChange':
        this.setState({state: {value: value.target.value}});
        break;
    }
  },

  receiveUpdateWithClosure: function(eventName) {
    const update = this.update
    return function(event) {
      update({eventName: eventName, value: event});
    }
  },

  render: function() {
    return <HelloWorld str='string' state={this.state.state} handleChange={this.receiveUpdateWithClosure}/>
  }
});

const HelloWorld = ({str, state, handleChange}) => (
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

const StringField = ({state, handleChange}) => (
  <input type='text' value={state.value} onChange={handleChange('stringFieldChange')}/>
);

ReactDOM.render(<App state={initialState}/>, document.getElementById('app'));
