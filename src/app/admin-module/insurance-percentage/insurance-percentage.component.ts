import { Component, OnInit } from "@angular/core";
import { Images } from "../../images/images.module";

@Component({
  selector: "app-insurance-percentage",
  templateUrl: "./insurance-percentage.component.html",
  styleUrls: ["./insurance-percentage.component.css"],
})
export class InsurancePercentageComponent implements OnInit {
  public images = Images;

  constructor() {}

  ngOnInit(): void {}
}
