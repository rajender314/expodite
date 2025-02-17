import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LeadsService } from '../leads.service';
import { SnakbarService } from '../../services/snakbar.service';
import * as _ from 'lodash';
import * as moment from 'moment';
import { Images } from '../../images/images.module';
import { AngularEditorConfig } from '@kolkov/angular-editor';
declare var App: any;


@Component({
  selector: 'app-quote-email',
  templateUrl: './quote-email.component.html',
  styleUrls: ['./quote-email.component.css']
})
export class QuoteEmailComponent implements OnInit {
  formGroup: FormGroup;
  name = 'Angular 6';
  public names:any
  // messageEmail ='';
  message = '';
  assigneeList = [];
  public ccArray:[];
  dataobj:any;
  dataobjlgth:any;
  public images = Images;
  public submitForm =false
  public datex:any;
  public sub:any;
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '12rem',
    
    minHeight: '5rem',
    placeholder: 'Enter Message here...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    toolbarHiddenButtons: [
     
      ],
       fonts: [
        {class: 'arial', name: 'Arial'},
        
      ],
    customClasses: [
      {
        name: "quote",
        class: "quote",
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: "titleText",
        class: "titleText",
        tag: "h1",
      },
    ]
  };
  constructor(private dialogRef: MatDialogRef<QuoteEmailComponent>,
    private service: LeadsService, @Inject(MAT_DIALOG_DATA) public data: any,
    private snackbar: SnakbarService) { }
  ngOnInit(): void {
    let date =new Date()
this.datex= moment(date).format('MMM Do YYYY');
//let sub = "QUOTE CONFORMATION" + ' '+ this.datex 
    console.log(this.datex)
    let user =this.data?this.data.user:'';
    let prod = this.data?this.data.products:'';
    console.log(prod,this.data,this.data.user)
   let data =[]
    prod.forEach((ele:any)=>{
      console.log(ele)
      

      data.push({ products:ele.products_name,
      })
      this.names = data.map(function(item) {
        return item['products'];
       
      });
      console.log(this.names)
      
    this.dataobj = Object.assign(data );
    this.dataobjlgth =this.dataobj.length
// console.log(dataobj)
      // Reqparams.quantity=,
    })
    console.log(this.dataobj)
    if(this.dataobjlgth == 1){
      var messageEmail = '<p>Dear'+'  '+user+','+'</p>'+'  '+' <p>As discussed regarding your requirement for  '+'  '+this.dataobjlgth+'  '+'Product'+ ' '+this.names+'  for Suggested Quantity for the product we have come up with the best Quote for you.</p>'+'<p>Request you to review the attached Quote and let us know if this works for you.We are always open for your feedbacks and discussions if any regarding this quote to fulfill your requirement.Please do let us know if you need any further clarifications with this.</p>'+'<p>Regards<p>'+'<p>Expodite</p>';
      this.sub = "Quote For" +' '+this.names[0] +' '+"on"+' ' +this.datex 
    }else{
      var messageEmail = '<p>Dear'+'  '+user+','+'</p>'+'  '+' <p>As discussed regarding your requirement for  '+'  '+this.dataobjlgth+'  '+'Products,'+ ' '+this.names+'  for Suggested Quantity for each product, we have come up with the best Quote for you.</p>'+'<p>Request you to review the attached Quote and let us know if this works for you.We are always open for your feedbacks and discussions if any regarding this quote to fulfill your requirement.Please do let us know if you need any further clarifications with this.</p>'+'<p>Regards<p>'+'<p>Expodite</p>';
      this.sub = "Quote For" +' '+this.names[0] + ' '+"and Other Products"+' '+"on"+' '+ this.datex 

    }
     

    let datem =this.data?this.data.email:'';
    //console.log(this.data,this.data.email,thisdata['email'],datem)
    this.formGroup = new FormBuilder().group({
      to_email: new FormControl(datem, [Validators.required,Validators.pattern(
        /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/
      )]),
      cc_email: new FormControl(null),
      message: new FormControl(messageEmail, [Validators.required]),
      subject: new FormControl(this.sub, [Validators.required]),
     
     
    });
  //  this.getAssigneeList()
  }
  

  urApi = App.api_url
  public ur =this.urApi
  commaSepEmail = (control: AbstractControl): { [key: string]: any } | null => {
   
    const emails = control.value?.cc_email.split(',');
    //console.log(emails)
    const forbidden = emails.some(cc_email => Validators.email(new FormControl(cc_email)));
    //console.log(forbidden);
    return forbidden ? { 'cc_email': { value: control.value.cc_email
    
    } } : null;
  };
  save(form) {

    let params =form.value;
    this.submitForm = true;
    if(params.cc_email){
      this.ccArray = params.cc_email?.split(',')
    }
     
     console.log( this.ccArray,params.cc_email)
     params.cc_email =this.ccArray
     params.attachment = this.data.pdffile
     params.id = this.data.id
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
     let parms= []
      this.service.sentQuotesEmail(params).then(res => {
        if (res.result.success) {
         let message = res.result.message?res.result.message:'Email Sent successfully' ;
          this.snackbar.showSnackBar({ msg: message, status: 'success' });
          this.dialogRef.close(true);
        } else {
          let serverError = res.result.message ? res.result.message : 'Something went wrong';
         this.snackbar.showSnackBar({ msg: serverError, status: 'success' });
        }
      });
    }
  }


  cancel() {
    this.dialogRef.close();
  }
  getAssigneeList() {
    this.service.getAssigneeList(this.data.leadId).then(res => {
      if (res.result.success) {
        this.assigneeList = res.result.data;
      }
    });
  }
  
}
