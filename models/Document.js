/**
 * @fileOverview A Document model.
 * @name Document
 *
 * @constructor
 * @param {Object} opts  Options for initializing a document.
 *   {
 *     title: 'Doc Title',
 *     body: 'Doc body text',
 *   }
 */
function DocumentModel(opts) {
  var SELF = this;

  /** The title of the document.
   * @type String
   */
  this.title = '';

  /** The body of the document.
   * @type String
   */
  this.body = '';

  var _private = {
    init: function(opts) {
      if (opts.title) {
        SELF.title = opts.title;
      }
      if (opts.body) {
        SELF.body = opts.body;
      }
    }
  };

  this.getDocBookXML = function() {
    var docBookXml = '<?xml version="1.0"?>';
    docBookXml += '<!DOCTYPE book PUBLIC "-//OASIS//DTD DocBook V5.0//EN" "http://www.oasis-open.org/docbook/xml/5.0/docbook.dtd">';
    docBookXml += '<book xmlns="http://docbook.org/ns/docbook" version="5.0">';

    docBookXml += '<info>';
    docBookXml += '<title>' + SELF.title + '</title>';
    docBookXml += '</info>';

    docBookXml += '<chapter>';
    docBookXml += '<title>' + SELF.title + '</title>';
    docBookXml += '<para>' + SELF.body + '</para>';
    docBookXml += '</chapter>';

    docBookXml += '</book>';

    return docBookXml;
  };

  // init
  (function() {
    if (opts) {
      _private.init(opts);
    }
  })();

  return SELF;
}

exports.Document = DocumentModel;