import { Component, TemplateRef } from "@angular/core";
import { ToastService } from "./toaster.service";


@Component({
  selector: 'app-toasts',
  templateUrl: './toasts-container.component.html',
  host: {
    class: 'toast-container position-fixed top-0 end-0 p-3',
    style: 'z-index: 1200; width: 350px; max-height: 90vh; overflow-y: auto;'
  },
})


export class ToastsContainer {
  constructor(public toastService: ToastService) {}

  isTemplate(toast: any) {
    return toast.textOrTpl instanceof TemplateRef;
  }
}
