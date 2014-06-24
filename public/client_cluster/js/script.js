
    getMyData(function (worksheetData)
    {
        // get the worksheet data as a "tree" graph
        var treeAr = $.jStorage.get("myGraph");
        if (!treeAr)
        {
            console.log("Found myGraph ");
        } else
        {
            nodeAr = getTreeGraph(worksheetData);
            $.jStorage.set("myGraph", nodeAr);
            console.log("Saved myGraph: ");
            console.log(JSON.stringify(nodeAr))
        };

    });

    function getMyData(cb)
    {

        // test if data already exists, cached, or cookied
        var data = $.jStorage.get("myData");
        if (!data)
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
            var url = "msheet.js";
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

    function getTreeGraph(worksheet)
    {
        var graphAr = [];
        var rootData = "{ 'name': '', 'children': [] } }";
        graphAr.push(rootData);
        var treeAr = [];
        for (var i = 0; i < worksheet.data.length; i++)
        {
            var row = worksheet.data[i];

            var tag = row[worksheet.columns.indexOf('tag')];
            var category = row[worksheet.columns.indexOf('category')];
            var topic = row[worksheet.columns.indexOf('topic')];
            var meeting = row[worksheet.columns.indexOf('meeting')];

            var tagIndex = treeAr.indexOf(tag);

            if (tagIndex < 0)
            {
                var name = tag;
                data = "'name': '" + name + "', 'children': "; 
                tagIndex = treeAr.push(data) - 1; // add tag
                treeAr.push([]); // add array of categories
            }

            var categoryIndex = treeAr[tagIndex + 1].indexOf(category);

            if (categoryIndex < 0)
            {
                var name = category;
                data = "'name': '" + name + "', 'children': "; 
                categoryIndex = treeAr[tagIndex + 1].push(data) - 1; // add category
                treeAr[tagIndex + 1].push([]); // add array of topics
            }

            treeAr[tagIndex + 1][categoryIndex + 1].push(topic);
        }

        return treeAr;
    }