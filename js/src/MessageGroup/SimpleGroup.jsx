import React, { Component } from 'react';

export default class SimpleGroup extends Component {
  shouldComponentUpdate() {
    return false;
  }

  render({from, text}) {
    return <div>
      <div
        className={`message ${from}-message watson-font`}
        dangerouslySetInnerHTML={{__html: text}}
      ></div>
    </div>;
  }
}
