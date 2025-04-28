import {
  Component,
  ComponentFactoryResolver,
  EventEmitter,
  Input,
  OnInit,
  Output,
  QueryList,
  SimpleChanges,
  ViewChildren,
} from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";

import { BreadcrumbItem } from "src/app/shared/page-title/page-title.model";
import { AdvancedTable } from "./advanced.model";
import { Column } from "../advanced-table/advanced-table.component";
import { SortEvent } from "../advanced-table/sortable.directive";
import { UserProfileService } from "src/app/core/service/user.service";
import { Admin } from "../models/model";
import { StudentService } from "src/app/core/service/student/student.service";
import { ToastUtilService } from "../../toaster/toasterUtilService";

@Component({
  selector: "app-students",
  templateUrl: "./students.component.html",
  styleUrls: ["./students.component.scss"],
})
export class StudentsComponent implements OnInit {
  pageTitle: BreadcrumbItem[] = [];
  records: Admin[] = [];
  columns: Column[] = [];
  pageSizeOptions: number[] = [10, 25, 50, 100];

  studentList: any[] = [];

  totalCount: number = 0;
  limit: number = 0;

  page: number = 1;
  tableName: string = "students";

  constructor(
    private userService: UserProfileService,
    private studentService: StudentService,
    private toaster: ToastUtilService
  ) {}

  ngOnInit(): void {
    this.pageTitle = [
      { label: "Tables", path: "/" },
      { label: "Advanced Tables", path: "/", active: true },
    ];
    this.getStudent();
    this.initTableCofig();
  }

  /**
   * fetches table records
   */

  changeStatus(event: { status: any; id: any }): void {
    const formData = new FormData();
    formData.append("status", event.status);
    this.studentService.updateStudent(formData, event.id).subscribe({
      next: (response) => {
        if (response.success) {
          this.getStudent();
          this.toaster.success(
            "Success",
            "Student status changed succesfully..!"
          );
        } else {
          this.toaster.warn("Failed", "Student Status Updated Failed.");
          console.error("Failed to update Student:", response.message);
        }
      },
      error: (error) => {
        this.toaster.error("Failed", "Something went wrong.");

        console.error("Error updating Student:", error);
      },
    });
  }
  getStudent(search?: any): void {
    // this.records = tableData;
    this.studentService.getStudent(this.page, search).subscribe({
      next: (response) => {
        console.log("response of student list from student component - ", response);

        if (response.success) {

          this.studentList = response.data.students;
          this.records = this.studentList;
          this.totalCount = response.data.total_count;
          this.limit = response.data.limit;
        } else {
          console.error("Failed to fetch data:", response.message);
        }
      },
      error: (error) => {
        console.error("Error fetching admin list:", error);
      },
      complete: () => {
        // Optionally handle the completion logic here
        console.log("Student list fetch completed.");
      },
    });
  }

  /**
   * initialize advanced table columns
   */
  initTableCofig(): void {
    this.columns = [
      {
        name: "name",
        label: "Name",
        formatter: (record: Admin) => record.name,
        width: 300,
      },
      {
        name: "username",
        label: "Username",
        formatter: (record: Admin) => record.email,
        width: 300,
      },
      {
        name: "status",
        label: "Status",
        // formatter: (record: Admin) => record.status==1?'Active':'Inactive',
        formatter: () => "",
        width: 300,
      },

      {
        name: "action",
        label: "Edit",
        formatter: () => "",
        width: 150,
      },
    ];
  }

  openCourses(record: Admin) {
    console.log("Courses for", record);
    // Your logic here
  }

  // compares two cell values
  compare(v1: string | number, v2: string | number): any {
    return v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
  }

  /**
   * Sort the table data
   * @param event column name, sort direction
   */
  onSort(event: SortEvent): void {
    if (event.direction === "") {
      this.records = this.studentList;
    } else {
      this.records = [...this.records].sort((a, b) => {
        const res = this.compare(a[event.column], b[event.column]);
        return event.direction === "asc" ? res : -res;
      });
    }
  }

  /**
   * Table Data Match with Search input
   * @param tables Table field value fetch
   * @param term Search the value
   */
  matches(tables: any, term: string) {
    return (
      tables.name.toLowerCase().includes(term) ||
      // tables.phone.toLowerCase().includes(term) ||
      tables.email.toLowerCase().includes(term)
      // String(tables.gender).includes(term)
    );
    // || tables.date.toLowerCase().includes(term)
    // || tables.salary.toLowerCase().includes(term);
  }

  /**
   * Search Method
   */
  searchData(searchTerm: string): void {
    console.log("searchTerm - " + searchTerm);
    if (searchTerm === "") {
      this.getStudent();
      console.log("no search terms");
    } else {
      this.getStudent(searchTerm);

      //let updatedData = this.studentList;
      //  filter
      // updatedData = updatedData.filter((record) =>
      //   this.matches(record, searchTerm)
      // );
      // this.records = updatedData;
    }
  }
}
