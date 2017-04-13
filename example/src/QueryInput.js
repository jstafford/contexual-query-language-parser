import {PropTypes} from 'prop-types'
import React, {Component} from 'react'

class QueryInput extends Component {
  static propTypes = {
    queryString: PropTypes.string.isRequired,
    onUpdateQuery: PropTypes.func.isRequired
  }

  render () {
    const {queryString, onUpdateQuery} = this.props
    const styles = {
      width: '80%'
    }

    return (
      <div>
        <p>Query:</p>
        <input type='text' value={queryString} style={styles}
          onChange={e => onUpdateQuery(e.target.value)}
          onBlur={e => onUpdateQuery(e.target.value)} />
      </div>
    )
  }
}

export default QueryInput
