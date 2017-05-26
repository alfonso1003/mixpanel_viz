function filterData(data,  value) {
          var filterdata = data.filter(function (row) {
            return row.event.replace(/ *\'[^)]*\'/g, "") == value;
          });
          return filterdata;
        }

function populateDropDown(data, dropDownName) {
    var select = d3.select(dropDownName)
        .append("select");

        select.append("option")
            .attr('class', 'dropdown')
            .attr("value", function () {
                return 'select event';
            })
            .text(function () {
                return 'select event';
            });

    for (var d in data) {
        select.append("option")
            .attr("value", function () {
                return data[+d];
            })
            .text(function () {
                return data[+d];
            });
    }
    return select;
}