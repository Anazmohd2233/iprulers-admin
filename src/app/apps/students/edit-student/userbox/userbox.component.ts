import { Component, Input, OnInit, TemplateRef } from "@angular/core";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { StudentService } from "src/app/core/service/student/student.service";
import { ToastUtilService } from "src/app/apps/toaster/toasterUtilService";
// types

@Component({
  selector: "app-profile-userbox",
  templateUrl: "./userbox.component.html",
  styleUrls: ["./userbox.component.scss"],
})
export class UserboxComponent implements OnInit {
  @Input() student: any | null = null;
  @Input() studentID: any | null = null;
  modalRef!: NgbModalRef;

  changePasswordForm!: FormGroup;
  get form1() {
    return this.changePasswordForm.controls;
  }

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private studentService: StudentService,
    private toaster: ToastUtilService

  ) {}

  ngOnInit(): void {
    this.changePasswordForm = this.fb.group({
      pwd: ["", Validators.required],
      confirm: ["", Validators.required],
    });
  }

  open(content: TemplateRef<NgbModal>): void {
    this.modalRef = this.modalService.open(content, { scrollable: true });
  }

  onChangePassword() {
    if (this.changePasswordForm.valid) {
      const formData = new FormData();

      const { pwd, confirm } = this.changePasswordForm.value;

      formData.append("confirm", confirm);
      formData.append("pwd", pwd);

      this.studentService.updateStudent(formData, this.studentID).subscribe({
        next: (response) => {
          if (response.success) {
            this.toaster.success("Success", response.message);

            this.changePasswordForm.reset();
            this.modalRef.close(); // ✅ Close the modal here
          } else {
            this.toaster.warn("Alert", response.message);

            console.error("Failed to update password:", response.message);
          }
        },
        error: (error) => {
          this.toaster.error("Failed", "Something went wrong.");

          console.error("Error updating password:", error);
        },
        complete: () => {
          console.log("password updated successfully!...");
        },
      });
    } else {
      console.log("password form not validated");
    }
  }
}
