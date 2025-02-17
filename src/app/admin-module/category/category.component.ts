import { Component, OnInit } from "@angular/core";
import { Images } from "../../images/images.module";

@Component({
  selector: "app-category",
  templateUrl: "./category.component.html",
  styleUrls: ["./category.component.scss"],
})
export class CategoryComponent implements OnInit {
  selectedCategory: object;
  updatedCategoryDetails: object;
  public images = Images;

  constructor() {}

  ngOnInit() {}
  getSelectedCategory(data: any): void {
    if (data) this.selectedCategory = data;
    else this.selectedCategory = {};
  }

  updateCategoryDetails(result): void {
    console.log(result);
    this.updatedCategoryDetails = {
      id: result.flag,
      result: result.data,
    };
  }
}
