$(document).ready(function ()
{

    getMyData(function (worksheetData)
    {
        // get the worksheet data as a "tree" array
        var treeAr = $.jStorage.get("myTree");
        if (treeAr)
        {
            console.log("Found myTree: ");
        } else
        {
            treeAr = getTreeArray(worksheetData);
            $.jStorage.set("myTree", treeAr);
            console.log("Saved myTree: ");
        };

        /** Given a worksheet, creates a "tree" array
        * [ 'tagname',
        *     [ 'category',
        *         ['topic1','topic2']
        *       'category2',
        *         ['topic1','topic2']
        *     ],
        *   'tag2',
        *     [ 'category',
        *         ['topic1','topic2']
        * ]
        */
        // create the tree in HTML
        var html = '<ul><li><a >Community Visioning</a><ul>';
        for (var tagI = 0; tagI < treeAr.length; tagI += 2)
        {

            html += '<li>';
            html += '<div>' + treeAr[tagI] + '</div>';

            html += '<ul>';
            for (var catI = 0; catI < treeAr[tagI + 1].length; catI += 2)
            {
                html += '<li>';
                html += '<a>' + treeAr[tagI + 1][catI] + '</a>';

                html += '<ul>';
                for (var topicI = 0; topicI < treeAr[tagI + 1][catI + 1].length; topicI += 2)
                {
                    html += '<li>';
                    html += '<a>' + treeAr[tagI + 1][catI + 1][topicI] + '</a>';
                    html += '</li>';
                }
                html += '</ul>';
                html += '</li>';
            }
            html += '</ul>';
            html += '</li>';
        }
        html += '</li></ul></ul>';

        // insert the tree HTML
        $("#bodyId").html(html);

        //kickoff MindMap
        goMindMap();

    });

    function getMyData(cb)
    {

        // test if data already exists, cached, or cookied
        var data = $.jStorage.get("myData");
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
            var url = "wsheet.js";
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
    }

    function getTreeArray(worksheet)
    {
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
                tagIndex = treeAr.push(tag) - 1; // add tag
                treeAr.push([]); // add array of categories
            }

            var categoryIndex = treeAr[tagIndex + 1].indexOf(category);

            if (categoryIndex < 0)
            {
                categoryIndex = treeAr[tagIndex + 1].push(category) - 1; // add category
                treeAr[tagIndex + 1].push([]); // add array of topics
            }

            treeAr[tagIndex + 1][categoryIndex + 1].push(topic);
        }

        return treeAr;
    }

    function goMindMap()
    {
        // enable the mindmap in the body

        $('body').mindmap();

        // add the data to the mindmap
        var root = $('body>ul>li').get(0).mynode = $('body').addRootNode($('body>ul>li>a').text(), {
            href: '/',
            url: '/',
            onclick: function (node)
            {
                $(node.obj.activeNode.content).each(function ()
                {
                    this.hide();
                });
            }
        });
        $('body>ul>li').hide();
        var addLI = function ()
        {
            var parentnode = $(this).parents('li').get(0);
            if (typeof (parentnode) == 'undefined') parentnode = root;
            else parentnode = parentnode.mynode;

            this.mynode = $('body').addNode(parentnode, $('a:eq(0)', this).text(), {
                //          href:$('a:eq(0)',this).text().toLowerCase(),
                href: $('a:eq(0)', this).attr('href'),
                onclick: function (node)
                {
                    $(node.obj.activeNode.content).each(function ()
                    {
                        this.hide();
                    });
                    $(node.content).each(function ()
                    {
                        this.show();
                    });
                }
            });
            $(this).hide();
            $('>ul>li', this).each(addLI);
        };
        $('body>ul>li>ul').each(function ()
        {
            $('>li', this).each(addLI);
        });
    }

});  