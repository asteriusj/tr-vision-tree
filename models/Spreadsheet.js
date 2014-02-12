/**
 * @fileOverview A Worksheet model.
 * @name Spreadsheet
 *
 * Example model:
 *   var worksheet = {
 *     columns: ['A1','B1'],
 *     data: [
 *       ['value','vaule'],
 *       ['value','vaule']
 *     ]
 *   }
 *
 *
 * @constructor
 */
function WorksheetModel(args) {
  var SELF = this;

  this.SpreadsheetID;
  this.WorksheetID;

  /** An array of column names
   * @type Array
   */
  this.columns = [];

  /** An array of arrays containg values.
   * @type Array
   */
  this.data = [];

  this.CalSyncCalendarID;

  var _private = {
    initGoogleBody: function(body) {
      if (body.feed.entry) {
        for (var i=0; i<body.feed.entry.length; i++) {
          var entry = body.feed.entry[i];
          var row = [];

          // needed for edit/updates
          row['_'] = {
            id: entry.id['$t'],
            updated: entry.updated['$t'],
            title: entry.title['$t'],
            content: entry.content['$t'],
            links: [],
            editUrl: '',
          }
          for (var linkI=0; linkI<entry.link.length; linkI++) {
            var link = entry.link[linkI];
            row['_'].links[row['_'].links.length] = {
              rel: link.rel,
              type: link.type,
              href: link.href
            }
            if (link.rel === 'edit') {
              row['_'].editUrl = link.href;
            }
          }

          for (var key in entry) {
            if (key.indexOf('gsx$') === 0) {

              // add columns only once
              if (i === 0) {
                SELF.columns[SELF.columns.length] = key.substr(4);
              }

              // add data to row
              row[row.length] = entry[key]['$t'];
            }
          }

          // add row
          SELF.data[SELF.data.length] = row;
        }
      }
    }
  };

  // init
  (function() {
    if (args) {
      SELF.SpreadsheetID = args.SpreadsheetID;
      SELF.WorksheetID = args.WorksheetID;

      if (args.googleBody) {
        _private.initGoogleBody(args.googleBody);
      }

      SELF.CalSyncCalendarID = args.CalSyncCalendarID;
    }
  })();

  return SELF;
}

exports.Worksheet = WorksheetModel;