import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormArray, FormBuilder } from '@angular/forms';
import * as _ from "lodash";
import { language } from '../../../language/language.module';
import { CustomsAddressDetailsComponent } from '../customs-address-details/customs-address-details.component';

@Component({
  selector: 'customs-address-permissions',
  templateUrl: './customs-address-permissions.component.html',
  styleUrls: ['./customs-address-permissions.component.scss']
})
export class CustomsAddressPermissionsComponent implements OnInit {

  @Input() permission;
  private language = language;

  constructor(private parent: CustomsAddressDetailsComponent) { }

  ngOnInit() {
  }

  setDirty(): void{
    this.parent.setDirty();
  }

  check(item, option): void {
    this.setDirty();
    if (item.type === 'check') {
      item.permission = _.indexOf(item.permission, 1) > -1 ? [] : [1]
      item.checked = _.indexOf(item.permission, 1) > -1 ? true : false;
    }
    else if (item.type === 'select' || item.type === 'radio') {
      item.permission = [option];
      item.selectedValue = option;
    }
    if (item.children) {
      this.checkChild(item.children, item)
    }
  }

  checkChild(data, parent): void {
    data.map(child => {
      if (parent.type === 'check') {
        child.checked = parent.checked;
        child.selectedValue = parent.checked === true ? 1 : 3;
        child.permission = parent.checked === true ? [1] : [];
      } else if (parent.type === 'select' || parent.type === 'radio') {
        child.checked = parent.selectedValue === 1 ? true : false;
        child.selectedValue = parent.selectedValue;
        child.permission = parent.selectedValue === 3 ? [3] : [1];
      }
      if (data.children) {
        this.checkChild(child.children, child);
      }
    })
  }

}
