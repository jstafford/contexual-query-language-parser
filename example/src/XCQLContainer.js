import CQLParser from 'contexual-query-language-parser'
import {connect} from 'react-redux'
import ParsedOutput from './ParsedOutput'

const cqlParser = new CQLParser()

const mapStateToProps = state => {
  var {queryString} = state
  var parserType = 'XCQL'
  var parsedOutput
  var parsedString
  var errorMessage
  try {
    cqlParser.parse(queryString)
    parsedOutput = cqlParser.toXCQL()
    parsedString = cqlParser.toString()
  } catch (error) {
    errorMessage = error.message
  }

  if (errorMessage) {
    parsedOutput = ''
    parsedString = errorMessage
  }

  return {queryString, parserType, parsedOutput, parsedString}
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

const XCQLContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ParsedOutput)

export default XCQLContainer
