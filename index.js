//table source data
const srcData = [{
  id: 0,
  item: 'apple',
  category: 'fruit'
}, {
  id: 0,
  item: 'banana',
  category: 'fruit'
}, {
  id: 0,
  item: 'carrot',
  category: 'veggie'
}, {
  id: 0,
  item: 'raspberry',
  category: 'berry'
}, {
  id: 0,
  item: 'potato',
  category: 'veggie'
}];

//DataTable initialization
const dataTable = $('#samples').DataTable({
  dom: 't',
  data: srcData,
  select: 'multi',
  columns: Object.keys(srcData[0]).map(key => {
    return {
      title: key,
      data: key
    };
  })
});

//grab all the unique sorted data entries from the necessary row
const category = dataTable.column(2).data().unique().sort();

//Drop down menu stop event propagation
$('#samples').on('click', 'tbody td select',
  event => event.stopPropagation());

//Write dropdown value into table
const writeCell = dropdown => {
  const currentRow = dataTable.row(dropdown.closest('tr'));
  const rowData = currentRow.data();
  rowData.category = dropdown.val();
  currentRow.remove();
  dataTable.row.add(rowData).draw();
};

dataTable.on('select', function (e, dt, type) {
  if (type === 'row') {
    const row = dataTable.row(dt);
    $(row.node()).find('td:eq(2)').html(
      '<select>' + category.reduce((options, item) =>
        options += `<option value="${item}" ${
          item == row.data().category ? 'selected' : ''}>${
          item}</option>`, '') + '</select>'
    );
    toggleDataAndDraw(row, type, '1');
  }
});

dataTable.on('deselect', function (e, dt, type) {
  if (type === 'row') {
    const row = dataTable.row(dt);
    writeCell($(row.node()).find('select'));
    toggleDataAndDraw(row, type, '0');
  }
});

const toggleDataAndDraw = (row, type, dataVal) => {
  if (type === 'row') {
    dataTable.cell({
      row: row.index(),
      column: 0
    }).data(dataVal);
    dataTable.draw();
  }
};
