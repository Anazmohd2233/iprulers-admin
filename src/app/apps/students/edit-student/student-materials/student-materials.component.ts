

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

@Component({
  selector: 'app-student-materials',
  templateUrl: './student-materials.component.html',
  styleUrls: ['./student-materials.component.scss']
})

export class StudentMaterialsComponent implements OnInit {
  addCourseForm!: FormGroup;
  updateDateForm!: FormGroup;


  courses: Course[] = [];
  page:number = 1;

  pageTitle: BreadcrumbItem[] = [];
  // files: File[] = [];
  files: File | null = null; // Single file object

  docs: File | null = null;

  authorization: any;

  ribbons = [
    {
      name: "CCIE EI v1.1 DOO-1 Section 2",
      img: "assets/images/sample.jpg",
      ribbon: { name: "Expired", color: "danger", direction: "left" }
    },
    {
      name: "CCIE EI v1.1 DOO-1 Section 3",
      img: "assets/images/sample2.jpg",
      ribbon: { name: "New", color: "success", direction: "right" }
    }
  ];
  

  constructor(
    private http: HttpClient,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private router: Router,
    private courseService: CourseService
  ) {}

  ngOnInit(): void {
    this.authorization = localStorage.getItem("Authorization");

    this.pageTitle = [
      { label: "CRM", path: "/" },
      { label: "Clients List", path: "/", active: true },
    ];
    this._fetchData();

    this.addCourseForm = this.fb.group({
      course: ["", Validators.required],
      date: ["", Validators.required],

    });
    this.updateDateForm = this.fb.group({
      date: ["", Validators.required],

    });

  }

  /**
   * fetches order list
   */
  private _fetchData(): void {
  


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

  public user = {
    name: "Izzat Nadiri",
    age: 26,
  };

  open(content: TemplateRef<NgbModal>): void {
    this.modalService.open(content, { scrollable: true });
  }




  onSubmitCreateCourse(): void {
    if (this.addCourseForm.valid) {
      const formData = new FormData();

      // Add scalar values
      formData.append("course", this.addCourseForm.value.course);
      formData.append("expiry", this.addCourseForm.value.date);


   
      this.courseService.createCourse(formData).subscribe({
        next: (response) => {
          console.log("response of create course - ", response);
          if (response.success) {
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
          this._fetchData();
          console.log("Course created successfully!...");
        },
      });


    }
  }
  resetForm() {
    this.addCourseForm.reset({
      course: "",
      date: "",
    });
    this.updateDateForm.reset({
      course: "",
      date: "",
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
    // this.router.navigate(['dashboard/analytics']);
    // localStorage.setItem("courseId", course.id);
    // this.router.navigate([`courses/details/${course.id}`]);
    this.router.navigate([`admin/edit_course`]);

  }


updateDate(){
  console.log('update expiry date of the course')
}
}


