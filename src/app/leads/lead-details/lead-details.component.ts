import { Component, OnInit, Input } from '@angular/core';
import { Images } from '../../images/images.module';
import { LeadsService } from '../leads.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AppointmentDialogComponent } from '../appointment-dialog/appointment-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import * as $ from 'jquery';

@Component({
  selector: 'app-lead-details',
  templateUrl: './lead-details.component.html',
  styleUrls: ['./lead-details.component.scss']
})
export class LeadDetailsComponent implements OnInit {
  public images = Images;
  public overViewData: any;
  public showQuote =false;
  activeTab = 'details';
  leadId: any;
  mes:any
  showqte:any;
  disbtnQc:any;
 public someData ="myFirst"
 public contactLength:any
  // @Input() myFirst: string;
  constructor(private service: LeadsService, private route: Router,
    private activateRoute: ActivatedRoute, private dialog: MatDialog, private router: Router,) { }

  ngOnInit(): void {
    this.activateRoute.params.subscribe((res: any) => {
      if (res) {
        this.leadId = res.id;
        this.getDetailView(res.id);
      }
    })
  }

  getDetailView(param): void {
    this.service
      .getDetailView(param)
      .then(response => {
        if (response.result.success) {
          this.overViewData = response.result.data.data[0];
          this.contactLength  =this.overViewData?.contacts?.length;
          if(this.overViewData?.contacts?.length){
            this.contactLength = true
          }else{
            this.contactLength = false
          }
          this.service.postDetailsData(this.overViewData);
          this.catchOverviewData();
        }
        else;
      })
      .catch(error => console.log(error))
  }

  catchOverviewData() {
    this.service.getDetailsData().subscribe(res => {
      if (res) {
        this.overViewData = res;
      }
    })
  }
recivemes($event){
  
  this.mes = $event
 this.showqte = this.mes.age;
 this.disbtnQc =this.mes.name
   this.getDetailView(this.leadId);

  console.log(this.mes.name,this.mes.age)
}
  createAppointment() {
    let dialogRef = this.dialog.open(AppointmentDialogComponent, {
      panelClass: 'alert-dialog',
      width: '500px',
      data: {
        leadId: this.leadId
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.service.postDetailsData({ 'reloadAppointment': true });
        this.getDetailView(this.leadId);
      }
    });
  }

  scrollToView(id, tab) {
    this.activeTab = tab;
    const elem = $('#' + id) as any;
    console.log(elem.offset().top,elem)
    if (elem && elem.length) {
      elem[0].scrollIntoView({ behavior: 'smooth' })
      // $('.lead-detail-view').animate({
      //   scrollTop: elem.offsetTop - elem.offset().top
      // }, 1000);
    }

  }
  scrollTimeout: any;
  onScroll($event,id) {
    //console.log($event)
    
   const elem = '#appointments-tab';
   const elem2 = '#quotes-tab';
    clearTimeout(this.scrollTimeout);
    this.scrollTimeout = setTimeout(() => {
      const container = $(".lead-detail-view");
      const elemTop = $(elem).offset().top - container.offset().top;
      const elemBottom = elemTop + $(elem).height();
      const elemTop2 = $(elem2).offset().top - container.offset().top;
      const elemBottom2 = elemTop2 + $(elem2).height();

      const isPart = ((elemTop < 0 && elemBottom > 0) 
      || (elemTop > 0 && elemTop <= container.height()));
      const isQuotePart = ((elemTop2 < 0 && elemBottom2 > 0) 
      || (elemTop2 > 0 && elemTop2 <= container.height()));
       this.activeTab = isQuotePart ? 'quotes' :(isPart ? 'appointments' : 'details');
      console.log(isPart)
    }, 500)
  }

  createQuote(){
    this.showQuote =true
    this.showqte =true
    
   // this.route.navigate(['/messages']);
  }
}
