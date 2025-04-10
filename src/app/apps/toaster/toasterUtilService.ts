// toast-util.service.ts
import { Injectable } from '@angular/core';
import { ToastService } from './toaster.service';

@Injectable({ providedIn: 'root' })
export class ToastUtilService {
  constructor(private toastService: ToastService) {}

  success(header: string, body: string) {
    this.toastService.show({
      header,
      body,
      classname: 'bg-success text-light',
      delay: 5000,
    });
  }

  error(header: string, body: string) {
    this.toastService.show({
      header,
      body,
      classname: 'bg-danger text-light',
      delay: 5000,
    });
  }

  info(header: string, body: string) {
    this.toastService.show({
      header,
      body,
      classname: 'bg-info text-dark',
      delay: 5000,
    });
  }

  warn(header: string, body: string) {
    this.toastService.show({
      header,
      body,
      classname: 'bg-warning text-dark',
      delay: 5000,
    });
  }
}
