import { Component, OnInit } from "@angular/core";
import { UserProfileService } from "src/app/core/service/user.service";
import { EnrolledCourse } from "../models/mode-user-courses";
import { BreadcrumbItem } from "src/app/shared/page-title/page-title.model";
import { Column } from "../advanced-table/advanced-table.component";
import { SortEvent } from "../advanced-table/sortable.directive";

@Component({
  selector: "app-user-courses",
  templateUrl: "./user-courses.component.html",
  styleUrls: ["./user-courses.component.scss"],
})
export class UserCoursesComponent implements OnInit {
  userId_course: any;
  enrolled_list: EnrolledCourse[] = [];

  pageTitle: BreadcrumbItem[] = [];
  records: EnrolledCourse[] = [];
  columns: Column[] = [];
  pageSizeOptions: number[] = [10, 25, 50, 100];

  totalCount: number = 0;
  limit: number = 0;

  constructor(private userService: UserProfileService) {}

  ngOnInit(): void {
    this.userId_course = localStorage.getItem("userId_course"); // Save URLs only
    this._fetchData(this.userId_course);
    this.initTableCofig();
  }

  _fetchData(userId: any): void {
    // this.records = tableData;

    this.userService.getCourseListUser(userId).subscribe({
      next: (response) => {
        console.log("response of user list - ", response);
        if (response.success) {
          this.enrolled_list = response.data.enrolled;
          this.records = this.enrolled_list;
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
        console.log(
          "course list fetch completed for the user.",
          this.enrolled_list
        );
      },
    });
  }

  initTableCofig(): void {
    this.columns = [
      {
        name: "User Name",
        label: "name",
        formatter: (record: EnrolledCourse) => record.user_name,
        width: 245,
      },
      {
        name: "Course Name",
        label: "courseName",
        formatter: (record: EnrolledCourse) => record.CourseDetails.name,
        width: 250,
      },
      // {
      //   name: "desc",
      //   label: "Course Description",
      //   formatter: (record: EnrolledCourse) => record.CourseDetails.description,
      //   width: 250,
      // },
      {
        name: "Course Description",
        label: "desc",
        formatter: (record: EnrolledCourse) => `
          <p class="mb-0 text-muted description" title="${record.CourseDetails.description}">
            ${record.CourseDetails.description.slice(0, 20)}...
          </p>
        `,
        width: 250,
      },
      {
        name: "Payment Status",
        label: "status",
        formatter: (record: EnrolledCourse) => record.paymentStatus,
      },
      {
        name: "change",
        label: "Change Status",
        formatter: () => "",
      },

      // {
      //   name: 'date',
      //   label: 'Date',
      //   formatter: (record: AdvancedTable) => record.date,
      // },
      // {
      //   name: 'salary',
      //   label: 'Salary',
      //   formatter: (record: AdvancedTable) => record.salary,

      // }
    ];
  }




    // compares two cell values
    compare(v1: string | number, v2: string | number): any {
      return v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
    }
  
    /**
     * Sort the table data
     * @param event column name, sort direction
     */
    // onSort(event: SortEvent): void {
    //   if (event.direction === '') {
    //     this.records = this.adminList;
    //   } else {
    //     this.records = [...this.records].sort((a, b) => {
    //       const res = this.compare(a[event.column], b[event.column]);
    //       return event.direction === 'asc' ? res : -res;
    //     });
    //   }
    // }
  
    /**
   * Table Data Match with Search input
   * @param tables Table field value fetch
   * @param term Search the value
   */
    matches(tables: EnrolledCourse, term: string) {
      return tables.user_name.toLowerCase().includes(term)
        || tables.CourseDetails.name.toLowerCase().includes(term)
        || tables.CourseDetails.description.toLowerCase().includes(term)
        || tables.paymentStatus.toLowerCase().includes(term)
        // || tables.date.toLowerCase().includes(term)
        // || tables.salary.toLowerCase().includes(term);
    }
  
    /**
     * Search Method
    */
    searchData(searchTerm: string): void {
      if (searchTerm === '') {
        this._fetchData(this.userId_course);
      }
      else {
        let updatedData = this.enrolled_list;
  
        //  filter
        updatedData = updatedData.filter(record => this.matches(record, searchTerm));
        this.records = updatedData;
      }
  
    }
}
