import { Component, Input, OnInit } from "@angular/core";
import { SafeHtml, DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: "app-open-package-grid",
  templateUrl: "./open-package-grid.component.html",
  styleUrls: ["./open-package-grid.component.scss"],
})
export class OpenPackageGridComponent implements OnInit {
  @Input() packageTable;

  constructor(private sanitizer: DomSanitizer) {}

  // public test = "<span style="color: red;">123</span>"
  ngOnInit(): void {}

  getSanitizedHtml(content: any): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(content);
  }
}
