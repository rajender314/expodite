import { NativeDateAdapter } from '@angular/material/core';
import * as moment from 'moment';
import { Injectable } from "@angular/core";

@Injectable()
export class MyDateAdapter extends NativeDateAdapter {
    format(date: Date, displayFormat: Object): string {
        
         return moment(date).format('MMM Do, YYYY');
        // return moment(date).format('MM/YYYY');
        /*if (displayFormat == "input") {
            let day = date.getDate();
            let month = date.getMonth() + 1;
            let year = date.getFullYear();
            return this._to2digit(day) + '/' + this._to2digit(month) + '/' + year;
        } else {
            return date.toDateString();
        }*/
    }

    /*private _to2digit(n: number) {
        return ('00' + n).slice(-2);
    }*/
}
