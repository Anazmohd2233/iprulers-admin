import { Component, Input, OnInit, TemplateRef } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { BreadcrumbItem } from "src/app/shared/page-title/page-title.model";

// data
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { FormArray, FormBuilder, Validators } from "@angular/forms";
import { DomSanitizer } from "@angular/platform-browser";
import { Router } from "@angular/router";

import { StudentService } from "src/app/core/service/student/student.service";
import { MaterialService } from "src/app/core/service/material/material.service";
import { ToastUtilService } from "src/app/apps/toaster/toasterUtilService";

@Component({
  selector: "app-student-materials",
  templateUrl: "./student-materials.component.html",
  styleUrls: ["./student-materials.component.scss"],
})
export class StudentMaterialsComponent implements OnInit {
  @Input() studentID: any | null = null;
  assignMaterialForm!: FormGroup;
  modalRef!: NgbModalRef;
  selectedMaterial: any;
  materialList: any[] = [];
  studentMaterial: any[] = [];
  isSubmitting: boolean = false;


  page: number = 1;

  ribbons = [
    {
      name: "CCIE EI v1.1 DOO-1 Section 2",
      img: "assets/images/sample.jpg",
      ribbon: { name: "Expired", color: "danger", direction: "left" },
    },
    {
      name: "CCIE EI v1.1 DOO-1 Section 3",
      img: "assets/images/sample2.jpg",
      ribbon: { name: "New", color: "success", direction: "right" },
    },
  ];

  constructor(
    private http: HttpClient,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private studentService: StudentService,
    private materialService: MaterialService,
    private toaster: ToastUtilService
  ) {}

  ngOnInit(): void {
    this.assignMaterialForm = this.fb.group({
      material: ["", Validators.required],
    });

    if (this.studentID) {
      this.fetchStudentDetails(this.studentID);
      this.getMaterials();
    }
  }

  assignMaterial(): void {
    if (this.assignMaterialForm.valid) {
      this.isSubmitting = true;

      const formData = new FormData();

      // Add scalar values
      formData.append("material", this.assignMaterialForm.value.material);
      formData.append("id", this.studentID);

      this.studentService.assignCourseOrMaterials(formData).subscribe({
        next: (response) => {
          console.log("response of assign materials - ", response);
          if (response.success) {
            this.isSubmitting = false;

            this.fetchStudentDetails(this.studentID);

            this.toaster.success("Success", response.message);
            this.assignMaterialForm.reset();
            this.modalRef.close();
            this.fetchStudentDetails(this.studentID);
          } else {
            this.isSubmitting = false;

            this.toaster.warn("Alert", response.message);

            console.error("Failed to assign materials:", response.message);
          }
        },
        error: (error) => {
          this.isSubmitting = false;

          this.toaster.error("Failed", "Something went wrong.");

          console.error("Error assign materials:", error);
        },

      });
    } else {
      console.log("material adding form not validated");
    }
  }

  getMaterials(): void {
    this.materialService.getMaterial(this.page).subscribe({
      next: (response) => {
        console.log("response of material list - ", response);
        if (response.success) {
          this.materialList = response.data.material;
          console.log("Materials:", this.materialList);
        } else {
          console.error("Failed to fetch data:", response.message);
        }
      },
      error: (error) => {
        console.error("Error fetching admin list:", error);
      },
      complete: () => {
        // Optionally handle the completion logic here
        console.log("Admin list fetch completed.");
      },
    });
  }

  fetchStudentDetails(id: any): void {
    this.studentService.getStudentById(id).subscribe({
      next: (response) => {
        if (response.success) {
          this.studentMaterial = response.data.materials;
          console.log("studentList", this.studentMaterial);
        } else {
          console.error("Failed to fetch data:", response.message);
        }
      },
      error: (error) => {
        console.error("Error fetching admin list:", error);
      },
      complete: () => {
        // Optionally handle the completion logic here
        console.log("Admin list fetch completed.");
      },
    });
  }

  openAlertModal(
    content: TemplateRef<NgbModal>,
    variant: string,
    material: any
  ): void {
    this.selectedMaterial = material;
    this.modalRef = this.modalService.open(content, {
      size: "sm",
      modalDialogClass: "modal-filled bg-" + variant,
    });
  }

  deleteMaterial(): void {
    if (this.selectedMaterial) {
      this.isSubmitting = true;

      const payload = {
        material_id: this.selectedMaterial.id,
        student_id: this.studentID,
      };

      this.studentService.deleteMaterial(payload).subscribe({
        next: (response) => {
          if (response.success) {
            this.isSubmitting = false;

            this.toaster.success("Deleted", response.message);
            this.fetchStudentDetails(this.studentID);

            this.modalRef.close();
          } else {
            this.isSubmitting = false;

            this.toaster.warn("Alert", response.message);
          }
        },
        error: () => {this.toaster.error("Error", "Something went wrong.");
          this.isSubmitting = false;

        },
      });
    } else {
      this.toaster.warn("Alert", "Enexpected error occured , contact admin");
    }
  }
}
