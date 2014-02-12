/**
 * @fileOverview An Event model.
 * @name Event
 *
 * @constructor
 */
function EventModel(args) {
  var SELF = this;

  /** Summary of the event.
   * @type String
   */
  this.summary = args.summary;

  /** The location of the event.
   * @type String
   */
  this.location = args.location;

  /** The starting date/time of the event.
   * @type Date
   */
  this.start = new Date(args.start);

  /** The ending date/time of the event.
   * @type Date
   */
  this.end = new Date(args.end);
}
exports.Event = EventModel;

var event =
{
  "data": {
    "id": "0",
    "guid": "",
    "kind": "",
    "status": "",
    "summary": "",
    "start": "",
    "end": "",
    "location": "",
    "timeZone": "",
    "link": ""
    }
}