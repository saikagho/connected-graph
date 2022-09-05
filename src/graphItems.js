import React, { Component } from 'react'

class GraphItems extends Component {
  createTasks = (item, idx) => {
    return (
      <li key={item.key} onClick={() => this.props.deleteItem(item.key)}>
        {this.props.status[idx]}
      </li>
    )
  }
  render() {
    const fieldEntries = this.props.entries
    const listItems = fieldEntries.map(this.createTasks)

    return <ul className="theList">{listItems}</ul>
  }
}

export default GraphItems
