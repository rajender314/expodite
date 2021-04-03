import { Component, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Project, Objective, Campaign } from '../project';

import { AddObjectiveComponent } from '../add-objective/add-objective.component';

@Component({
  selector: 'app-objectives',
  templateUrl: './objectives.component.html',
  styleUrls: ['./objectives.component.scss']
})
export class ObjectivesComponent implements OnInit {
  @Input() project: Project;

  selectedObjective: Objective;
  selectedCampaign: Campaign;

  list: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
  }

  fetchObjectives() {

  }

  selelctObjective(objective) {

  }

  selectCampaign(campaign) {

  }

  addObjective() {
    this.dialog.open(AddObjectiveComponent, {
      width: '600px',
      height: '480px'
    });
  }

  addCampaign() {
    
  }

}
