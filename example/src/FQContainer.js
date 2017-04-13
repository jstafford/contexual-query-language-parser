import CQLParser from 'contexual-query-language-parser'
import {connect} from 'react-redux'
import ParsedOutput from './ParsedOutput'

const cqlParser = new CQLParser()

const mapStateToProps = state => {
  var {queryString} = state
  var parserType = 'FQ'
  var parsedOutput
  var parsedString
  var errorMessage
  try {
    cqlParser.parse(queryString)
    parsedOutput = cqlParser.toFQ()
  } catch (error) {
    errorMessage = error.message
  }
  if (!errorMessage) {
    try {
      // re-parse fq to see the o/i matches
      cqlParser.parseFromFQ(parsedOutput)
      parsedString = cqlParser.toString()
    } catch (error) {
      errorMessage = error.message
    }
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

const FQContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ParsedOutput)

export default FQContainer
