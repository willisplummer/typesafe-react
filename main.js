// @flow

import React from 'react';
import ReactDOM from 'react-dom';

var str: number = 123

function HelloWorld(str) {
  return (
      React.createElement('p' , {className: 'body-para'}, stringMaker('str'))
    )
  }

function stringMaker(string: string) {
  return "hello " + string
}

ReactDOM.render(React.createElement(HelloWorld), document.getElementById('app'));
