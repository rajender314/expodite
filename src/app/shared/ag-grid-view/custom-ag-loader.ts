import { Component } from "@angular/core";
import {
  ILoadingCellRendererAngularComp,
  ILoadingOverlayAngularComp,
} from "ag-grid-angular";
import { ILoadingCellRendererParams } from "ag-grid-community";

@Component({
  template: `
    <div class="container-ui new-center-empty-ui">
      <mat-spinner class="medium-spinner"></mat-spinner>
    </div>
  `,
})
export class CustomLoadingCellRenderer implements ILoadingOverlayAngularComp {
  public params!: ILoadingCellRendererParams & { loadingMessage: string };

  agInit(
    params: ILoadingCellRendererParams & { loadingMessage: string }
  ): void {
    this.params = params;
  }
}
