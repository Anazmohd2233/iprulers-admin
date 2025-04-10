import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';


// data
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { FormArray, FormBuilder,Validators } from "@angular/forms";
import { DomSanitizer } from "@angular/platform-browser";
import { Router } from "@angular/router";
import { CourseService } from 'src/app/core/service/course/course.service';
import { Course } from 'src/app/apps/models/course';
import { CategoryService } from 'src/app/core/service/category/category.service';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})


export class CoursesComponent implements OnInit {
  addCourseForm!: FormGroup;

  courses: Course[] = [];
  page:number = 1;
  files: File | null = null; // Single file object
  category: any[] = [];

  constructor(
    private http: HttpClient,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private router: Router,
    private courseService: CourseService,
        private categoryService: CategoryService,
    
  ) {}

  ngOnInit(): void {


    this.getCourse();

    this.addCourseForm = this.fb.group({
      course_title: ["", Validators.required],
      card_title: ["", Validators.required],
      category: ["", Validators.required],

    });
    this.getCategory();

  }

  /**
   * fetches order list
   */
  private getCourse(): void {

    this.courseService.getCourses(this.page).subscribe({
      next: (response) => {
        if (response.success) {
          this.courses = response.data.courses;

          console.log("Courses loaded:", this.courses);
        } else {
          console.error("Failed to load courses:", response.message);
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

 

  open(content: TemplateRef<NgbModal>): void {
    this.modalService.open(content, { scrollable: true });
  }




  onSubmitCreateCourse(): void {
    if (this.addCourseForm.valid) {
      const formData = new FormData();

      // Add scalar values
      formData.append("course_title", this.addCourseForm.value.course_title);
      formData.append("card_title", this.addCourseForm.value.card_title);
      formData.append("category", this.addCourseForm.value.category);

     
      if (this.files) {
        formData.append("course_img", this.files); // Single file for course image
      }

   
      this.courseService.createCourse(formData).subscribe({
        next: (response) => {
          console.log("response of create course - ", response);
          if (response.success) {
            this.getCourse();

            this.resetForm();
            this.files = null;
           
          } else {
            console.error("Failed to create course:", response.message);
          }
        },
        error: (error) => {
          console.error("Error creating course:", error);
        },
        complete: () => {
          console.log("Course created successfully!...");
        },
      });


    }
  }
  resetForm() {
    this.addCourseForm.reset({
      course_title: "",
      card_title: "",
      category: "",
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



  goToCourseDetails(course: any): void {

    this.router.navigate([`admin/edit_course`]);

  }

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
        console.log('Admin list fetch completed.');
      }
    });
  }
}
