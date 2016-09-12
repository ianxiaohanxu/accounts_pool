var counter = 1;
var color_list = [ "#ff0000", "#ffff00", "#00ff00", "#0066ff", "#ff00ff", "#ff8800", "#cceeff" ];

$($("div.gray_back").css("margin-top", $("nav").css("height")));

$("#generator").click(function(){
    var checked = $("input[name='stats_type']:checked").val();
    if (typeof(checked) != "undefined") {
       var new_element = $("<div class='input-group'><label class='input-group-btn'><span class='btn btn-primary'>Browse&hellip; </span></label><input type='text' class='form-control' readonly><span class='input-group-btn'><button class='btn btn-danger' type='button'>Delete !</button></span></div>"); 
       var input_id = "file_" + checked + "_" + counter;
       new_element.find("span.btn-primary").append($("<input/>", {
           type: "file",
           accept: ".csv",
           style: "display: none;",
           id: input_id
       }));
       $("#file_selector").append(new_element);
       
       var div_id = "chart_" + checked + "_" + counter++;
       $("#charts").append($("<div/>", { id: div_id }));
    }
});

$("#file_selector").on("change", "input[type='file']", function(){
   var file = event.target.files[0];
   var chart_id = "chart_" + event.target.id.substring(5);
   $(event.target).parents(".input-group").children("input").val(file.name);
   var reader = new FileReader();
   reader.readAsText(file);
   reader.onload = function(){
       var csv = new CSV(reader.result, {header: true});
       csv.forEach(function(record){
           record["time"] = new Date(record["time"]);
       });
       var fields = Object.keys(csv.parse()[0]);
       fields = fields.slice(1);
       var graph_list = [];
       var graph_temp = {
  	   		"bullet": "round",
  	   		"bulletBorderThickness": 2,
                 "bulletSize": 5,
                 "bulletColor": "#FFFFFF",
                 "useLineColorForBulletBorder": true,
  	   		"bulletBorderAlpha": 1,
  	   		"hideBulletsCount": 50,
  	   		"fillAlphas": 0
       };
       for (var field of fields) {
           var new_graph = {};
           $.extend(true, new_graph, graph_temp);
           var index = fields.indexOf(field);
           new_graph["lineColor"] = color_list[index];
           new_graph["title"] = field;
           new_graph["valueField"] = field;
           graph_list.push(new_graph);
       };
   	   var chart = AmCharts.makeChart(chart_id, {
  	   	"dataProvider": csv.parse(),
  	   	"type": "serial",
             "titles": [{
                 "text": file.name,
                 "size": 10
             }],
  	   	"mouseWheelZoomEnabled":true,
             "dataDateFormat": "YYYY-MM-DD JJ:NN:SS",
  	   	"theme": "light",
  	   	"legend": {
  	   		"useGraphSettings": true
  	   	},
  	   	"synchronizeGrid":true,
  	   	"valueAxes": [{
  	   		"axisColor": "#FF6600",
  	   		"axisThickness": 2,
  	   		"axisAlpha": 1,
  	   		"position": "left"
  	   	}],
        "graphs": graph_list,
  	   	//"graphs": [{
  	   	//	"lineColor": "#FF6600",
  	   	//	"bullet": "round",
  	   	//	"bulletBorderThickness": 2,
        //         "bulletSize": 5,
        //         "bulletColor": "#FFFFFF",
        //         "useLineColorForBulletBorder": true,
  	   	//	"bulletBorderAlpha": 1,
  	   	//	"hideBulletsCount": 50,
  	   	//	"title": "mem3331",
  	   	//	"valueField": "mem1",
  	   	//	"fillAlphas": 0
  	   	//}, {
  	   	//	"lineColor": "#FCD202",
  	   	//	"bullet": "round",
  	   	//	"bulletBorderThickness": 2,
        //         "bulletSize": 5,
        //         "bulletColor": "#FFFFFF",
        //         "useLineColorForBulletBorder": true,
  	   	//	"bulletBorderAlpha": 1,
  	   	//	"hideBulletsCount": 50,
  	   	//	"title": "mem2",
  	   	//	"valueField": "mem2",
  	   	//	"fillAlphas": 0
  	   	//}, {
  	   	//	"lineColor": "#B0DE09",
  	   	//	"bullet": "round",
  	   	//	"bulletBorderThickness": 2,
        //         "bulletSize": 5,
        //         "bulletColor": "#FFFFFF",
        //         "useLineColorForBulletBorder": true,
  	   	//	"bulletBorderAlpha": 1,
  	   	//	"hideBulletsCount": 50,
  	   	//	"title": "mem3",
  	   	//	"valueField": "mem3",
  	   	//	"fillAlphas": 0
  	   	//}
   	   	//],
  	   	"chartScrollbar": {
  	   	    },
  	   	"chartCursor": {
  	   		"pan": true,
  	   		"valueLineEnabled": true,
  	   		"valueLineBalloonEnabled": true,
                 "categoryBalloonDateFormat": "YYYY-MM-DD JJ:NN:SS",
  	   		"cursorAlpha":1,
  	   		"cursorColor":"#258cbb",
  	   		"valueLineAlpha":0.2,
  	   		"valueZoomable":true
  	   	},
  	   	"categoryField": "time",
  	   	"categoryAxis": {
  	   		"parseDates": true,
                 "minPeriod": "ss",
  	   		"axisColor": "#DADADA",
  	   		"minorGridEnabled": true
  	   	},
  	   	"export": {
  	   		"enabled": true,
  	   		"position": "bottom-right"
  	   	}
  	   })
   };

});

$("#file_selector").on("click", "button.btn-danger", function(){
        var file_element = $(event.target).parents(".input-group");
        var chart_id = file_element.find("input[type='file']").attr("id").substring(5);
        chart_id = "#chart_" + chart_id;
        $(chart_id).remove();
        file_element.remove();
    });

$("input[type='file'][accept='.csv']").change(function(){
   var file = event.target.files[0];
   $(event.target).parents(".input-group").children("input").val(file.name);
   var reader = new FileReader();
   reader.readAsText(file);
   reader.onload = function(){
       var csv = new CSV(reader.result, {header: true});
       csv.forEach(function(record){
           record["time"] = new Date(record["time"]);
       });
   };
});
