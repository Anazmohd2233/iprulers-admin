import { Component, OnInit, TemplateRef } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { BreadcrumbItem } from "src/app/shared/page-title/page-title.model";

// data
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { FormArray, FormBuilder, Validators } from "@angular/forms";
import { DomSanitizer } from "@angular/platform-browser";
import { Router } from "@angular/router";
import { CategoryService } from "src/app/core/service/category/category.service";
import { Course } from "../../models/course";
import { ToastUtilService } from "../../toaster/toasterUtilService";

@Component({
  selector: "app-categories",
  templateUrl: "./categories.component.html",
  styleUrls: ["./categories.component.scss"],
})
export class CategoriesComponent implements OnInit {
  addCategoryForm!: FormGroup;
  category: any[] = [];
  page: number = 1;
  files: File | null = null;
  docs: File | null = null;
  modalRef!: NgbModalRef;
  selectedCategory: any = null; // null = add mode
  isSubmitting: boolean = false;

  constructor(
    private http: HttpClient,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private router: Router,
    private categoryService: CategoryService,
    private toaster: ToastUtilService
  ) {}

  ngOnInit(): void {
    this.getCategory();
    this.addCategoryForm = this.fb.group({
      category_title: ["", Validators.required],
    });
  }
  get form1() {
    return this.addCategoryForm.controls;
  }

  /**
   * fetches order list
   */
  private getCategory(): void {
    this.categoryService.getCategory(this.page).subscribe({
      next: (response) => {
        if (response.success) {
          this.category = response.data.category;

          console.log("category loaded:", this.category);
        } else {
          console.error("Failed to load category:", response.message);
        }
      },
      error: (error) => {
        console.error("API error:", error);
      },
      complete: () => {
        console.log("Admin list fetch completed.");
      },
    });
  }

  // open(content: TemplateRef<NgbModal>): void {
  //   this.modalRef = this.modalService.open(content, { scrollable: true });
  // }

  open(content: TemplateRef<NgbModal>, category?: any): void {
    this.selectedCategory = category || null;

    if (this.selectedCategory) {
      this.addCategoryForm.patchValue({
        category_title: this.selectedCategory.category_title,
      });

      // optionally preload image preview if editing
    } else {
      this.addCategoryForm.reset();
      this.files = null;
    }

    this.modalRef = this.modalService.open(content, { scrollable: true });
  }

  createCategory(): void {
    if (this.addCategoryForm.valid) {
      this.isSubmitting = true;

      const formData = new FormData();
      formData.append(
        "category_title",
        this.addCategoryForm.value.category_title
      );

      if (this.files) {
        formData.append("category_img", this.files);
      }

      if (this.selectedCategory) {
        // 📝 Edit Mode
        this.categoryService
          .updateCategory(this.selectedCategory.id, formData)
          .subscribe({
            next: (response) => {
              if (response.success) {
                this.toaster.success("Updated", response.message);
                this.getCategory();
                this.files = null;
                this.addCategoryForm.reset();
                this.modalRef.close();
                this.isSubmitting = false;
              } else {
                this.isSubmitting = false;

                this.toaster.warn("Alert", response.message);
              }
            },
            error: () => {
              this.toaster.error("Error", "Something went wrong.");
              this.isSubmitting = false;
            },
          });
      } else {
        // ➕ Add Mode
        this.categoryService.createCategory(formData).subscribe({
          next: (response) => {
            if (response.success) {
              this.isSubmitting = false;

              this.toaster.success("Created", response.message);
              this.getCategory();
              this.files = null;
              this.addCategoryForm.reset();
              this.modalRef.close();
            } else {
              this.isSubmitting = false;

              this.toaster.warn("Alert", response.message);
            }
          },
          error: () => {
            this.toaster.error("Error", "Something went wrong.");
            this.isSubmitting = false;
          },
        });
      }
    } else {
      this.toaster.warn("Alert", "Please fill all mandatory fields..!");
    }
  }

  deleteCategory(): void {
    this.isSubmitting = true;

    if (this.selectedCategory) {
      this.categoryService.deleteCategory(this.selectedCategory.id).subscribe({
        next: (response) => {
          if (response.success) {
            this.isSubmitting = false;

            this.toaster.success("Deleted", response.message);
            this.getCategory();
            this.modalRef.close();
          } else {
            this.isSubmitting = false;

            this.toaster.warn("Alert", response.message);
          }
        },
        error: () => {this.toaster.error("Error", "Something went wrong.");
          this.isSubmitting = false;

        }
      });
    } else {
      this.toaster.warn("Alert", "Enexpected error occured , contact admin");
    }
  }

  onSelectImage(event: any): void {
    if (event.addedFiles && event.addedFiles.length > 0) {
      this.files = event.addedFiles[0]; // Store only the first selected file
    }
  }

  onRemoveFile(event: any) {
    // this.files.splice(this.files.indexOf(event), 1);
    this.files = null; // Clear the file
  }

  getSize(f: File) {
    const bytes = f.size;
    if (bytes === 0) {
      return "0 Bytes";
    }
    const k = 1024;
    const dm = 2;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }

  /**
   * returns preview url of uploaded file
   */
  getPreviewUrlImg(f: File) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      encodeURI(URL.createObjectURL(f))
    );
  }

  openAlertModal(
    content: TemplateRef<NgbModal>,
    variant: string,
    category: any
  ): void {
    this.selectedCategory = category;
    this.modalRef = this.modalService.open(content, {
      size: "sm",
      modalDialogClass: "modal-filled bg-" + variant,
    });
  }
}
