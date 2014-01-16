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

  /** An array of column names
   * @type Array
   */
  this.columns = [];

  /** An array of arrays containg values.
   * @type Array
   */
  this.data = [];

  // init
  (function() {
    if (args) {
      if (args.columns) {
        SELF.columns = args.columns;
      }
    }
  })();

  return SELF;
}

exports.Worksheet = WorksheetModel;