import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  selectedCategory: object;
  updatedCategoryDetails: object;
  constructor() { }

  ngOnInit() {

  }
  getSelectedCategory(data: any): void {
    if (data) 
    this.selectedCategory = data;
    else 
    this.selectedCategory = {};
  }

  updateCategoryDetails(result): void {
    this.updatedCategoryDetails = {
      id: result.flag,
      result: result.data
    }
  }

}
