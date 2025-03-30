import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import {
  NgbAlert,
  NgbCalendar,
  NgbDateStruct,
  NgbModal,
} from "@ng-bootstrap/ng-bootstrap";
import { CardDropdownOption } from "../../../shared/widget/card-title/card-title.model";

// type
import { ApexChartOptions } from "../../charts/apex/apex.model";
import {
  Channel,
  EngagementItem,
  SocialMediaItem,
  ViewsItem,
} from "./analytics.model";

// data
import {
  CHANNELDATA,
  ENGAGEMENTDATA,
  SOCIALMEDIATRAFFIC,
  VIEWSPERMINUTE,
} from "./data";
import { ActivatedRoute, Router } from "@angular/router";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  Course,
  CourseDataById,
  CourseDetailById,
  CourseListResponse,
  CourseModalResponseById,
} from "src/app/apps/chat/banner/banner.module";
import { CourseService } from "src/app/core/service/course.service";
import { debounceTime, Subject } from "rxjs";

@Component({
  selector: "app-dashboard-analytics",
  templateUrl: "./analytics.component.html",
  styleUrls: ["./analytics.component.scss"],
})
export class AnalyticsComponent implements OnInit {
  addCourseDetailsForm!: FormGroup;
  editCourseForm!: FormGroup;

  private _success = new Subject<string>();
  show: boolean = false;
  @ViewChild("updateSuccessAlert", { static: false })
  updateSuccessAlert!: NgbAlert;

  courses: CourseDataById[] = [];

  course: CourseDataById | null = null;

  files: File | null = null; // Single file object
  imageUrl: string | null = null; // For existing image URL

  docs: File | null = null;
  video: File | null = null; // Single file object


  courseId: string | null = null; // Class property to hold courseId
  detailsId: string | null = null; // Add this property at the top of your component

  constructor(
    private courseService: CourseService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private modalService: NgbModal,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.courseId = localStorage.getItem("courseId");
    this.fetchCourseDetails(this.courseId);

    this.addCourseDetailsForm = this.fb.group({
      name: ["", Validators.required],
      video_url: ["", Validators.required],
      status: ["", Validators.required],
    });

    this.addObjective();
  }

  // Get the course_objective FormArray
  get courseObjectives(): FormArray {
    return this.editCourseForm.get("course_objective") as FormArray;
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



  fetchCourseDetails(courseId: any): void {
    this.courseService.fetchCourseDetails(courseId).subscribe({
      next: (response) => {
        console.log("Course details:", response);
        this.course = response.data;
      },
      error: (error) => {
        console.error("Error fetching course details:", error);
      },
    });
  }
  

  getEmbedUrl(videoUrl: string): SafeResourceUrl {
    const videoId = this.getYouTubeVideoId(videoUrl);
    const embedUrl = `https://www.youtube.com/embed/${videoId}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  }

  // Extract the video ID from YouTube URL
  private getYouTubeVideoId(url: string): string {
    const match = url.match(/[?&]v=([a-zA-Z0-9_-]+)/);
    return match ? match[1] : ""; // return video ID or empty string
  }

  getTrustedUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }



  openEditCourse(
    content: TemplateRef<NgbModal>,
    courseData: CourseDataById
  ): void {
    
    this.editCourseForm = this.fb.group({
      name: [courseData.name, Validators.required],
      description: [courseData.description, Validators.required],
      course_objective: this.fb.array([]), // FormArray for course objectives
      status: [courseData.status === 1 ? "true" : "false", Validators.required],
    });


    this.modalService.open(content, { scrollable: true });
  }


  // convertUrlToFile(imageUrl: string, fileName: string): Promise<File> {
  //   return fetch(imageUrl)
  //     .then(async (response) => {
  //       if (!response.ok) {
  //         throw new Error(`HTTP error! Status: ${response.status}`);
  //       }
  //       const blob = await response.blob();
  
  //       // Determine file extension from MIME type
  //       const mimeType = blob.type; // Get MIME type (e.g., "image/png", "image/jpeg")
  //       const extension = mimeType.split("/")[1]; // Extract extension (png, jpg, etc.)
  //       const validExtensions = ["png", "jpeg", "jpg", "gif", "webp"]; // Add more if needed
  
  //       if (!validExtensions.includes(extension)) {
  //         throw new Error(`Unsupported file format: ${mimeType}`);
  //       }
  
  //       // Append correct file extension to the file name
  //       const finalFileName = fileName.includes(".") ? fileName : `${fileName}.${extension}`;
  
  //       // Create file
  //       const file = new File([blob], finalFileName, { type: mimeType });
  //       this.files = file; // Store file
  //       return file;
  //     })
  //     .catch((error) => {
  //       console.error("Error converting URL to file:", error);
  //       return null as any;
  //     });
  // }
  

  openEditDetails(
    content: TemplateRef<NgbModal>,
    details: CourseDetailById
  ): void {
    this.detailsId = details.id; // Store the details id

    this.addCourseDetailsForm = this.fb.group({
      name: [details.name, Validators.required],
      video_url: [details.video_url, Validators.required],
      status: [details.status === 1 ? "true" : "false", Validators.required],
    });


    this.modalService.open(content, { scrollable: true });
  }

  openAddDetails(content: TemplateRef<NgbModal>): void {
    this.modalService.open(content, { scrollable: true });
  }

  resetForm() {
    this.addCourseDetailsForm.reset({
      name: "",
      video_url: "",
      status: "",
    });
    this.editCourseForm.reset({
      name: "",
      description: "",
      status: "",
      // course_objective: "",
    });
    this.files = null;
  }
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
    this.imageUrl = null; // Clear existing image URL when a new file is uploaded
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

  createCourseDetails(): void {
    if (this.addCourseDetailsForm.valid) {
      const formData = new FormData();

      // Add scalar values
      formData.append("name", this.addCourseDetailsForm.value.name);
      formData.append("video_url", this.addCourseDetailsForm.value.video_url);
      formData.append("status", this.addCourseDetailsForm.value.status);
      if (this.courseId) {
        formData.append("course_id", this.courseId);
      }

      // Add course_objective as a stringified JSON

      if (this.files) {
        formData.append("course_details_img", this.files); // Single file for course image
      }

      if (this.video) {
        formData.append("course_details_video", this.video); // Single file for course image
      }

  
      this.courseService.createCourseDetails(formData).subscribe({
        next: (response) => {
          console.log("response of adding course details - ", response);
          if (response.success) {
            this.resetForm();
            this.files = null;
          } else {
            console.error("Failed to fetch data:", response.message);
          }
        },
        error: (error) => {
          console.error("Error fetching admin list:", error);
        },
        complete: () => {
          console.log("Admin list fetch completed.");
        },
      });
    }
  }

  onSubmitEditCourse(): void {
    if (this.editCourseForm.valid) {
      const formData = new FormData();

      // Add scalar values
      formData.append("name", this.editCourseForm.value.name);
      formData.append("description", this.editCourseForm.value.description);
      formData.append("status", this.editCourseForm.value.status);
      if (this.courseId) {
        formData.append("id", this.courseId);
      }

      if (this.files) {
        formData.append("course_img", this.files); // Single file for course image
      }
      
      if (this.docs) {
        formData.append("course_document", this.docs); // Single file for course image
      }

      // Send POST request

      this.courseService.updateCourse(formData).subscribe({
        next: (response) => {
          console.log("response of course update  - ", response);
          if (response.success) {
            this.showMessage();
            this._success.subscribe(() => (this.show = true));
            this._success.pipe(debounceTime(3000)).subscribe(() => {
              if (this.updateSuccessAlert) {
                this.updateSuccessAlert.close();
              }
            });

            this.resetForm();
            this.files = null;

          } else {
            console.error("Failed to fetch data:", response.message);
          }
        },
        error: (error) => {
          console.error("Error fetching admin list:", error);
        },
        complete: () => {
          this.fetchCourseDetails(this.courseId);
          console.log("Admin list fetch completed.");
        },
      });
    }
  }

  public showMessage() {
    this._success.next("");
  }
  editDetails(): void {
    if (this.addCourseDetailsForm.valid) {
      const formData = new FormData();

      // Add scalar values
      formData.append("name", this.addCourseDetailsForm.value.name);
      formData.append("video_url", this.addCourseDetailsForm.value.video_url);
      formData.append("status", this.addCourseDetailsForm.value.status);

      if (this.courseId) {
        formData.append("course_id", this.courseId);
      }
      if (this.detailsId) {
        formData.append("id", this.detailsId);
      }

      // Add course_objective as a stringified JSON

      if (this.files) {
        formData.append("course_details_img", this.files); // Single file for course image
      }

      this.courseService.updateCourseDetails(formData).subscribe({
        next: (response) => {
          console.log("response of adding course details - ", response);
          if (response.success) {
            this.resetForm();
            this.files = null;
           
          } else {
            console.error("Failed to update details:", response.message);
          }
        },
        error: (error) => {
          console.error("Error updating details:", error);
        },
        complete: () => {
          this.fetchCourseDetails(this.courseId);
          console.log("Course details updated successfully!...");
        },
      });
    }
  }


  onRemoveVideo(event: any) {
    this.video = null;
  }
  onSelectVideo(event: any): void {
    if (event.addedFiles && event.addedFiles.length > 0) {
      this.video = event.addedFiles[0]; // Store only the first selected file
    }
  }

}
