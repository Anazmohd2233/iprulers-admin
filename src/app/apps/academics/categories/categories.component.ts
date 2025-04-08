import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';


// data
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { FormArray, FormBuilder,Validators } from "@angular/forms";
import { DomSanitizer } from "@angular/platform-browser";
import { Router } from "@angular/router";
import { CourseService } from "src/app/core/service/course.service";
import { CategoryService } from 'src/app/core/service/category/category.service';
import { Course } from '../../models/course';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})




export class CategoriesComponent implements OnInit {
  addCategoryForm!: FormGroup;

  category: any[] = [];
  page:number = 1;

  pageTitle: BreadcrumbItem[] = [];
  // files: File[] = [];
  files: File | null = null; // Single file object

  docs: File | null = null;

  authorization: any;

  constructor(
    private http: HttpClient,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private router: Router,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.authorization = localStorage.getItem("Authorization");

    this.pageTitle = [
      { label: "CRM", path: "/" },
      { label: "Clients List", path: "/", active: true },
    ];
    this._fetchData();

    this.addCategoryForm = this.fb.group({
      category_title: ['', Validators.required],



    });

  }
  get form1() { return this.addCategoryForm.controls; }

  /**
   * fetches order list
   */
  private _fetchData(): void {
  


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
        console.log('Admin list fetch completed.');
      }
    });
  }

  public user = {
    name: "Izzat Nadiri",
    age: 26,
  };

  open(content: TemplateRef<NgbModal>): void {
    this.modalService.open(content, { scrollable: true });
  }




  createCategory(): void {
    if (this.addCategoryForm.valid) {
      const formData = new FormData();

      // Add scalar values
      formData.append("category_title", this.addCategoryForm.value.category_title);


     
      if (this.files) {
        formData.append("category_img", this.files); // Single file for course image
      }

   
      this.categoryService.createCategory(formData).subscribe({
        next: (response) => {
          console.log("response of create category - ", response);
          if (response.success) {
            this.resetForm();
            this.files = null;
           
          } else {
            console.error("Failed to create category:", response.message);
          }
        },
        error: (error) => {
          console.error("Error creating category:", error);
        },
        complete: () => {
          this._fetchData();
          console.log("category created successfully!...");
        },
      });


    }
  }
  resetForm() {
    this.addCategoryForm.reset({
      category_title: "",

    });
    this.files = null;
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

 

}
