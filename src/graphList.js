import React, { Component } from 'react'

class GraphList extends Component {
  componentDidUpdate() {
    this.props.inputElement.current.focus()
  }
  render() {
    return (
      <div className="graphListMain">
        <div className="header">
          <form onSubmit={this.props.addItem}>
            <input
              placeholder="Enter Nodes & Edges"
              ref={this.props.inputElement}
              value={this.props.currentItem.text}
              onChange={this.props.handleInput}
            />
            <button type="submit"> Submit </button>
          </form>
        </div>
      </div>
    )
  }
}

export default GraphList
