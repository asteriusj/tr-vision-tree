/*
* 
* (c) 2014 Asterius Media LLC <asteriusmedia.com>
* All Rights Reserved
*
*
* .
*/

    /*** Default variable declarations ***/
    var qReset = false;
    var cName = '';
    var cValue = '';
    var qs = (function (a)
    {
        if (a == "") return {};
        var b = {};
        for (var i = 0; i < a.length; ++i)
        {
            var p = a[i].split('=');
            if (p.length != 2) continue;
            b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
        }
        return b;
    })(window.location.search.substr(1).split('&'));

    if (typeof qs["reset"] !== 'undefined')
    {
        qReset = true;
    }
    if (typeof qs["tag"] !== 'undefined')
    {
        cName = "tag";
        cValue = qs["tag"];
    }
    if (typeof qs["category"] !== 'undefined')
    {
        cName = "category";
        cValue = qs["category"];
    }
    if (typeof qs["topic"] !== 'undefined')
    {
        cName = "topic";
        cValue = qs["topic"];
    }
    if (typeof qs["meeting"] !== 'undefined')
    {
        cName = "meeting";
        cValue = qs["meeting"];
    }
    var orderBy = cName;

    function GetWallData() {

        var public_spreadsheet_url = 'https://docs.google.com/spreadsheet/pub?key=0AiolA0gyG7PkdFhyN3Z4SjdFUW41RmI3U3NkekM0SUE&output=html';
        //public_spreadsheet_url = "HTMLPage.html";
        var params = {};

        try {

            Tabletop.init({ key: public_spreadsheet_url,
                callback: getSheetData,
                wanted: ["Public WALL", "Individual Cards"],
                orderby: orderBy,
                debug: true
            });

            function getSheetData(data, tabletop)
            {
                try {
                    console.log("getDataSheet");

                    $.jStorage.set("myData", data);
                    $.jStorage.set("myTable", tabletop);
                    var mw = "";
                    $.each(tabletop.sheets("Public WALL").all(), function (i, wall)
                    {
                        switch (orderBy)
                        {
                            case "meeting":
                                var sColumn = wall.meeting;
                                var qp = ["meeting", "tag", "category", "topic"];
                                var dv = [wall.meeting, wall.tag, wall.category, wall.topic];
                                break;
                            case "tag":
                                var sColumn = wall.tag;
                                var qp = ["tag", "category", "topic", "meeting"];
                                var dv = [wall.tag, wall.category, wall.topic, wall.meeting];
                                break;
                            case "category":
                                var sColumn = wall.category;
                                var qp = ["category", "meeting", "topic", "tag"];
                                var dv = [wall.category, wall.meeting, wall.tag, wall.tag];
                                break;
                            case "topic":
                                var sColumn = wall.topic;
                                var qp = ["topic", "meeting", "category", "tag"];
                                var dv = [wall.topic, wall.meeting, wall.category, wall.tag];
                                break;
                            default:
                                var sColumn = wall.tag;
                                var qp = ["tag", "category", "topic", "meeting"];
                                var dv = [wall.tag, wall.category, wall.topic, wall.meeting];
                                break;
                        };


                        var wall_li1 = '<li>';
                        wall_li1 = wall_li1 + '<p><em><a href="ListView.html?' + qp[0] + "=" + dv[0] + '">' + dv[0] + '</a></em></p>'
                        wall_li1 = wall_li1 + '<p><a href="ListView.html?' + qp[1] + "=" + dv[1] + '">' + dv[1] + '</a></p>'
                        wall_li1 = wall_li1 + '<p><a href="ListView.html?' + qp[2] + "=" + dv[2] + '">' + dv[2] + "</p>"
                        wall_li1 = wall_li1 + '<p><a href="ListView.html?' + qp[3] + "=" + dv[3] + '">' + dv[3] + "</p>"
                        wall_li1 = wall_li1 + '</li>';
                        //wall_li1.appendTo("#wall");
                        mw = mw + wall_li1.toString();
                        //console.log("li1: ", wall_li1);
                    });

                    myWall = mw;
                    $.jStorage.set("myWall", myWall);
                    $("#wall").html(myWall);
                    //return myWall;
                    //$("#startdaySelect").html(contentBlock);
                } catch (e) {
                    console.log(e);
                };  
            };

        } catch (e) {
            console.log(e);
        };
        
    };