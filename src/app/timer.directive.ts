import { Directive, HostListener } from '@angular/core';
import { Router, Route } from '@angular/router';

declare var App: any;

@Directive({
  selector: '[appTimer]'
})

export class TimerDirective {

  constructor(
     
    private router: Router
  ) { }

  timer: any;

  /*@HostListener('document:click', ['$event'])
  documentClick(event: MouseEvent) {*/

  @HostListener('document:click', ['$event'])
  @HostListener('document:mouseover', ['$event'])
  @HostListener('document:keypress', ['$event'])
  @HostListener('document:scroll', ['$event'])
  onEvent(event) {

      if(this.timer){
       
          clearTimeout(this.timer);
      }
      
      this.timer = setTimeout(() => {
       
          window.location.href = App.base_url + 'do-logout';
      }, 90 * 100000);
    
  }


}
