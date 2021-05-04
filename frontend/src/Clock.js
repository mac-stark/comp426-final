import React, { Component } from 'react';

class Clock extends Component {
  constructor(props){
    super(props);
    this.state = {currentCount: this.props.seconds, callback:this.props.callback, on:this.props.on}
  }
  timer() {
    this.setState({
      currentCount: this.state.currentCount - 1
    })
    if(this.state.currentCount < 1) { 
        this.state.callback();
        this.setState({currentCount:this.props.seconds});
    }
  }
  componentDidMount() {
    this.intervalId = setInterval(this.timer.bind(this), 1 * 1000);
  }
  componentWillUnmount(){
    clearInterval(this.intervalId);
  }
  render() {
    return(
      <div>{this.state.on ? this.state.currentCount: ''}</div>
    );
  }
}
export default Clock;