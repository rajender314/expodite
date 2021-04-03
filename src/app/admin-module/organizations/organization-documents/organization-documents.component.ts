import { Component, Input, OnInit, SimpleChange,ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { OrganizationsService } from '../../../services/organizations.service';
import { SnakbarService } from '../../../services/snakbar.service';
import { language } from '../../../language/language.module';
import * as _ from 'lodash';

@Component({
  selector: 'app-organization-documents',
  templateUrl: './organization-documents.component.html',
  styleUrls: ['./organization-documents.component.scss'],
  providers: [OrganizationsService, SnakbarService],
  encapsulation: ViewEncapsulation.None
})
export class OrganizationDocumentsComponent implements OnInit {

    @Input() Organization;
    private language = language;
    checkedInput: boolean;
    private documentTypes:Array<any> = [];
    private selectAll = false;
    public fetchingData: boolean = true;
    public emptyData: boolean = true;
    private activeState: boolean = false;
    public cloneDocumentsTypes = [];
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
		// this.getDocumentTypesData();
		this.checkedInput = false;
    this.activeState = false;
    // console.log(this.selectedTypes)

    // this.selectedTypes.map(obj => {
    //   if(obj.selected) {
    //     obj.selected = false;
    //   } else {
    //     obj.selected = true;
    //   }
     
    // }) 
    this.selectAll = false;
    // this.documentTypes.map(obj => {
    //   if(obj.selected) {
    //     obj.selected = false;
    //   } else {
    //     obj.selected = true;
    //   }
     
    // }) 
    // console.log(this.documentTypes)
    // console.log(this.cloneDocumentsTypes )
    // this.documentTypes = this.cloneDocumentsTypes;

    for(let i = 0; i < this.documentTypes.length; i++) {
      this.documentTypes[i].selected = this.cloneDocumentsTypes[i].selected;
    }

    this.checkSelectAll();

    this.selectedTypes = [];
  }
  
  getIndex(index) {
    return this.cloneDocumentsTypes[index].selected;
  }
	selectState(){
		this.activeState = true;
	}
	saveDocumentTypes(): void{
    console.log( this.selectedTypes)
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

          for(let i = 0; i < this.cloneDocumentsTypes.length; i++) {

            this.selectedTypes.map(obj => {
              if(obj.id == this.cloneDocumentsTypes[i].id) {
                this.cloneDocumentsTypes[i].selected = obj.selected;
              }
              

            })

          }
        }
        this.activeState = false;
        this.selectedTypes = [];
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
    // console.log(this.selectAll)
  }
  public selectedTypes = [];
  documentTypeChange(data: any): void{
    // console.log(data)
    data.selected = !data.selected;
   
      // this.selectedTypes.push(data)
    
    this.checkedInput = true;
    this.activeState = true;
    this.checkSelectAll();
  }
  documentTypeAllChange(data: any): void{
    this.selectAll = !data;
    this.documentTypes.map(function(value){
      value.selected = !data;
     

    });
    this.selectedTypes = this.documentTypes;
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
           this.cloneDocumentsTypes =  _.cloneDeep(this.documentTypes);
            // console.log(this.documentTypes)
            this.checkSelectAll();
           
          }
      })
      .catch(error => console.log(error))
    }else{
      this.emptyData = true;
    }
  }
  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    // console.log(12333)
    if(this.Organization){
		  this.getDocumentTypesData();
    }
    this.documentTypes.map(function(value){
      value.selected = false;
    });
  }

}
