import { Component, OnInit, TemplateRef } from "@angular/core";

// type
import { BreadcrumbItem } from "../../shared/page-title/page-title.model";
import { ChatUser } from "./shared/chat.model";

// data
import { USERS } from "./shared/data";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Banner, BannerListResponse } from "./banner/banner.module";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { BannerService } from "src/app/core/service/banner.service";

@Component({
  selector: "app-chat",
  templateUrl: "./chat.component.html",
  styleUrls: ["./chat.component.scss"],
})
export class ChatComponent implements OnInit {
  banners: Banner[] = [];

  pageTitle: BreadcrumbItem[] = [];

  courseId: string | null = null; // Class property to hold courseId
  bannerId: string | null = null; // Class property to hold courseId


  files: File | null = null; // Single file object

  addBannerForm!: FormGroup;

  editBannerForm!: FormGroup;


  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private bannerService: BannerService,

  ) {}

  ngOnInit(): void {
    this.pageTitle = [
      { label: "Apps", path: "/" },
      { label: "Chat", path: "/", active: true },
    ];

    this.courseId = localStorage.getItem("courseId");


    this._fetchData();

    this.addBannerForm = this.fb.group({
      headline: ["", Validators.required],
      paragraph: ["", Validators.required],
      status: ["", Validators.required],
      bannerType: ["", Validators.required],
    });

  }

  private _fetchData(): void {

    this.bannerService.getBanners().subscribe({
      next: (response) => {
        console.log("Banners:", response);
        this.banners = response.data.banner;
      },
      error: (error) => {
        console.error("Error fetching banners:", error);
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

  open(content: TemplateRef<NgbModal>): void {
    this.modalService.open(content, { scrollable: true });
  }

  openEdit(content: TemplateRef<NgbModal>, banner:Banner): void {

    this.bannerId = banner.id;
    this.editBannerForm = this.fb.group({
      headline: [banner.headline, Validators.required],
      paragraph: [banner.paragraph, Validators.required],
      status: [banner.status === 1 ? "true" : "false", Validators.required],
      bannerType: [banner.bannerType, Validators.required],
    });
    this.modalService.open(content, { scrollable: true });
  }
  onRemoveFile(event: any) {
    // this.files.splice(this.files.indexOf(event), 1);
    this.files = null; // Clear the file
  }
  onSelectImage(event: any): void {
    if (event.addedFiles && event.addedFiles.length > 0) {
      this.files = event.addedFiles[0]; // Store only the first selected file
    }
  }

  resetForm() {
    this.addBannerForm.reset({
      headline: "",
      paragraph: "",
      status: "",
      bannerType: "",
    });
    this.editBannerForm.reset({
      headline: "",
      paragraph: "",
      status: "",
      bannerType: "",
    });
    this.files = null;
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
  

  createBanner(): void {
    if (this.addBannerForm.valid) {
      const formData = new FormData();

      // Add scalar values
      formData.append("headline", this.addBannerForm.value.headline);
      formData.append("paragraph", this.addBannerForm.value.paragraph);
      formData.append("status", this.addBannerForm.value.status);
      formData.append("bannerType", this.addBannerForm.value.bannerType);
    
      // Add course_objective as a stringified JSON

      if (this.files) {
        formData.append("img", this.files); // Single file for course image
      }

      

        this.bannerService.createBanner(formData).subscribe({
          next: (response) => {
            console.log("response of create banner - ", response);
            if (response.success) {
              this.resetForm();
              this.files = null;
             
            } else {
              console.error("Failed to create banner:", response.message);
            }
          },
          error: (error) => {
            console.error("Error creating banner:", error);
          },
          complete: () => {
            this._fetchData();
            console.log("Banner created successfully!...");
          },
        });

    }
  }

  
  updateBanner(): void {
    if (this.editBannerForm.valid) {
      const formData = new FormData();

      // Add scalar values
      formData.append("headline", this.editBannerForm.value.headline);
      formData.append("paragraph", this.editBannerForm.value.paragraph);
      formData.append("status", this.editBannerForm.value.status);
      formData.append("bannerType", this.editBannerForm.value.bannerType);


      if(this.courseId){
        formData.append("courseId", this.courseId);
      }

      if(this.bannerId){
        formData.append("id", this.bannerId);
      }

      // Add course_objective as a stringified JSON

      if (this.files) {
        formData.append("img", this.files); // Single file for course image
      }

    this.bannerService.updateBanner(formData).subscribe({
      next: (response) => {
        console.log("response of update banner - ", response);
        if (response.success) {
          this.resetForm();
          this.files = null;
         
        } else {
          console.error("Failed to update banner:", response.message);
        }
      },
      error: (error) => {
        console.error("Error updating banner:", error);
      },
      complete: () => {
        this._fetchData();
        console.log("Banner updated successfully!...");
      },
    });
  }
  }
}
