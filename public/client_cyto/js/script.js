//$(function(){

getMyData(function (worksheetData)
{
    // get the worksheet data as a "tree" array
    var nodeAr = $.jStorage.get("myNodes");
    nodeAr = null;
    if (nodeAr)
    {
        console.log("Found myNodes ");
    } else
    {
        nodeAr = getNodeArray(worksheetData);
        $.jStorage.set("myNodes", nodeAr);
        console.log("Saved myNodes: ");
    };

    // insert the tree HTML
    //$("#bodyId").html(html);

    //kickoff Cytoscape
    goCytoscape();

});

    function getMyData(cb)
    {

        // test if data already exists, cached, or cookied
        var data = $.jStorage.get("myData");
        data = null;
        if (data)
        {
            console.log("Found myData");
            // execute callback, passing data
            if (cb)
            {
                cb(data);
            }
        } else
        {
            //else call for json file fetch
            var url = "miniwallsheet.js";
            $.getJSON(url, function (resp)
            {
                // store the data
                $.jStorage.set("myData", resp);
                console.log("Saved myData: ");
                // execute callback, passing data
                if (cb)
                {
                    cb(resp);
                }
            });
        }
    } // end get my data

    function getNodeArray(worksheet)
    {
        
        var nodeAr = [];
        var edgeAr = [];
        
        var rootData = "{ 'data': { 'id': 'n0', 'name': 'Visions' } }";
        nodeAr.push(rootData);
        var meetingAr = [];
        var tagAr = [];
        var categoryAr = [];
        var topicAr = [];

        for (var i = 0; i < worksheet.data.length; i++)
        {
            var row = worksheet.data[i];
            var meeting = row[worksheet.columns.indexOf('meeting')];
            var tag = row[worksheet.columns.indexOf('tag')];       
            var category = row[worksheet.columns.indexOf('category')];
            var topic = row[worksheet.columns.indexOf('topic')];

            var id = "";
            var name = "";
            var idx = i;
            var source = "";
            var target = "";
            var data = "";

            //evaluate meeting
            if (!~meetingAr.indexOf(meeting)) 
            {
                meetingAr.push(meeting);
                id = "m" + meetingAr.length;
                name = meeting;
                data = "{ 'data': { 'id': '" + id + "', 'name': '" + name + "' } }"; 
                nodeAr.push(data);
                source = id;
                target = "n0";
                data = "{ 'data': { 'id': 'emn-" + id + "', 'source': '" + source + "', 'target': '" + target + "' } }";
                edgeAr.push(data);
            }

            //evaluate tag
            if (!~tagAr.indexOf(tag)) 
            {
                tagAr.push(tag);
                id = "t" + tagAr.length;
                name = tag;
                data = "{ 'data': { 'id': '" + id + "', 'name': '" + name + "' } }"; 
                nodeAr.push(data);
                source = id;
                target = "n0";
                data = "{ 'data': { 'id': 'etn-" + id + "', 'source': '" + source + "', 'target': '" + target + "' } }";
                edgeAr.push(data);
            }
            
            //evaluate category
            if (!~categoryAr.indexOf(category)) 
            {
                categoryAr.push(category);
                id = "c" + categoryAr.length;
                name = category;
                data = "{ 'data': { 'id': '" + id + "', 'name': '" + name + "' } }"; 
                nodeAr.push(data);
                source = id;
                target = "t" + (tagAr.indexOf(tag) + 1);
                data = "{ 'data': { 'id': 'ect-" + id + "', 'source': '" + source + "', 'target': '" + target + "' } }";
                edgeAr.push(data);
            }
            
            //evaluate topic
            if (!~topicAr.indexOf(topic)) 
            {
                topicAr.push(topic);
                id = "p" + topicAr.length;
                name = topic;
                data = "{ 'data': { 'id': '" + id + "', 'name': '" + name + "' } }"; 
                nodeAr.push(data);
                source = id;
                target = "c" + (categoryAr.indexOf(category) + 1);
                data = "{ 'data': { 'id': 'epc-" + id + "', 'source': '" + source + "', 'target': '" + target + "' } }";
                edgeAr.push(data);
                target = id;
                source = "m" + (meetingAr.indexOf(meeting) + 1);
                data = "{ 'data': { 'id': 'emp-" + id + "', 'source': '" + source + "', 'target': '" + target + "' } }";
                edgeAr.push(data);
            }
        }

        //var str = "{ 'nodes': " + JSON.stringify(nodeAr) + ", 'edges': " + JSON.stringify(edgeAr) + " }";
        var str = "{ 'nodes': [" + nodeAr + "], 'edges': [" + edgeAr + "] }";
        //console.log("str: " + str);
        var elementSet = eval("(" + str + ")");
        
        return elementSet;
    } // end get node arr

// on start cyto
function goCytoscape() 
{

var myNodes = $.jStorage.get("myNodes");

$('#cy').cytoscape({
    style: cytoscape.stylesheet()
    .selector('node')
      .css({
          'content': 'data(name)',
          'text-valign': 'center',
          'color': 'white',
          'text-outline-width': 2,
          'text-outline-color': '#888'
      })
    .selector('edge')
      .css({
          'target-arrow-shape': 'triangle'
      })
    .selector(':selected')
      .css({
          'background-color': 'black',
          'line-color': 'black',
          'target-arrow-color': 'black',
          'source-arrow-color': 'black'
      })
    .selector('.faded')
      .css({
          'opacity': 0.25,
          'text-opacity': 0
      }),

    layout: {
        name: 'grid',
        padding: 10
    },

    ready: function ()
    {
        window.cy = this;

        // giddy up...

        // JAS PER EXAMPLES
        cy.load(myNodes);


        //cy.elements().unselectify();

        cy.on('tap', 'node', function (e)
        {
            var node = e.cyTarget;
            var neighborhood = node.neighborhood().add(node);

            cy.elements().addClass('faded');
            neighborhood.removeClass('faded');
        });

        cy.on('tap', function (e)
        {
            if (e.cyTarget === cy)
            {
                cy.elements().removeClass('faded');
            }
        });
    }
});

    
} // on start cyto
//}); 