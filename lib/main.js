// Generated by CoffeeScript 1.7.1
(function() {
  var TEXT, TRM, alert, badge, debug, echo, help, info, log, njs_fs, rainbow, rpr, urge, warn, whisper;

  njs_fs = require('fs');

  TRM = require('coffeenode-trm');

  rpr = TRM.rpr.bind(TRM);

  badge = 'ccdict';

  log = TRM.get_logger('plain', badge);

  info = TRM.get_logger('info', badge);

  whisper = TRM.get_logger('whisper', badge);

  alert = TRM.get_logger('alert', badge);

  debug = TRM.get_logger('debug', badge);

  warn = TRM.get_logger('warn', badge);

  help = TRM.get_logger('help', badge);

  urge = TRM.get_logger('urge', badge);

  echo = TRM.echo.bind(TRM);

  rainbow = TRM.rainbow.bind(TRM);

  TEXT = require('coffeenode-text');

  this.transform = function() {
    var chr, cid_hex, codepoint, fields, idx, idx_text, ignored, line, lines, match, name, route, text, value, _i, _len, _results;
    route = '/Volumes/Storage/downloads/Lingua-ZH-CCDICT-0.05/lib/Lingua/ZH/CCDICT/Data.pm';
    text = (require('fs')).readFileSync(route, {
      encoding: 'utf-8'
    });
    lines = text.split('\n');
    _results = [];
    for (_i = 0, _len = lines.length; _i < _len; _i++) {
      line = lines[_i];
      if (line[0] !== 'U') {
        continue;
      }
      fields = line.split('\t');
      codepoint = fields[0], name = fields[1], value = fields[2];
      codepoint = codepoint.trim();
      name = name.trim();
      value = value.trim();
      name = name.replace(/^f/, '');
      if (name === 'UTF8') {
        continue;
      }
      match = codepoint.match(/U\+([0-9a-fA-F]+)\.([0-9]+)/);
      if (match == null) {
        throw Error("illegal line: " + (rpr(line)));
      }
      ignored = match[0], cid_hex = match[1], idx_text = match[2];

      /* TAINT will fail for 32bit codepoints */
      chr = String.fromCharCode(parseInt(cid_hex, 16));
      idx = parseInt(idx_text, 10);
      value = value.replace(/&#x([0-9a-fA-F]+);/g, function(ignore, sub_cid_hex) {

        /* TAINT will fail for 32bit codepoints */
        return String.fromCharCode(parseInt(sub_cid_hex, 16));
      });
      _results.push(echo([chr, 'U+' + cid_hex, idx, name, value].join('\t')));
    }
    return _results;
  };

  if (module.parent == null) {
    this.transform();
  }

}).call(this);
