import { Directive, ElementRef, HostListener } from "@angular/core";

@Directive({
  selector: "[appInputNumber]",
})
export class InputNumberDirective {
  private regex: RegExp = /^\d+(\.\d{0,3})?$/; // Allowed pattern
  private lastValidValue: string = "";

  constructor(private el: ElementRef) {}

  @HostListener("input", ["$event"])
  onInput(event: Event): void {
    const input = this.el.nativeElement as HTMLInputElement;
    if (this.regex.test(input.value)) {
      this.lastValidValue = input.value; // Save valid value
    } else {
      input.value = this.lastValidValue; // Revert to last valid value
    }
  }

  @HostListener("paste", ["$event"])
  blockPaste(event: ClipboardEvent): void {
    event.preventDefault(); // Block paste
  }
}

//   private regex: RegExp = new RegExp(/^[0-9]+\.?[0-9]*$/);
//   // Allow key codes for special events. Reflect :
//   // Backspace, tab, end, home
//   private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', '-'];

//   constructor(private el: ElementRef) {
//   }

//   @HostListener('keydown', ['$event'])

//   onKeyDown(event: KeyboardEvent) {
//     // Allow Backspace, tab, end, and home keys
//     if (this.specialKeys.indexOf(event.key) !== -1) {
//       return;
//     }
//     let current: string = this.el.nativeElement.value;
//     let next: string = current.concat(event.key);
//     if (next && !String(next).match(this.regex)) {
//       event.preventDefault();
//     }
//   }
// }
