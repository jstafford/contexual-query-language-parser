import {PropTypes} from 'prop-types'
import React, {Component} from 'react'
import TextArea from 'react-textarea-autosize'

class ParsedOutput extends Component {
  static propTypes = {
    queryString: PropTypes.string.isRequired,
    parserType: PropTypes.string.isRequired,
    parsedOutput: PropTypes.string.isRequired,
    parsedString: PropTypes.string.isRequired
  }

  render () {
    const {parserType, parsedOutput, parsedString} = this.props
    const styles = {
      resize: 'none',
      width: '40%'
    }

    return (
      <div>
        <p>{parserType}:</p>
        <TextArea value={parsedOutput} minRows='4' maxRows='80' style={styles} />
        <TextArea value={parsedString} minRows='4' maxRows='80' style={styles} />
      </div>
    )
  }
}

export default ParsedOutput
