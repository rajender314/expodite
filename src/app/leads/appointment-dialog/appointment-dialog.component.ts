import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LeadsService } from '../leads.service';
import { SnakbarService } from '../../services/snakbar.service';
import * as _ from 'lodash';
import * as moment from 'moment';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatDatepickerModule } from '@angular/material/datepicker';
@Component({
  selector: 'app-appointment-dialog',
  templateUrl: './appointment-dialog.component.html',
  styleUrls: ['./appointment-dialog.component.css']
})
export class AppointmentDialogComponent implements OnInit {
  formGroup: FormGroup;
  minDate = new Date();
  isEditScreen = false;
  assigneeList = [];
 public submitted=false
public time2:any
  constructor(private dialogRef: MatDialogRef<AppointmentDialogComponent>,
    private service: LeadsService, @Inject(MAT_DIALOG_DATA) private data: any,
    private snackbar: SnakbarService) { }

  ngOnInit(): void {
    this.formGroup = new FormBuilder().group({
      title: new FormControl(null, [Validators.required,this.noWhitespaceValidator]),
      details: new FormControl(null, [Validators.required,this.noWhitespaceValidator]),
      assignee: new FormControl(null, [Validators.required]),
      time: new FormControl(null, [Validators.required]),
      entity_type: 1,
      entity_id: this.data.leadId
    });
    if (this.data['id']) {
      this.isEditScreen = true;
      if (this.data.time) {
        console.log(this.data)
        const date = this.data['time'].split(' ');
        const time = date[3].split(':')
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        console.log(date);
        let s= date[1];
        var k = s.slice(0, -2);
        var yer = date[2]
        var cyer = yer.slice(0, -1);
        if(date[4] == 'PM'){
          time[0] = parseInt(time[0]) + 12;
        }
        const newDate = new Date(cyer, months.indexOf(date[0]), k, time[0], time[1]);
      
   this.data.time = newDate;
      }
      this.data['assignee'] = parseInt(this.data['assignee_id']);
      this.formGroup.patchValue(this.data)
      console.log(this.data)
    }
    this.getAssigneeList();
  }
  openCalendar(picker: MatDatepicker<Date>) {
    picker.open();
  }
  save() {
    
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      const form = _.cloneDeep(this.formGroup.value);
      if(form.time){
        this.submitted=true
       // console.log(form.time._d.toString())
        const date2 = form.time._d?.toString().split(' ');
        if(date2){
          console.log(date2)
          // form.time = moment(form.time).format('YYYY-MM-DD HH:MM:SS');
           const time = date2[4].split(':')
           const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
           console.log(date2);
           let s1= date2[2];
          
           var k1 = s1.slice(0, -2);
          
           var yer1 = date2[3]
           var cyer1 = yer1.slice(0, -1);
           let x = date2[1]
           const newDate1 = new Date(yer1, months.indexOf(date2[1]), s1, time[0], time[1]);
          console.log(newDate1)
          this.time2 = +s1+' '+x+' '+yer1+' '+time[0]+':'+time[1]
        }
      
       
       //let time2 = moment(newDate1).format('YYYY-MM-DD HH:MM');
        //this.data.time = newDate1;
        console.log(this.time2)
        form.time =this.time2
      }
      const body = {
        id: this.data['id'] ? this.data['id'] : 0,
        ...form
      }
      console.log(body)
      this.service.createAppointment(body).then(res => {
        if (res.result.success) {
          let message = body.id == 0 ? 'Appointment Added Successfully.' : 'Appointment updated successfully.';
          this.snackbar.showSnackBar({ msg: message, status: 'success' });
          this.dialogRef.close(true);
        } else {
          let serverError = res.result.data.message ? res.result.data.message : 'Something went wrong';
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

  public noWhitespaceValidator(control: FormControl) {
    let isWhitespace = (control.value || '').trim().length === 0;
    let isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true }
  }
}
