/* eslint-env mocha */
import assert from 'assert'
import CQLParser from '../src/cql'

describe('CQLParser', function () {
  var cqlParser = new CQLParser()

  function parse () {
    let queryString = arguments[0]
    cqlParser.parse(queryString)
    return cqlParser.toString()
  }

  describe('parse()', function () {
    // examples from http://www.loc.gov/standards/sru/cql/spec.html
    var specExamples = [
      {args: ['dc.title any fish'], expected: 'dc.title any "fish"'},
      {args: ['dc.title any fish or dc.creator any sanderson'], expected: 'dc.title any "fish" or dc.creator any "sanderson"'},
      {args: ['dc.title any fish sortBy dc.date/sort.ascending'], expected: 'dc.title any "fish" sortBy dc.date/sort.ascending'},
      {args: ['> dc = "info:srw/context-sets/1/dc-v1.1" dc.title any fish'], expected: '> dc = "info:srw/context-sets/1/dc-v1.1" dc.title any "fish"'},
      {args: ['fish'], expected: '"fish"'},
      {args: ['cql.serverChoice = fish'], expected: 'cql.serverchoice = "fish"'},
      {args: ['title any fish'], expected: 'title any "fish"'},
      {args: ['dc.title cql.any fish'], expected: 'dc.title cql.any "fish"'},
      {args: ['dc.title any/relevant fish'], expected: 'dc.title any/relevant "fish"'},
      {args: ['dc.title any/ relevant /cql.string fish'], expected: 'dc.title any/relevant/cql.string "fish"'},
      {args: ['dc.title any/rel.algorithm=cori fish'], expected: 'dc.title any/rel.algorithm=cori "fish"'},
      {args: ['dc.title any fish or (dc.creator any sanderson and dc.identifier = "id:1234567")'], expected: 'dc.title any "fish" or (dc.creator any "sanderson" and dc.identifier = "id:1234567")'},
      {args: ['dc.title any fish or/rel.combine=sum dc.creator any sanderson'], expected: 'dc.title any "fish" or/rel.combine=sum dc.creator any "sanderson"'},
      {args: ['dc.title any fish prox/unit=word/distance>3 dc.title any squirrel'], expected: 'dc.title any "fish" prox/unit=word/distance>3 dc.title any "squirrel"'},
      {args: ['"cat" sortBy dc.title'], expected: '"cat" sortBy dc.title'},
      {args: ['"dinosaur" sortBy dc.date/sort.descending dc.title/sort.ascending'], expected: '"dinosaur" sortBy dc.date/sort.descending dc.title/sort.ascending'},
      {args: ['> dc = "http://deepcustard.org/" dc.custardDepth > 10'], expected: '> dc = "http://deepcustard.org/" dc.custardDepth > 10'},
      {args: ['> "http://deepcustard.org/" custardDepth > 10'], expected: '> "http://deepcustard.org/" custardDepth > 10'},
      {args: ['dC.tiTlE any fish'], expected: 'dc.title any "fish"'},
      {args: ['dc.TitlE Any/rEl.algOriThm=cori fish soRtbY Dc.TitlE'], expected: 'dc.title any/rel.algorithm=cori "fish" sortby dc.title'}
    ]

    specExamples.forEach(function (specExample) {
      it('correctly parses each example from the specification', function () {
        var res = parse.apply(null, specExample.args)
        assert.equal(res, specExample.expected)
      })
    })
  })
})
