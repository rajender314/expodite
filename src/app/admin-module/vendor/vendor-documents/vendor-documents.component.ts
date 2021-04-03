import { Component, Input, OnInit, SimpleChange,ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { OrganizationsService } from '../../../services/organizations.service';
import { SnakbarService } from '../../../services/snakbar.service';
import { language } from '../../../language/language.module';
@Component({
  selector: 'app-vendor-documents',
  templateUrl: './vendor-documents.component.html',
  styleUrls: ['./vendor-documents.component.scss']
})

export class VendorDocumentsComponent implements OnInit {

  @Input() Organization;
  private language = language;
  checkedInput: boolean;
  private documentTypes:Array<any> = [];
  private selectAll = false;
  public fetchingData: boolean = true;
  public emptyData: boolean = true;
  private activeState: boolean = false;
  constructor(
    private organizationsService: OrganizationsService,
    private formBuilder: FormBuilder,
    private snackbar: SnakbarService
  ) { }

ngOnInit() {
  this.activeState = false;
  this.documentTypes.map(function(value){
  if(value.selected){
    this.selectAll = true;
  }
  });
}
cancelDocumentTypes(): void{
  this.getDocumentTypesData();
  this.checkedInput = false;
  this.activeState = false;
}
selectState(){
  this.activeState = true;
}
saveDocumentTypes(): void{
  let toast: object;
  let selectedIds = [];
  this.documentTypes.map(function(value,index){
  if(value.selected){
    selectedIds.push(value.id);
  }
});
  this.organizationsService
  .saveDocumentTypes({organization_id: this.Organization.id, documentArr: selectedIds})
  .then(response => {
      if(response.result.success){
        toast = { msg: "Documents Access saved successfully.", status: "success" };
        this.snackbar.showSnackBar(toast);
      }
      this.activeState = false;
  })
  .catch(error => console.log(error))
}
checkSelectAll(): void{
  let selectAll = [];
  selectAll = this.documentTypes.filter(function(value){
    if(value.selected){
      return true;
    }
    return false;
  });
  if(selectAll.length==this.documentTypes.length){
    this.selectAll = true;
  }else{
    this.selectAll = false;
  }
}
documentTypeChange(data: any): void{
  data.selected = !data.selected;
  this.checkedInput = true;
  this.activeState = true;
  this.checkSelectAll();
}
documentTypeAllChange(data: any): void{
  this.selectAll = !data;
  this.documentTypes.map(function(value){
    value.selected = !data;
  });
  
  this.checkedInput = true;
  this.activeState = true;
}

getDocumentTypesData(): void{
  this.activeState = false;
  if(this.Organization.id){
    this.fetchingData = true;
    this.activeState = false;
    this.organizationsService
    .getDocumentsList({org_id: this.Organization.id})
    .then(response => {
        this.emptyData = false;
        this.fetchingData = false;
        if(response.result.success){
          this.documentTypes = response.result.data.SelectedData;
          this.checkSelectAll();
        }
    })
    .catch(error => console.log(error))
  }else{
    this.emptyData = true;
  }
}
ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
  if(this.Organization){
    this.getDocumentTypesData();
  }
}

}
