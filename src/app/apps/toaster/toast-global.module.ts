import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ToastsContainer } from './toasts-container.component';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [CommonModule, NgbModule],
  declarations: [ ToastsContainer],

  exports: [

    ToastsContainer
  ]
})
export class NgbdToastGlobalModule {}
