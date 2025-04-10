import { Component, OnInit } from "@angular/core";
import { BreadcrumbItem } from "src/app/shared/page-title/page-title.model";
import { NgbNavChangeEvent } from "@ng-bootstrap/ng-bootstrap";
import { ActivatedRoute } from "@angular/router";
import { StudentService } from "src/app/core/service/student/student.service";

@Component({
  selector: "app-edit-student",
  templateUrl: "./edit-student.component.html",
  styleUrls: ["./edit-student.component.scss"],
})
export class EditStudentComponent implements OnInit {
  pageTitle: BreadcrumbItem[] = [];
  tabs1: number = 1;
  tabs2: number = 2;
  tabs3: string = "setting3";
  tabs4: string = "home4";
  tabs5: number = 1;
  tabs6: number = 2;
  tabs7: number = 1;
  tabs8: number = 1;
  dynamicTabs: number[] = [1, 2, 3, 4, 5];
  counter: number = 0;

  studentList: any;
  studentId: any;

  constructor(
    private route: ActivatedRoute,
    private studentService: StudentService
  ) {}

  ngOnInit(): void {
    const student_id = this.route.snapshot.paramMap.get("id");
    if (student_id) {
      this.fetchStudentDetails(student_id);
      this.studentId = student_id;
    }

    this.counter = this.dynamicTabs.length + 1;
  }

  /**
   * prevents opening of tab
   * @param changeEvent navchange event
   */
  onNavChange(changeEvent: NgbNavChangeEvent) {
    if (changeEvent.nextId === 3) {
      changeEvent.preventDefault();
    }
  }

  /**
   * closes tab
   * @param event event
   * @param toRemove remove index
   */
  close(event: MouseEvent, toRemove: number) {
    this.dynamicTabs = this.dynamicTabs.filter((id: number) => id !== toRemove);
    event.preventDefault();
    event.stopImmediatePropagation();
  }

  /**
   * add new tab
   * @param event event
   */
  add(event: MouseEvent) {
    this.dynamicTabs.push(this.counter++);
    event.preventDefault();
  }

  fetchStudentDetails(id: any): void {
    this.studentService.getStudentById(id).subscribe({
      next: (response) => {
        if (response.success) {
          this.studentList = response.data;
          console.log("studentList", this.studentList);
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
