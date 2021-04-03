import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'contactImageName'
})
export class ContactImageNamePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    let words = value.trim().split(' ');
    if(words.length >= 2) return words[0].charAt(0) + words[1].charAt(0);
    else return words[0].charAt(0);
  }

}
