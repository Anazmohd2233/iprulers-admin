import { Component, Input, OnInit, TemplateRef } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { BreadcrumbItem } from "src/app/shared/page-title/page-title.model";

// data
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { FormArray, FormBuilder, Validators } from "@angular/forms";
import { DomSanitizer } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import { CourseService } from "src/app/core/service/course/course.service";
import { Course } from "src/app/apps/models/course";
import { StudentService } from "src/app/core/service/student/student.service";

@Component({
  selector: "app-student-courses",
  templateUrl: "./student-courses.component.html",
  styleUrls: ["./student-courses.component.scss"],
})
export class StudentCoursesComponent implements OnInit {
  @Input() studentID: any | null = null;

  assignCourseForm!: FormGroup;
  updateDateForm!: FormGroup;
  courses: Course[] = [];
  page: number = 1;

  studentList: any;
  
  studentCourse: any[] = [];



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
    private router: Router,
    private courseService: CourseService,
    private studentService: StudentService
  ) {}

  ngOnInit(): void {

    if (this.studentID) {
      this.fetchStudentDetails(this.studentID);

    }

    this.getCourse();

    this.assignCourseForm = this.fb.group({
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
        console.log("Admin list fetch completed.");
      },
    });
  }

  open(content: TemplateRef<NgbModal>): void {
    this.modalService.open(content, { scrollable: true });
  }

  assignCourse(): void {
    if (this.assignCourseForm.valid) {
      const formData = new FormData();

      // Add scalar values
      formData.append("course", this.assignCourseForm.value.course);
      formData.append("expiry", this.assignCourseForm.value.date);
      formData.append("id", this.studentID);

      this.studentService.assignCourseOrMaterials(formData).subscribe({
        next: (response) => {
          console.log("response of assign course - ", response);
          if (response.success) {
            this.fetchStudentDetails(this.studentID);
            this.assignCourseForm.reset();
          } else {
            console.error("Failed to assign course:", response.message);
          }
        },
        error: (error) => {
          console.error("Error assign course:", error);
        },
        complete: () => {
          console.log("Course assign successfully!...");
        },
      });
    }
  }

  updateDate() {
    console.log("update expiry date of the course");
  }

  fetchStudentDetails(id: any): void {
    this.studentService.getStudentById(id).subscribe({
      next: (response) => {
        if (response.success) {
          this.studentCourse = response.data.courses;
          console.log("student course", this.studentCourse);
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
}
