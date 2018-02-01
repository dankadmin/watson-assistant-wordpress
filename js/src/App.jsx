import React, { Component } from 'react';
import Draggable from 'react-draggable';
import { TransitionGroup } from 'react-transition-group';

import ChatBox from './ChatBox.jsx';
import Fab from './Fab.jsx';

export default class App extends Component {
  constructor(props) {
    super(props);

    if (typeof(sessionStorage) !== 'undefined' &&
        sessionStorage.getItem('watson_bot_window_state'))
    {
      this.state = JSON.parse(sessionStorage.getItem('watson_bot_window_state'));
    } else {
      this.state = {
        minimized: props.isMobile ? true : props.minimized,
        position: {x: 0, y: 0}
      };
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state != prevState && typeof(sessionStorage) !== 'undefined') {
      sessionStorage.setItem('watson_bot_window_state', JSON.stringify(this.state));

      if (this.state.minimized != prevState.minimized && this.props.isMobile) {
        document.body.style.overflow = this.state.minimized ? 'scroll' : 'hidden';
      }
    }
  }

  toggleMinimize(e) {
    e.preventDefault();
    this.setState({minimized: !this.state.minimized});
  }

  startDragging(e) {
    e.preventDefault();

    this.setState({
      animated: true
    })
  }

  savePosition(e, data) {
    if (Math.sqrt(Math.pow(data.x - this.state.position.x, 2) +  Math.pow(data.y - this.state.position.y, 2)) < 3) {
      this.setState({animated: false});
      this.toggleMinimize(e);
    } else {
      this.setState(
        {position: {x: data.x, y: data.y}}
      );
    }
  }

  render() {
    let { isMobile, fullScreen, title, callConfig, fabConfig } = this.props;
    let { minimized, animated } = this.state;

    return (
      <div>
        <Draggable
          handle='#watson-header'
          cancel='#watson-header .header-button'
          bounds={(fullScreen || isMobile) && {left: 0, top: 0, right: 0, bottom: 0}}
          onStart={this.startDragging.bind(this)}
          onStop={this.savePosition.bind(this)}
          position={(minimized || fullScreen || isMobile) ? {x: 0, y: 0} : this.state.position}
        >
          <TransitionGroup
            id='watson-float'
            class={!animated && 'animated'}
            style={minimized && {opacity: 0 , visibility: 'hidden'}}
          >
              <ChatBox
                  minimize={this.toggleMinimize.bind(this)}
                  isMinimized={minimized}
                  position={this.props.position}
                  title={title}
                  callConfig={callConfig}
              />
          </TransitionGroup>
        </Draggable>
        <TransitionGroup
          id='watson-fab-float'
          class='animated'
          style={!minimized && {opacity: 0 , visibility: 'hidden'}}
        >
          {minimized && 
            <Fab 
              openChat={this.toggleMinimize.bind(this)} 
              iconPos={fabConfig.iconPos} 
              text={fabConfig.text} 
            />
          }
        </TransitionGroup>
      </div>
    );
  }
}
