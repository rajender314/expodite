import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
declare var App: any;

@Component({
  selector: "app-pallet-table",
  templateUrl: "./pallet-table.component.html",
  styleUrls: ["./pallet-table.component.scss"],
})
export class PalletTableComponent implements OnInit {
  @Input() package: any = {};
  @Input() order_Permissions: any;

  @Input() productIndex: number;
  @Output() editPackage = new EventEmitter();
  public EditIcon: string =
    App.public_url + "signatures/assets/images/edit_1.png";
  constructor() {}

  ngOnInit(): void {}

  packageEdit(id) {
    this.editPackage.emit({ id: id });
  }
}
