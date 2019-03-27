$(document).ready(function() {
  var table = $("#samples").DataTable({
    processing: true,
    serverSide: false,
    pageLength: -1,
    lengthMenu: [[100, 250, 500, -1], [100, 250, 500, "All"]],
    ajax: "./data.json",
    columns: [
      { data: "", defaultContent: "0", visible: false },
      {
        data: "",
        defaultContent: "",
        orderable: false,
        className: "select-checkbox",
        targets: 1
      },
      { title: "Sample Name", className: "dt-left", data: 1 },
      { title: "Region/Program", className: "dt-left", data: 2 },
      { title: "Class", className: "dt-left", data: 3 },
      { title: "Category", className: "dt-left", data: 4 },
      { title: "QC Concerns", className: "dt-left", data: 5 }
    ],
    select: {
      style: "multi"
    },
    order: [[4, "asc"], [5, "asc"], [3, "asc"]],
    orderFixed: [0, "desc"],
    dom: "BfrtipF",
    buttons: [
      {
        extend: "excel",
        text:
          '<span class="fa fa-file-excel-o"></span> Download (ALL) or (SELECTED)',
        exportOptions: {
          columns: [2, 5],
          modifier: {
            search: "applied",
            order: "applied"
          }
        }
      },
      {
        text: "Use Selected Library",
        action: function(e, dt, node, config) {
          alert(
            "This buton needs to pass the Sample Name and Category columns to php."
          );
        }
      },
      {
        text: "Upload Predefined Library",
        action: function(e, dt, node, conf) {
          alert(
            "This button needs to allow a csv file to be uploaded and passed to php."
          );
        }
      },
      {
        text: "Select Default Library 1",
        action: function(e, dt, node, conf) {
          alert(
            "This button will automatically check all rows that match predefined list 1."
          );
        }
      },
      {
        text: "Select Default Library 2",
        action: function(e, dt, node, conf) {
          alert(
            "This button will automatically check all rows that match predefined list 2."
          );
        }
      }
    ]
  });

  table.on("select", function(e, dt, type, indexes) {
    if (type === "row") {
      var row = table.row(dt);
      table.cell({ row: row.index(), column: 0 }).data("1");
      table.draw();
    }
  });

  table.on("deselect", function(e, dt, type, indexes) {
    if (type === "row") {
      var row = table.row(dt);
      table.cell({ row: row.index(), column: 0 }).data("0");
      table.draw();
    }
  });

  //grab all the unique sorted data entries from the necessary row
  const category = table
    .column(4)
    .data()
    .unique()
    .sort();

  //Row click handler
  $("#samples").on("click", "td", function() {
    //highlight selected row
    const clickedTr = $(this).closest("tr");

    //$('#samples tbody tr').removeClass('selected');
    clickedTr.toggleClass("selected");
    if (!clickedTr.hasClass("selected")) {
      writeCell(clickedTr.find("select"));
    } else {
      //grab current value of target cell
      const currentCellValue = table.row(clickedTr).data().category;

      //prepare drop down menu
      clickedTr
        .find("td:eq(4)")
        .html(
          "<select>" +
            category.reduce(
              (options, item) =>
                (options += `<option value="${item}" ${
                  item == currentCellValue ? "selected" : ""
                }>${item}</option>`),
              ""
            ) +
            "</select>"
        );
      console.log(
        "<select>" +
          category.reduce(
            (options, item) =>
              (options += `<option value="${item}" ${
                item == currentCellValue ? "selected" : ""
              }>${item}</option>`),
            ""
          ) +
          "</select>"
      );
    }
  });

  //Drop down menu stop event propagation
  $("#samples").on("click", "tbody td select", event =>
    event.stopPropagation()
  );

  //Write dropdown value into table
  var writeCell = dropdown => {
    const cellValue = dropdown.val();
    const currentRow = table.row(dropdown.closest("tr"));
    const rowData = currentRow.data();
    rowData.category = cellValue;
    currentRow.remove();
    table.row.add(rowData).draw();
  };
});
