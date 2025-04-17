import {
  Component,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { FormBuilder, FormGroup, NgForm, Validators } from "@angular/forms";
import { DomSanitizer } from "@angular/platform-browser";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastUtilService } from "src/app/apps/toaster/toasterUtilService";
import { CourseService } from "src/app/core/service/course/course.service";

type selectedMember = {
  id: number;
  name: string;
  image: string;
};
@Component({
  selector: "app-edit-course-details",
  templateUrl: "./edit-course-details.component.html",
  styleUrls: ["./edit-course-details.component.scss"],
})
export class EditCourseDetailsComponent implements OnInit {
  @Input() courseID: any | null = null;

  selectedMembers: selectedMember[] = [];

  projectName: string = "";
  projectOverview: string = "";
  projectStartDate: string = "";
  projectEndDate: string = "";
  projectBudget: number = 0;
  submitted: boolean = false;
  courseList: any;

  files: File | null = null; // Single file object

  courseImageForm!: FormGroup;
  addCourseDetailsForm!: FormGroup;

  constructor(
    private sanitizer: DomSanitizer,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private courseService: CourseService,
    private toaster: ToastUtilService
  ) {}

  ngOnInit(): void {

    this.getCourseById();

    this.addCourseDetailsForm = this.fb.group({
      title: ["", Validators.required],
      card_title: ["", Validators.required],
      description: [""],
      duration: [""],
      level: [""],
      rating: [""],
      overview: [""],
    });
  }


  onChangeImage() {
    const formData = new FormData();
    if (this.files) {
      formData.append("course_img", this.files); // Assuming this.files holds a single File object
    }
    this.updateCourse(formData, this.courseID);
  }

  /**
   *  on project form submit
   */
  onSubmitCourseDetails(): void {
    if (this.addCourseDetailsForm.valid) {
      const formData = new FormData();

      // Append form values
      formData.append("title", this.addCourseDetailsForm.value.title);
      formData.append("card_title", this.addCourseDetailsForm.value.card_title);
      formData.append(
        "description",
        this.addCourseDetailsForm.value.description
      );
      formData.append("duration", this.addCourseDetailsForm.value.duration);
      formData.append("level", this.addCourseDetailsForm.value.level);
      formData.append("rating", this.addCourseDetailsForm.value.rating);
      formData.append("overview", this.addCourseDetailsForm.value.overview);

      this.updateCourse(formData, this.courseID);
    } else {
      console.log("Form is not valid");
      this.addCourseDetailsForm.markAllAsTouched();
    }
  }

  updateCourse(formData: any, id: any): void {
    this.courseService.updateCourse(formData, id).subscribe({
      next: (response) => {
        if (response.success) {
          this.getCourseById();
          this.toaster.success(
            "Success",
            response.message
          );
        } else {
          this.toaster.warn("Failed",response.message);
          console.error("Failed to update Student:", response.message);
        }
      },
      error: (error) => {
        this.toaster.error("Failed", "Something went wrong.");

        console.error("Error updating Student:", error);
      },
    });
  }

  getCourseById(): void {
    // this.records = tableData;

    this.courseService.getCourseById(this.courseID).subscribe({
      next: (response) => {
        if (response.success) {
          this.courseList = response.data;

          this.addCourseDetailsForm.patchValue({
            title: this.courseList.course_title,
            card_title: this.courseList.card_title,
            description: this.courseList.description,
            duration: this.courseList.duration,
            level: this.courseList.level,
            rating: this.courseList.rating,
            overview: this.courseList.overview,
          });
        } else {
          console.error("Failed to fetch data:", response.message);
        }
      },
      error: (error) => {
        console.error("Error fetching notes:", error);
      },
      complete: () => {
        // Optionally handle the completion logic here
        console.log("Course fetch completed.");
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

  /**
   *  adds new file in uploaded files
   */

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
   * Returns the preview url
   */
  getPreviewUrl(f: File) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      encodeURI(URL.createObjectURL(f))
    );
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

  /**
   * returns preview url of uploaded file
   */
  getPreviewUrlImg(f: File) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      encodeURI(URL.createObjectURL(f))
    );
  }

  onDropdownSelect(status: string): void {
    console.log('Selected status:', status);

    const formData = new FormData();
      formData.append("course_status", status); // Assuming this.files holds a single File object
    
    this.updateCourse(formData, this.courseID);

  }

}
