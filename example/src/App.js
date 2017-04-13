import {PropTypes} from 'prop-types'
import React, {Component} from 'react'
import {connect} from 'react-redux'
import {QUERY_CHANGE} from './actions'
import FQContainer from './FQContainer'
import QueryInput from './QueryInput'
import XCQLContainer from './XCQLContainer'

class App extends Component {
  static propTypes = {
    queryString: PropTypes.string.isRequired,
    onUpdateQuery: PropTypes.func.isRequired
  }

  render () {
    let {queryString, onUpdateQuery} = this.props
    return (
      <div>
        <QueryInput queryString={queryString} onUpdateQuery={onUpdateQuery} />
        <XCQLContainer />
        <FQContainer />
      </div>
    )
  }
}

const mapStateToProps = state => {
  let {queryString} = state
  return {queryString}
}

const mapDispatchToProps = (dispatch) => {
  return {
    onUpdateQuery: queryString => dispatch({
      type: QUERY_CHANGE,
      payload: queryString
    })
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
