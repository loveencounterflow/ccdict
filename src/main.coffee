
############################################################################################################
# njs_util                  = require 'util'
# njs_path                  = require 'path'
njs_fs                    = require 'fs'
#...........................................................................................................
TRM                       = require 'coffeenode-trm'
rpr                       = TRM.rpr.bind TRM
badge                     = 'ccdict'
log                       = TRM.get_logger 'plain',     badge
info                      = TRM.get_logger 'info',      badge
whisper                   = TRM.get_logger 'whisper',   badge
alert                     = TRM.get_logger 'alert',     badge
debug                     = TRM.get_logger 'debug',     badge
warn                      = TRM.get_logger 'warn',      badge
help                      = TRM.get_logger 'help',      badge
urge                      = TRM.get_logger 'urge',      badge
echo                      = TRM.echo.bind TRM
rainbow                   = TRM.rainbow.bind TRM
TEXT                      = require 'coffeenode-text'

#-----------------------------------------------------------------------------------------------------------
@transform = ->
  route = '/Volumes/Storage/downloads/Lingua-ZH-CCDICT-0.05/lib/Lingua/ZH/CCDICT/Data.pm'
  text  = ( require 'fs' ).readFileSync route, encoding: 'utf-8'
  lines = text.split '\n'
  for line in lines
    continue unless line[ 0 ] is 'U'
    fields    = line.split '\t'
    [ codepoint
      name
      value ] = fields
    codepoint = codepoint.trim()
    name      = name.trim()
    value     = value.trim()
    name      = name.replace /^f/, ''
    continue if name is 'UTF8'
    match     = codepoint.match /U\+([0-9a-fA-F]+)\.([0-9]+)/
    throw Error "illegal line: #{rpr line}" unless match?
    # debug match
    [ ignored, cid_hex, idx_text, ] = match
    ### TAINT will fail for 32bit codepoints ###
    chr       = String.fromCharCode parseInt cid_hex, 16
    idx       = parseInt idx_text, 10
    value     = value.replace /&#x([0-9a-fA-F]+);/g, ( ignore, sub_cid_hex ) ->
      ### TAINT will fail for 32bit codepoints ###
      return String.fromCharCode parseInt sub_cid_hex, 16
    echo [ chr, 'U+' + cid_hex, idx, name, value, ].join '\t'

############################################################################################################
unless module.parent?
  @transform()


