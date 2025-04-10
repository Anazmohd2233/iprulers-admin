import {
  AfterViewChecked,
  Component,
  ComponentFactoryResolver,
  EventEmitter,
  Input,
  OnInit,
  Output,
  QueryList,
  SimpleChanges,
  TemplateRef,
  ViewChildren,
} from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { AdvancedTableServices } from "./advanced-table-service.service";
import { NgbSortableHeaderDirective, SortEvent } from "./sortable.directive";
import { Router } from "@angular/router";
import { EnrolledCourse } from "../models/mode-user-courses";
import { UserProfileService } from "src/app/core/service/user.service";

import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { StudentService } from "src/app/core/service/student/student.service";
import { StudentsComponent } from "../students/students.component";
import { ToastUtilService } from "../../toaster/toasterUtilService";

export interface Column {
  name: string;
  label: string;
  formatter: (a: any) => any | string;
  sort?: boolean;
  width?: number;
}

@Component({
  selector: "app-advanced-table-student",
  templateUrl: "./advanced-table.component.html",
  styleUrls: ["./advanced-table.component.scss"],
  providers: [AdvancedTableServices],
})
export class AdvancedTableComponent implements OnInit, AfterViewChecked {
  @Input() tableName: string = "";
  @Input() pagination: boolean = false;
  @Input() isSearchable: boolean = false;
  @Input() isSortable: boolean = false;
  @Input() pageSizeOptions: number[] = [];
  @Input() tableData: any[] = [];
  @Input() tableClasses: string = "";
  @Input() theadClasses: string = "";
  @Input() hasRowSelection: boolean = false;
  @Input() columns: Column[] = [];
  collectionSize: number = this.tableData.length;
  selectAll: boolean = false;
  isSelected: boolean[] = [];

  @Output() search = new EventEmitter<string>();
  @Output() sort = new EventEmitter<SortEvent>();
  @Output() handleTableLoad = new EventEmitter<void>();

  @ViewChildren(NgbSortableHeaderDirective)
  headers!: QueryList<NgbSortableHeaderDirective>;
  @ViewChildren("advancedTable") advancedTable!: any;

  addStudentForm!: FormGroup;
  files: File | null = null; // Single file object
  modalRef!: NgbModalRef;

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private studentService: StudentService,
    public service: AdvancedTableServices,
    private sanitizer: DomSanitizer,
    private router: Router,
    private userService: UserProfileService,
    private studComponent: StudentsComponent,
    private toaster: ToastUtilService
  ) {}

  ngAfterViewChecked(): void {
    this.handleTableLoad.emit();
  }

  ngOnInit(): void {
    for (let i = 0; i < this.tableData.length; i++) {
      this.isSelected[i] = false;
    }

    this.addStudentForm = this.fb.group({
      name: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]], // Email validation
      pwd: ["", Validators.required], // Password field
      confirm: ["", Validators.required], // Confirm password field
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    // this.paginate();

    if (changes["tableData"] || changes["service.page"]) {
      this.paginate();
    }
  }
  get form1() {
    return this.addStudentForm.controls;
  }

  /**
   * sets pagination configurations
   */
  paginate(): void {
    if (this.tableName === "students") {
      this._fetchData();
    }
  }

  /**
   * Search Method
   */
  searchData(): void {
    this.search.emit(this.service.searchTerm);
  }

  /**
   * sorts column
   * @param param0 column name,sort direction
   */
  onSort({ column, direction }: SortEvent): void {
    // resetting other headers
    this.headers.forEach((header) => {
      if (header.sortable !== column) {
        header.direction = "";
      }
    });

    this.service.sortColumn = column;
    this.service.sortDirection = direction;

    this.sort.emit({ column, direction });
  }

  /**
   *  calls formatter function for table cells
   * @param column column name
   * @param data data of column
   */
  callFormatter(column: Column, data: any): any {
    return column.formatter(data);
  }

  /**
   * @returns intermediate status of selectAll checkbox
   */
  checkIntermediate(): boolean {
    let selectedRowCount = this.isSelected.filter((x) => x === true).length;
    if (
      !this.selectAll &&
      selectedRowCount > 0 &&
      selectedRowCount < this.tableData.length
    ) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * select all row
   * @param event event
   */
  selectAllRow(event: any): void {
    this.selectAll = !this.selectAll;
    if (this.selectAll) {
      for (let i = 0; i < this.tableData.length; i++) {
        this.isSelected[i] = true;
      }
    } else {
      for (let i = 0; i < this.tableData.length; i++) {
        this.isSelected[i] = false;
      }
    }
  }

  /**
   * selects row
   * @param index row index
   */
  selectRow(index: number): void {
    this.isSelected[index] = !this.isSelected[index];
    this.selectAll =
      this.isSelected.filter((x) => x === true).length ===
      this.tableData.length;
  }

  editStudent(record: any): void {
    console.log("Open courses for:", record);
    localStorage.setItem("userId_course", record.id); // Save URLs only

    //this.router.navigate([`admin/edit_student`]);
    this.router.navigate([`admin/student`, record.id]);

    // Add your logic here to open the Courses page/modal for the selected user.
  }

  _fetchData(): void {
    // this.records = tableData;

    this.studentService.getStudent(this.service.page).subscribe({
      next: (response) => {
        console.log("response of student list - ", response);
        if (response.success) {
          this.tableData = response.data.students;
          this.service.totalRecords = response.data.total_count; // Set total records
          this.service.pageSize = response.data.limit; // Ensure pageSize matches API limit

          // Set start and end index
          this.service.startIndex =
            this.service.totalRecords > 0
              ? (this.service.page - 1) * this.service.pageSize + 1
              : 0;

          this.service.endIndex = Math.min(
            this.service.startIndex + this.service.pageSize - 1,
            this.service.totalRecords
          );
        } else {
          console.error("Failed to fetch data:", response.message);
        }
      },
      error: (error) => {
        console.error("Error fetching students list:", error);
      },
    });
  }

  open(content: TemplateRef<NgbModal>): void {
    this.modalRef = this.modalService.open(content, { scrollable: true });
  }

  createStudent(): void {
    if (this.addStudentForm.invalid) {
      this.addStudentForm.markAllAsTouched();
      return;
    }

    const password = this.addStudentForm.value.pwd;
    const confirmPassword = this.addStudentForm.value.confirm;

    if (password !== confirmPassword) {
      console.error("Passwords do not match");
      return;
    }

    const formData = new FormData();
    formData.append("name", this.addStudentForm.value.name);
    formData.append("email", this.addStudentForm.value.email);
    formData.append("password", password);
    formData.append("confirm", confirmPassword);

    if (this.files) {
      formData.append("student_img", this.files);
    }

    this.studentService.createStudent(formData).subscribe({
      next: (response) => {
        console.log("response of create student - ", response);
        if (response.success) {
          this.files = null;
          this.addStudentForm.reset();
          this.modalRef.close();
          this.toaster.success("Success", response.message);
          this.studComponent.getStudent();

          this.files = null;
          // Optional: show a success toast or close modal
        } else {
          this.toaster.warn("Alert", response.message);

          console.error("Failed to create student:", response.message);
        }
      },
      error: (error) => {
        this.toaster.error("Failed", "Something went wrong.");

        console.error("Error creating student:", error);
      },
      complete: () => {
        console.log("Student created successfully!");
      },
    });
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
