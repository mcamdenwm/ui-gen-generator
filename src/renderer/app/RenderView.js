import React, { Component } from 'react';

class RenderView extends Component {
  render() {
  	console.log(this.props);
  	
    return this.props.getComponent(this.props.view.toJSON());
  }
}

export default RenderView;