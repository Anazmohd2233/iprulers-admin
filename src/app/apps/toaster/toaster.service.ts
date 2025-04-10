import { Injectable, TemplateRef } from "@angular/core";

@Injectable({ providedIn: "root" })
export class ToastService {
  toasts: any[] = [];

  // show(textOrTpl: string | TemplateRef<any>, options: any = {}) {
  //   this.toasts.push({ textOrTpl, ...options });
  // }

  show(toast: { header?: string; body?: string | TemplateRef<any>; classname?: string; delay?: number }) {
    this.toasts.push(toast);
  }
  

  remove(toast: any) {
    this.toasts = this.toasts.filter((t) => t !== toast);
  }

  clear() {
    this.toasts.splice(0, this.toasts.length);
  }
}
