Contextual Query Language parser in JavaScript
==========================================

A hand-written, recursive descent parser of the Contextual Query Language as
used in the standardized information retrieval protocol—Search/Retrieval via
URL (SRU).

The parser can be used in places where the front-end query analysis is
required (e.g search UIs, etc).

Based on the original work of Jakub Skoczen, with updates from Jason Stafford
to make it a node package and move it into the ES6 world.

CQL specification, including the grammar and detailed description of the
language: [CQL specs](http://www.loc.gov/standards/sru/cql/)

There is a slightly modified version of the specification, which has been
taken over by OASIS available at [searchRetrieve: Part 5. CQL](http://docs.oasis-open.org/search-ws/searchRetrieve/v1.0/os/part5-cql/searchRetrieve-v1.0-os-part5-cql.html)
