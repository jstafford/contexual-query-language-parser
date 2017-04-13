'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DEFAULT_SERVER_CHOICE_FIELD = 'cql.serverChoice';
var DEFAULT_SERVER_CHOICE_RELATION = '=';

var indent = function indent(n, c) {
  var s = '';
  for (var i = 0; i < n; i++) {
    s += c;
  }
  return s;
};

var CQLModifier = function () {
  function CQLModifier() {
    _classCallCheck(this, CQLModifier);
  }

  _createClass(CQLModifier, [{
    key: 'constuctor',
    value: function constuctor() {
      this.name = null;
      this.relation = null;
      this.value = null;
    }
  }, {
    key: 'toString',
    value: function toString() {
      return this.name + this.relation + this.value;
    }
  }, {
    key: 'toXCQL',
    value: function toXCQL(n, c) {
      var s = indent(n + 1, c) + '<modifier>\n';
      s += s + indent(n + 2, c) + '<name>' + this.name + '</name>\n';
      if (this.relation != null) {
        s = s + indent(n + 2, c) + '<relation>' + this.relation + '</relation>\n';
      }
      if (this.value != null) {
        s = s + indent(n + 2, c) + '<value>' + this.value + '</value>\n';
      }
      s = s + indent(n + 1, c) + '</modifier>\n';
      return s;
    }
  }, {
    key: 'toFQ',
    value: function toFQ() {
      // we ignore modifier relation symbol, for value-less modifiers
      // we assume 'true'
      var value = this.value.length > 0 ? this.value : 'true';
      var s = '"' + this.name + '": "' + value + '"';
      return s;
    }
  }]);

  return CQLModifier;
}();

var CQLSearchClause = function () {
  function CQLSearchClause(field, fielduri, relation, relationuri, modifiers, term, scf, scr) {
    _classCallCheck(this, CQLSearchClause);

    this.field = field;
    this.fielduri = fielduri;
    this.relation = relation;
    this.relationuri = relationuri;
    this.modifiers = modifiers;
    this.term = term;
    this.scf = scf || DEFAULT_SERVER_CHOICE_FIELD;
    this.scr = scr || DEFAULT_SERVER_CHOICE_RELATION;
  }

  _createClass(CQLSearchClause, [{
    key: 'toString',
    value: function toString() {
      var field = this.field;
      var relation = this.relation;
      if (field === this.scf && relation === this.scr) {
        // avoid redundant field/relation
        field = null;
        relation = null;
      }
      return (field ? field + ' ' : '') + (relation ? relation : '') + (this.modifiers.length > 0 ? '/' + this.modifiers.join('/') : '') + (relation || this.modifiers.length ? ' ' : '') + '"' + this.term + '"';
    }
  }, {
    key: 'toXCQL',
    value: function toXCQL(n, c) {
      var s = indent(n, c) + '<searchClause>\n';
      if (this.fielduri.length > 0) {
        s = s + indent(n + 1, c) + '<prefixes>\n' + indent(n + 2, c) + '<prefix>\n' + indent(n + 3, c) + '<identifier>' + this.fielduri + '</identifier>\n' + indent(n + 2, c) + '</prefix>\n' + indent(n + 1, c) + '</prefixes>\n';
      }
      s = s + indent(n + 1, c) + '<index>' + this.field + '</index>\n';
      s = s + indent(n + 1, c) + '<relation>\n';
      if (this.relationuri.length > 0) {
        s = s + indent(n + 2, c) + '<identifier>' + this.relationuri + '</identifier>\n';
      }
      s = s + indent(n + 2, c) + '<value>' + this.relation + '</value>\n';
      if (this.modifiers.length > 0) {
        s = s + indent(n + 2, c) + '<modifiers>\n';
        for (var i = 0; i < this.modifiers.length; i++) {
          s += this.modifiers[i].toXCQL(n + 2, c);
        }
        s = s + indent(n + 2, c) + '</modifiers>\n';
      }
      s = s + indent(n + 1, c) + '</relation>\n';
      s = s + indent(n + 1, c) + '<term>' + this.term + '</term>\n';
      s = s + indent(n, c) + '</searchClause>\n';
      return s;
    }
  }, {
    key: 'toFQ',
    value: function toFQ() {
      var s = '{"term": "' + this.term + '"';
      if (this.field.length > 0 && this.field !== this.scf) {
        s += ', "field": "' + this.field + '"';
      }
      if (this.relation.length > 0 && this.relation !== this.scr) {
        s += ', "relation": "' + this._mapRelation(this.relation) + '"';
      }
      for (var i = 0; i < this.modifiers.length; i++) {
        // since modifiers are mapped to keys, ignore the reserved ones
        if (this.modifiers[i].name === 'term' || this.modifiers[i].name === 'field' || this.modifiers[i].name === 'relation') {
          continue;
        }
        s += ', ' + this.modifiers[i].toFQ();
      }
      s += '}';
      return s;
    }
  }, {
    key: '_mapRelation',
    value: function _mapRelation(rel) {
      switch (rel) {
        case '<':
          return 'lt';
        case '>':
          return 'gt';
        case '=':
          return 'eq';
        case '<>':
          return 'ne';
        case '>=':
          return 'ge';
        case '<=':
          return 'le';
        default:
          return rel;
      }
    }
  }, {
    key: '_remapRelation',
    value: function _remapRelation(rel) {
      switch (rel) {
        case 'lt':
          return '<';
        case 'gt':
          return '>';
        case 'eq':
          return '=';
        case 'ne':
          return '<>';
        case 'ge':
          return '>=';
        case 'le':
          return '<=';
        default:
          return rel;
      }
    }
  }]);

  return CQLSearchClause;
}();

var CQLBoolean = function () {
  function CQLBoolean() {
    _classCallCheck(this, CQLBoolean);

    this.op = null;
    this.modifiers = null;
    this.left = null;
    this.right = null;
  }

  _createClass(CQLBoolean, [{
    key: 'toString',
    value: function toString() {
      return (this.left.op ? '(' + this.left + ')' : this.left) + ' ' + this.op.toUpperCase() + (this.modifiers.length > 0 ? '/' + this.modifiers.join('/') : '') + ' ' + (this.right.op ? '(' + this.right + ')' : this.right);
    }
  }, {
    key: 'toXCQL',
    value: function toXCQL(n, c) {
      var s = indent(n, c) + '<triple>\n';
      s = s + indent(n + 1, c) + '<boolean>\n' + indent(n + 2, c) + '<value>' + this.op + '</value>\n';
      if (this.modifiers.length > 0) {
        s = s + indent(n + 2, c) + '<modifiers>\n';
        for (var i = 0; i < this.modifiers.length; i++) {
          s += this.modifiers[i].toXCQL(n + 2, c);
        }
        s = s + indent(n + 2, c) + '</modifiers>\n';
      }
      s = s + indent(n + 1, c) + '</boolean>\n';
      s = s + indent(n + 1, c) + '<leftOperand>\n' + this.left.toXCQL(n + 2, c) + indent(n + 1, c) + '</leftOperand>\n';

      s = s + indent(n + 1, c) + '<rightOperand>\n' + this.right.toXCQL(n + 2, c) + indent(n + 1, c) + '</rightOperand>\n';
      s = s + indent(n, c) + '</triple>\n';
      return s;
    }
  }, {
    key: 'toFQ',
    value: function toFQ(n, c, nl) {
      var s = '{"op": "' + this.op + '"';
      // proximity modifiers
      for (var i = 0; i < this.modifiers.length; i++) {
        s += ', ' + this.modifiers[i].toFQ();
      }
      s += ',' + nl + indent(n, c) + ' "s1": ' + this.left.toFQ(n + 1, c, nl);
      s += ',' + nl + indent(n, c) + ' "s2": ' + this.right.toFQ(n + 1, c, nl);
      var fill = n && c ? ' ' : '';
      s += nl + indent(n - 1, c) + fill + '}';
      return s;
    }
  }]);

  return CQLBoolean;
}();

var CQLParser = function () {
  function CQLParser() {
    _classCallCheck(this, CQLParser);

    this.qi = null;
    this.ql = null;
    this.qs = null;
    this.look = null;
    this.lval = null;
    this.val = null;
    this.prefixes = {};
    this.tree = null;
    this.scf = null;
    this.scr = null;
  }

  _createClass(CQLParser, [{
    key: 'parse',
    value: function parse(query, scf, scr) {
      if (!query) {
        throw new Error('The query to be parsed cannot be empty');
      }
      this.scf = typeof scf !== 'string' ? DEFAULT_SERVER_CHOICE_FIELD : scf;
      this.scr = typeof scr !== 'string' ? DEFAULT_SERVER_CHOICE_RELATION : scr;
      this.qs = query;
      this.ql = this.qs.length;
      this.qi = 0;
      this._move();
      this.tree = this._parseQuery(this.scf, this.scr, []);
      if (this.look !== '') {
        throw new Error('EOF expected');
      }
    }
  }, {
    key: 'parseFromFQ',
    value: function parseFromFQ(query, scf, scr) {
      if (!query) {
        throw new Error('The query to be parsed cannot be empty');
      }
      if (typeof query === 'string') {
        query = JSON.parse(query);
      }
      this.scf = typeof scf !== 'string' ? DEFAULT_SERVER_CHOICE_FIELD : scf;
      this.scr = typeof scr !== 'string' ? DEFAULT_SERVER_CHOICE_RELATION : scr;
      this.tree = this._parseFromFQ(query);
    }
  }, {
    key: '_parseFromFQ',
    value: function _parseFromFQ(fq) {
      // op-node
      if (fq.hasOwnProperty('op') && fq.hasOwnProperty('s1') && fq.hasOwnProperty('s2')) {
        var node = new CQLBoolean();
        node.op = fq.op;
        node.left = this._parseFromFQ(fq.s1);
        node.right = this._parseFromFQ(fq.s2);
        // include all other members as modifiers
        node.modifiers = [];
        for (var key in fq) {
          if (key === 'op' || key === 's1' || key === 's2') {
            continue;
          }
          var mod = new CQLModifier();
          mod.name = key;
          mod.relation = '=';
          mod.value = fq[key];
          node.modifiers.push(mod);
        }
        return node;
      }
      // search-clause node
      if (fq.hasOwnProperty('term')) {
        var _node = new CQLSearchClause();
        _node.term = fq.term;
        _node.scf = this.scf;
        _node.scr = this.scr;
        _node.field = fq.hasOwnProperty('field') ? fq.field : this.scf;
        _node.relation = fq.hasOwnProperty('relation') ? _node._remapRelation(fq.relation) : this.scr;
        // include all other members as modifiers
        _node.relationuri = '';
        _node.fielduri = '';
        _node.modifiers = [];
        for (var _key in fq) {
          if (_key === 'term' || _key === 'field' || _key === 'relation') {
            continue;
          }
          var _mod = new CQLModifier();
          _mod.name = _key;
          _mod.relation = '=';
          _mod.value = fq[_key];
          _node.modifiers.push(_mod);
        }
        return _node;
      }
      throw new Error('Unknow node type; ' + JSON.stringify(fq));
    }
  }, {
    key: 'toXCQL',
    value: function toXCQL(c) {
      c = typeof c === 'undefined' ? ' ' : c;
      return this.tree.toXCQL(0, c);
    }
  }, {
    key: 'toFQ',
    value: function toFQ(c, nl) {
      c = typeof c === 'undefined' ? '  ' : c;
      nl = typeof nl === 'undefined' ? '\n' : nl;
      return this.tree.toFQ(0, c, nl);
    }
  }, {
    key: 'toString',
    value: function toString() {
      return this.tree.toString();
    }
  }, {
    key: '_parseQuery',
    value: function _parseQuery(field, relation, modifiers) {
      var left = this._parseSearchClause(field, relation, modifiers);
      while (this.look === 's' && (this.lval === 'and' || this.lval === 'or' || this.lval === 'not' || this.lval === 'prox')) {
        var b = new CQLBoolean();
        b.op = this.lval;
        this._move();
        b.modifiers = this._parseModifiers();
        b.left = left;
        b.right = this._parseSearchClause(field, relation, modifiers);
        left = b;
      }
      return left;
    }
  }, {
    key: '_parseModifiers',
    value: function _parseModifiers() {
      var ar = [];
      while (this.look === '/') {
        this._move();
        if (this.look !== 's' && this.look !== 'q') {
          throw new Error('Invalid modifier.');
        }

        var name = this.lval;
        this._move();
        if (this.look.length > 0 && this._strchr('<>=', this.look.charAt(0))) {
          var rel = this.look;
          this._move();
          if (this.look !== 's' && this.look !== 'q') {
            throw new Error('Invalid relation within the modifier.');
          }

          var m = new CQLModifier();
          m.name = name;
          m.relation = rel;
          m.value = this.val;
          ar.push(m);
          this._move();
        } else {
          var _m = new CQLModifier();
          _m.name = name;
          _m.relation = '';
          _m.value = '';
          ar.push(_m);
        }
      }
      return ar;
    }
  }, {
    key: '_parseSearchClause',
    value: function _parseSearchClause(field, relation, modifiers) {
      if (this.look === '(') {
        this._move();
        var b = this._parseQuery(field, relation, modifiers);
        if (this.look === ')') {
          this._move();
        } else {
          throw new Error('Missing closing parenthesis.');
        }

        return b;
      } else if (this.look === 's' || this.look === 'q') {
        var first = this.val; // dont know if field or term yet
        this._move();
        if (this.look === 'q' || this.look === 's' && this.lval !== 'and' && this.lval !== 'or' && this.lval !== 'not' && this.lval !== 'prox') {
          var rel = this.val; // string relation
          this._move();
          return this._parseSearchClause(first, rel, this._parseModifiers());
        } else if (this.look.length > 0 && this._strchr('<>=', this.look.charAt(0))) {
          var _rel = this.look; // other relation <, = ,etc
          this._move();
          return this._parseSearchClause(first, _rel, this._parseModifiers());
        } else {
          // it's a search term
          var pos = field.indexOf('.');
          var pre = '';
          if (pos !== -1) {
            pre = field.substring(0, pos);
          }

          var uri = this._lookupPrefix(pre);
          if (uri.length > 0) {
            field = field.substring(pos + 1);
          }

          pos = relation.indexOf('.');
          if (pos === -1) {
            pre = 'cql';
          } else {
            pre = relation.substring(0, pos);
          }

          var reluri = this._lookupPrefix(pre);
          if (reluri.Length > 0) {
            relation = relation.Substring(pos + 1);
          }

          var sc = new CQLSearchClause(field, uri, relation, reluri, modifiers, first, this.scf, this.scr);
          return sc;
        }
        // prefixes
      } else if (this.look === '>') {
        this._move();
        if (this.look !== 's' && this.look !== 'q') {
          throw new Error('Expecting string or a quoted expression.');
        }

        var _first = this.lval;
        this._move();
        if (this.look === '=') {
          this._move();
          if (this.look !== 's' && this.look !== 'q') {
            throw new Error('Expecting string or a quoted expression.');
          }

          this._addPrefix(_first, this.lval);
          this._move();
          return this._parseQuery(field, relation, modifiers);
        } else {
          this._addPrefix('default', _first);
          return this._parseQuery(field, relation, modifiers);
        }
      } else {
        throw new Error('Invalid search clause.');
      }
    }
  }, {
    key: '_move',
    value: function _move() {
      // eat whitespace
      while (this.qi < this.ql && this._strchr(' \t\r\n', this.qs.charAt(this.qi))) {
        this.qi++;
      }
      // eof
      if (this.qi === this.ql) {
        this.look = '';
        return;
      }
      // current char
      var c = this.qs.charAt(this.qi);
      // separators
      if (this._strchr('()/', c)) {
        this.look = c;
        this.qi++;
        // comparitor
      } else if (this._strchr('<>=', c)) {
        this.look = c;
        this.qi++;
        // comparitors can repeat, could be if
        while (this.qi < this.ql && this._strchr('<>=', this.qs.charAt(this.qi))) {
          this.look = this.look + this.qs.charAt(this.qi);
          this.qi++;
        }
        // quoted string
      } else if (this._strchr("\"'", c)) {
        this.look = 'q';
        // remember quote char
        var mark = c;
        this.qi++;
        this.val = '';
        var escaped = false;
        while (this.qi < this.ql) {
          if (!escaped && this.qs.charAt(this.qi) === mark) {
            break;
          }
          if (!escaped && this.qs.charAt(this.qi) === '\\') {
            escaped = true;
          } else {
            escaped = false;
          }
          this.val += this.qs.charAt(this.qi);
          this.qi++;
        }
        this.lval = this.val.toLowerCase();
        if (this.qi < this.ql) {
          this.qi++;
        } else {
          // unterminated
          this.look = '';
        } // notify error
        // unquoted string
      } else {
        this.look = 's';
        this.val = '';
        while (this.qi < this.ql && !this._strchr('()/<>= \t\r\n', this.qs.charAt(this.qi))) {
          this.val = this.val + this.qs.charAt(this.qi);
          this.qi++;
        }
        this.lval = this.val.toLowerCase();
      }
    }
  }, {
    key: '_strchr',
    value: function _strchr(s, ch) {
      return s.indexOf(ch) >= 0;
    }
  }, {
    key: '_lookupPrefix',
    value: function _lookupPrefix(name) {
      return this.prefixes[name] ? this.prefixes[name] : '';
    }
  }, {
    key: '_addPrefix',
    value: function _addPrefix(name, value) {
      // overwrite existing items
      this.prefixes[name] = value;
    }
  }]);

  return CQLParser;
}();

exports.default = CQLParser;