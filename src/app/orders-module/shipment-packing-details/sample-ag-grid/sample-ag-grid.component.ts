import { Component } from "@angular/core";

@Component({
  selector: "app-sample-ag-grid",
  template: `<ag-grid-angular
    style="width: 100%; height: 500px;"
    class="ag-theme-alpine"
    [rowData]="rowData"
    [columnDefs]="columnDefs"
    [groupDefaultExpanded]="groupDefaultExpanded"
    [autoGroupColumnDef]="autoGroupColumnDef"
    [groupUseEntireRow]="false"
  >
  </ag-grid-angular>`,
})
export class SampleAgGridComponent {
  columnDefs = [
    // { headerName: "Country", field: "country", rowGroup: true },
    // { headerName: "Year", field: "year", rowGroup: true },
    // { headerName: "Sport", field: "sport" },
    // { headerName: "Gold", field: "gold" },
    // { headerName: "Silver", field: "silver" },
    // { headerName: "Bronze", field: "bronze" },
    {
      headerName: "Pallet",
      field: "packing_id",
      rowGroup: true,
    },
    {
      headerName: "Size",
      field: "size",
    },
    {
      headerName: "Type",
      field: "type",
    },
  ];

  autoGroupColumnDef = {
    headerName: "Group",
    field: "athlete",
    cellRenderer: "agGroupCellRenderer",
    cellRendererParams: { checkbox: true },
  };

  // rowData = [
  //   {
  //     athlete: "Michael Phelps",
  //     country: "USA",
  //     year: "2008",
  //     sport: "Swimming",
  //     gold: 8,
  //     silver: 0,
  //     bronze: 0,
  //   },
  //   {
  //     athlete: "Usain Bolt",
  //     country: "Jamaica",
  //     year: "2008",
  //     sport: "Athletics",
  //     gold: 3,
  //     silver: 0,
  //     bronze: 0,
  //   },
  //   {
  //     athlete: "Usain Bolt",
  //     country: "Jamaica",
  //     year: "2012",
  //     sport: "Athletics",
  //     gold: 3,
  //     silver: 0,
  //     bronze: 0,
  //   },
  //   {
  //     athlete: "Michael Phelps",
  //     country: "USA",
  //     year: "2012",
  //     sport: "Swimming",
  //     gold: 4,
  //     silver: 2,
  //     bronze: 0,
  //   },
  //   // Add more data here
  // ];

  rowData = [
    {
      packing_id: 2502,
      size: "32",
      type: "Box",
    },
    {
      packing_id: 2502,
      size: "32",
      type: "Box",
    },
    {
      packing_id: 2505,
      size: "sad",
      type: "Boxq",
    },
    {
      packing_id: 2505,
      size: "dasd",
      type: "sd",
    },
  ];
  groupDefaultExpanded = -1; // -1 means all groups expanded
}
