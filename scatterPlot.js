function drawScaterChart(Container, data) {
  /* -------- Set margin and height width -------- */
  var margin = {
      top: 20,
      right: 20,
      bottom: 30,
      left: 50
    },
    width = parseInt(d3.select(Container).style('width'), 10) - margin.left - margin.right,
    height = 540 - margin.top - margin.bottom;

  /* 
   * value accessor - returns the value to encode for a given data object.
   * scale - maps value to a visual display encoding, such as a pixel position.
   * map function - maps from data value to display value
   * axis - sets up axis
   */

  /* --------  Time Pasre -------- */
  var parseTime = d3.time.format("%H:%M:%S").parse;
  /* --------  Setup x -------- */
  var xValue = function (d) {
      return d.properties.time;
    }, // data -> value
    xScale = d3.scale.linear().range([0, width]), // value -> display
    xMap = function (d) {
      return xScale(xValue(d));
    },
    xAxis = d3.svg.axis().scale(xScale).orient("bottom").outerTickSize(0).tickPadding(10);

  /* --------  Setup y -------- */
  var yValue = function (d) {
      return d.properties.distinct_id;
    }, // data -> value
    yScale = d3.scale.linear().range([height, 0]), // value -> display
    yMap = function (d) {
      return yScale(yValue(d));
    }, // data -> display
    yAxis = d3.svg.axis().scale(yScale).orient("left").outerTickSize(0).tickPadding(10);

  /* --------  setup fill color -------- */
  var cValue = function (d) {
      return +d.properties.distinct_id;
    },

  color = d3.scale.ordinal()
    .range(["#8dd3c7","#ffffb3","#bebada","#fb8072","#80b1d3","#fdb462","#b3de69","#fccde5","#d9d9d9","#bc80bd","#ccebc5","#ffed6f"]);



  /* --------  Add the graph canvas to the body of the webpage -------- */
  var svg = d3.select(Container).append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  /* --------  Add the tooltip area to the webpage -------- */
  var tooltip = d3.select(Container).append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

    /* --------  Change string (from CSV) into number format -------- */
    data.forEach(function (d) {
      d.properties.time = +d.properties.time;
      d.properties.distinct_id = +d.properties.distinct_id;
    });

    /* --------  don't want dots overlapping axis, so add in buffer to data domain -------- */
    xScale.domain([d3.min(data, xValue) - 1, d3.max(data, xValue) + 1]);
    yScale.domain([d3.min(data, yValue) - 1, d3.max(data, yValue) + 1]);

    /* --------  X-axis -------- */
    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", -6)
      .style("text-anchor", "end")
      .text("Time");

    /* --------  Y-axis -------- */
    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Ids");

    /* --------  Draw dots -------- */
    svg.selectAll(".dot")
      .data(data)
      .enter().append("circle")
      .attr("class", "dot")
      .attr("r",  function (d) { return 10})
      .attr("cx", xMap)
      .attr("cy", yMap)
      .style("fill", function (d) {
        return color(cValue(d));
      })
      .on("mouseover", function (d) {
        d3.selectAll(".dot").style("opacity", function (d) {
          return 0.0;
        });
        d3.select(this).style("opacity", 1);
        /* --------  Show Tooltip -------- */
        tooltip.transition()
          .duration(200)
          .style("opacity", .9);
        tooltip.html(d["event"] +
            "<br/>Id : " + d.properties.distinct_id + "<br/>" +
            " Email : " +  d.properties.email + "<br/>" +
            " Time " + d.properties.time)
          .style("left", (d3.event.pageX + 5) + "px")
          .style("top", (d3.event.pageY - 28) + "px");
      })
      .on("mouseout", function (d) {
        /* --------  Hide Tooltip -------- */
        d3.selectAll(".dot").style("opacity", function (d) {
          return 1;
        });
        tooltip.transition()
          .duration(500)
          .style("opacity", 0);
      });

}