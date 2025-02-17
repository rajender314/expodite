import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-objective-detail',
  templateUrl: './objective-detail.component.html',
  styleUrls: ['./objective-detail.component.scss']
})
export class ObjectiveDetailComponent implements OnInit {
  @Input() objective: any;

  constructor() { }

  ngOnInit() {
  }

}
