import { Component, Input, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, NgForm, Validators } from "@angular/forms";
import { DomSanitizer } from "@angular/platform-browser";
import { ActivatedRoute } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Select2Data } from "ng-select2-component";
import { StudentService } from "src/app/core/service/student/student.service";

type selectedMember = {
  id: number;
  name: string;
  image: string;
};
@Component({
  selector: "app-edit-student-details",
  templateUrl: "./edit-student-details.component.html",
  styleUrls: ["./edit-student-details.component.scss"],
})
export class EditStudentDetailsComponent implements OnInit {

  @Input() studentID: any | null = null;

  level: Select2Data = [];
  selectedMembers: selectedMember[] = [];
  files: File | null = null; // Single file object
  editStudentDetails!: FormGroup;

  studentList: any;
  studentId: any;

  constructor(
    private sanitizer: DomSanitizer,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private studentService: StudentService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    // Initialize the form first with empty/default values
    this.editStudentDetails = this.fb.group({
      name: [""],
      email: ["", [Validators.email]],
      username: [""],
      status: [""],
    });

    if (this.studentID) {
      this.fetchStudentDetails(this.studentID);
    }

    this.level = [
      {
        value: "beginner",
        label: "Beginner",
      },
      {
        value: "intermediate",
        label: "Intermediate",
      },
      {
        value: "advanced",
        label: "Advanced",
      },
    ];
  }

  /**
   *  on project form submit
   */
  onSubmit(): void {
    if (this.editStudentDetails.valid) {
      const formData = new FormData();

      const { name, email, username, status } =
        this.editStudentDetails.value;

      formData.append("name", name);
      formData.append("email", email);
      formData.append("username", username);
      formData.append("status", status);

      this.studentService.updateStudent(formData,this.studentId).subscribe({
        next: (response) => {
          if (response.success) {
            this.fetchStudentDetails(this.studentId);
          } else {
            console.error("Failed to update Student:", response.message);
          }
        },
        error: (error) => {
          console.error("Error updating Student:", error);
        },
        complete: () => {
          console.log("Student updated successfully!...");
        },
      });
    }
  }

  fetchStudentDetails(id: any): void {
    this.studentService.getStudentById(id).subscribe({
      next: (response) => {
        if (response.success) {
          this.studentList = response.data;
          console.log("studentList", this.studentList);

          // Patch values into the form after data is available
          this.editStudentDetails.patchValue({
            name: this.studentList.name,
            email: this.studentList.email,
            username: this.studentList.email, // or this.studentList.username if available
            status: this.studentList.status,
          });
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

  /**
   * returns member id
   */
  trackByItemID(index: number, member: selectedMember): number {
    return member.id;
  }

  /**
   * add new members in selected members
   * @param event member data
   */
  addMember(event: any): void {
    //no idea what logic is this
    // const isAlreadySelected = this.selectedMembers.filter(x => x['name'] === event.options[0].data.name);
    // if (isAlreadySelected && isAlreadySelected.length === 0) {
    //   this.selectedMembers.push(event.options[0].data);
    // }
  }

  open(content: TemplateRef<NgbModal>): void {
    this.modalService.open(content, { scrollable: true });
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
