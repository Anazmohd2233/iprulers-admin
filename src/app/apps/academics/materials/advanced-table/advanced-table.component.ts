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
import { Select2Data } from "ng-select2-component";
import { MaterialService } from "src/app/core/service/material/material.service";
import { ToastUtilService } from "src/app/apps/toaster/toasterUtilService";
import { MaterialsComponent } from "../materials.component";
import { CourseService } from "src/app/core/service/course/course.service";

export interface Column {
  name: string;
  label: string;
  formatter: (a: any) => any | string;
  sort?: boolean;
  width?: number;
}

@Component({
  selector: "app-advanced-table-users",
  templateUrl: "./advanced-table.component.html",
  styleUrls: ["./advanced-table.component.scss"],
  providers: [AdvancedTableServices],
})
export class AdvancedTableComponent implements OnInit, AfterViewChecked {
  @Input() courseID: any | null = null;
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
  @Output() materialAdded = new EventEmitter<void>();
  @Output() labAdded = new EventEmitter<void>();
  @Output() noteAdded = new EventEmitter<void>();

  @ViewChildren(NgbSortableHeaderDirective)
  headers!: QueryList<NgbSortableHeaderDirective>;
  @ViewChildren("advancedTable") advancedTable!: any;

  addStudentForm!: FormGroup;
  addLabForm!: FormGroup;
  addMaterialForm!: FormGroup;
  addNoteForm!: FormGroup;
  modalRef!: NgbModalRef;
  selectedType: string = "";
  files: File | null = null; // Single file object
  docs: File | null = null;

  formData02 = new FormData();

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private studentService: StudentService,
    private materialService: MaterialService,
    public service: AdvancedTableServices,
    private sanitizer: DomSanitizer,
    private router: Router,
    private userService: UserProfileService,
    private toaster: ToastUtilService,
    private courseService: CourseService
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
      username: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]], // Email validation
      pwd: ["", Validators.required], // Password field
      confirm: ["", Validators.required], // Confirm password field
    });

    this.addMaterialForm = this.fb.group({
      title: ["", Validators.required], // Material Title (Matches formControlName)
      type: [null, Validators.required], // File Upload Validation
      link: [""], // File Upload Validation
    });

    this.addLabForm = this.fb.group({
      labTitle: ["", Validators.required], // Lab Title (Matches formControlName)
    });

    this.addNoteForm = this.fb.group({
      noteTitle: ["", Validators.required], // Lab Title (Matches formControlName)
    });

    this.addMaterialForm.get("type")?.valueChanges.subscribe((type) => {
      const linkControl = this.addMaterialForm.get("link");

      if (type === "link") {
        linkControl?.setValidators([Validators.required]);
        linkControl?.updateValueAndValidity();

        this.docs = null; // clear uploaded file
      } else if (type === "pdf") {
        linkControl?.clearValidators();
        linkControl?.setValue(null);
        linkControl?.updateValueAndValidity();
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    // this.paginate();

    if (changes["tableData"] || changes["service.page"]) {
      this.paginate();
    }
  }

  /**
   * sets pagination configurations
   */
  paginate(): void {
    if (this.tableName === "userList") {
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

  open(content: TemplateRef<NgbModal>): void {
    this.modalRef = this.modalService.open(content, { scrollable: true });
  }

  onSubmitCreateStudent(): void {}

  createMaterial(): void {
    if (this.addMaterialForm.valid) {
      const formData = new FormData();

      const { title, type, link } = this.addMaterialForm.value;

      formData.append("title", title);
      formData.append("type", type);

      if (type === "link") {
        formData.append("link", link);
      }

      if (type === "pdf" && this.docs) {
        formData.append("material_document", this.docs);
      }

      this.materialService.createMaterial(formData).subscribe({
        next: (response) => {
          if (response.success) {
            this.materialAdded.emit();
            this.docs = null;
            this.addMaterialForm.reset();
            this.modalRef.close();
            this.toaster.success("Success", response.message);
          } else {
            this.toaster.warn("Alert", response.message);

            console.error("Failed to create material:", response.message);
          }
        },
        error: (error) => {
          this.toaster.error("Failed", "Something went wrong.");

          console.error("Error creating material:", error);
        },
        complete: () => {
          console.log("material created successfully!...");
        },
      });
    } else {
      this.toaster.warn("Alert", "Fill all mandaratory fields!!");

      console.log("material form not validated");
    }
  }

  //Add Labs
  addLabs(): void {
    if (this.addLabForm.valid) {
      const formData = new FormData();
      formData.append("labTitle", this.addLabForm.value.labTitle);
      formData.append("courseId", this.courseID);
      if (this.files) {
        formData.append("labFile", this.files); // Single file for course image
      }
      this.courseService.assignLabOrNotes(formData).subscribe({
        next: (response) => {
          if (response.success) {
            this.labAdded.emit();
            this.files = null;
            this.addLabForm.reset();
            this.modalRef.close();
            this.toaster.success("Success", response.message);
          } else {
            this.toaster.warn("Alert", response.message);

            console.error("Failed to create student:", response.message);
          }
        },
        error: (error) => {
          this.toaster.error("Failed", "Something went wrong.");

          console.error("Error creating student:", error);
        },
      });
    } else {
      this.toaster.warn("Alert", "Fill All the fields");
    }
  }

  addNotes(): void {
    if (this.addNoteForm.valid) {
      const formData = new FormData();
      formData.append("noteTitle", this.addNoteForm.value.noteTitle);
      formData.append("courseId", this.courseID);
      if (this.files) {
        formData.append("noteFile", this.files); // Single file for course image
      }
      this.courseService.assignLabOrNotes(formData).subscribe({
        next: (response) => {
          if (response.success) {
            this.noteAdded.emit();
            this.files = null;
            this.addNoteForm.reset();
            this.modalRef.close();
            this.toaster.success("Success", response.message);
          } else {
            this.toaster.warn("Alert", response.message);

            console.error("Failed to add notes:", response.message);
          }
        },
        error: (error) => {
          this.toaster.error("Failed", "Something went wrong.");

          console.error("Error creating student:", error);
        },
      });
    } else {
      this.toaster.warn("Alert", "Fill All the fields");
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
  getPreviewUrlDoc(f: File) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      encodeURI(URL.createObjectURL(f))
    );
  }
  onRemoveDoc(event: any) {
    this.docs = null;
  }

  onSelectDoc(event: any) {
    if (event.addedFiles && event.addedFiles.length > 0) {
      this.docs = event.addedFiles[0]; // Store only the first selected file
    }
  }

  openAlertModal(
    content: TemplateRef<NgbModal>,
    variant: string,
    record: any,
    tableName:any
  ): void {

    this.modalRef = this.modalService.open(content, {
      size: "sm",
      modalDialogClass: "modal-filled bg-" + variant,
    });

    if(tableName =='notes' || tableName =='labs'){
    this.formData02 = new FormData(); 
    this.formData02.append("type", record.lab ? "lab" : "note");
    this.formData02.append("id", record.id);
    this.formData02.append("course_id", this.courseID);
  }else if(tableName =='material'){
    this.formData02 = new FormData(); 
    this.formData02.append("id", record.id);
  }
  }

  deleteLabOrNotes(): void {
    this.courseService.deleteCourse(this.formData02).subscribe({
      next: (response) => {
        if (response.success) {
          this.toaster.success("Deleted", response.message);
          this.modalRef.close();
          this.labAdded.emit();
          this.noteAdded.emit();
        } else {
          this.toaster.warn("Alert", response.message);
        }
      },
      error: () => this.toaster.error("Error", "Something went wrong."),
    });
  }
  deleteMaterials():void{
    this.materialService.deleteMaterial(this.formData02).subscribe({
      next: (response) => {
        if (response.success) {
          this.toaster.success("Deleted", response.message);
          this.materialAdded.emit();
          this.modalRef.close();
          this.addMaterialForm.reset();
        } else {
          this.toaster.warn("Alert", response.message);
        }
      },
      error: () => this.toaster.error("Error", "Something went wrong."),
    });

  }
}
