import { EpiCurrencyPipe } from './../pipes/epi-currency.pipe';

import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MyFilterPipe } from '../general-module/reports/reports-dashboard/reports-dashboard.component';
import { LetterPipe } from '../custom-pipes/letter.pipe';
import { PowerConversionPipe } from '../pipes/power-conversion.pipe';
import { ContactImageNamePipe } from '../custom-pipes/contact-image-name.pipe';





@NgModule({
  declarations: [
    // EpiCurrencyPipe,
    // MyFilterPipe,
    // LetterPipe,
    
    // PowerConversionPipe, LetterPipe, ContactImageNamePipe,
  ],
  imports: [
    
  ],
  providers: [
    // DatePipe
   
   
  ],
  exports: [
    // EpiCurrencyPipe,
    // MyFilterPipe,
    // LetterPipe,
    // // DatePipe,
    // PowerConversionPipe, LetterPipe, ContactImageNamePipe
  ]
})
export class PipesModule { }
