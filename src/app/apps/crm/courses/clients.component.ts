import { Component, OnInit, TemplateRef } from "@angular/core";

// types
import { BreadcrumbItem } from "src/app/shared/page-title/page-title.model";

// data
import { CLIENTS } from "./data";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DomSanitizer } from "@angular/platform-browser";
import { Router } from "@angular/router";
import { Course, CourseListResponse } from "../../chat/banner/banner.module";
import { CourseService } from "src/app/core/service/course.service";

@Component({
  selector: "app-crm-clients",
  templateUrl: "./clients.component.html",
  styleUrls: ["./clients.component.scss"],
})
export class CRMClientsComponent implements OnInit {
  addCourseForm!: FormGroup;

  courses: Course[] = [];
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
      name: ["", Validators.required],
      description: ["", Validators.required],
      course_objective: this.fb.array([]), // FormArray for course objectives
      status: ["", Validators.required],
    });

    this.addObjective();
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

  // Get the course_objective FormArray
  get courseObjectives(): FormArray {
    return this.addCourseForm.get("course_objective") as FormArray;
  }

  // Add a new objective to the FormArray
  addObjective(): void {
    const objectiveGroup = this.fb.group({
      id: ["100", Validators.required], // Default ID; can be dynamic
      name: [""],
      description: [""],
    });
    this.courseObjectives.push(objectiveGroup);
  }

  // Remove an objective from the FormArray
  removeObjective(index: number): void {
    this.courseObjectives.removeAt(index);
  }

  onSubmitCreateCourse(): void {
    if (this.addCourseForm.valid) {
      const formData = new FormData();

      // Add scalar values
      formData.append("name", this.addCourseForm.value.name);
      formData.append("description", this.addCourseForm.value.description);
      formData.append("status", this.addCourseForm.value.status);

      // Add course_objective as a stringified JSON
      formData.append(
        "course_objective",
        JSON.stringify(this.addCourseForm.value.course_objective)
      );

      if (this.files) {
        formData.append("course_img", this.files); // Single file for course image
      }

      if (this.docs) {
        formData.append("course_document", this.docs); // Single file for course document
      }
      // Send POST request
      this.http
        .post("https://lms.zaap.life/admin/course/create", formData, {
          headers: {
            Authorization:
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiMSIsImlhdCI6MTczNzI4MzA5Nn0.OPDfT5xYyL09x2DYr2iVmldzHhq4OCsTm4RWE8wW12w",
          },
        })
        .subscribe((response) => {
          console.log("Course created successfully", response);
          this.resetForm();
        });
    }
  }
  resetForm() {
    this.addCourseForm.reset({
      name: "",
      description: "",
      course_objective: [],
      status: "",
    });
    this.files = null;
    this.docs = null;
  }

  /**
   * adds new file in uploaded files
   * @param event event
   */
  // onSelectImage(event: any) {
  //   this.files.push(...event.addedFiles);
  // }

  onSelectImage(event: any): void {
    if (event.addedFiles && event.addedFiles.length > 0) {
      this.files = event.addedFiles[0]; // Store only the first selected file
    }
  }

  onSelectDoc(event: any) {
    if (event.addedFiles && event.addedFiles.length > 0) {
      this.docs = event.addedFiles[0]; // Store only the first selected file
    }
  }

  /**
   * removes file from uploaded files
   * @param event event
   */
  onRemoveFile(event: any) {
    // this.files.splice(this.files.indexOf(event), 1);
    this.files = null; // Clear the file
  }
  onRemoveDoc(event: any) {
    this.docs = null;
  }

  /**
   * Formats the size
   */
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

  getPreviewUrlDoc(f: File) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      encodeURI(URL.createObjectURL(f))
    );
  }

  // goToCourseDetails(course:any): void {
  //   this.router.navigate(["dashboard/analytics"]); // Replace with your actual route path
  // }

  goToCourseDetails(course: any): void {
    // this.router.navigate(['dashboard/analytics']);
    localStorage.setItem("courseId", course.id); // Save URLs only
    this.router.navigate([`courses/details/${course.id}`]);
  }
}
