import { Component, OnInit, SimpleChanges, TemplateRef } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { ToastUtilService } from "../../toaster/toasterUtilService";
import { CategoryService } from "src/app/core/service/category/category.service";
import { VideosService } from "src/app/core/service/videos/videos.service";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { AdvancedTableServices } from "./advanced-table-service.service";

@Component({
  selector: "app-video-upload",
  templateUrl: "./video-upload.component.html",
  styleUrls: ["./video-upload.component.scss"],
})
export class VideoUploadComponent implements OnInit {
  selectedVideo: any = null; // null = add mode
  isSubmitting: boolean = false;
  modalRef!: NgbModalRef;
  files: File | null = null;
  page: number = 1;
  videos: any[] = [];
  selectedItem: any = null; // null = add mode
  pagination: boolean = true;
  showExtraInput = false;

  addVideoForm!: FormGroup;

  constructor(
    private modalService: NgbModal,
    private toaster: ToastUtilService,
    private videoService: VideosService,
    private sanitizer: DomSanitizer,
    private fb: FormBuilder,
    public service: AdvancedTableServices
  ) {}

  ngOnInit(): void {
    this.getVideos();

    this.addVideoForm = this.fb.group({
      name: ["", Validators.required],
      description: ["", Validators.required],
      link: [""],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    // this.paginate();

    if (changes["selectedVideo"] || changes["service.page"]) {
      this.paginate();
    }
  }

  get form1() {
    return this.addVideoForm.controls;
  }

  paginate(): void {
    this.getVideos();
  }

  searchData(searchTerm: string): void {
    console.log("searchTerm - " + searchTerm);
    if (searchTerm === "") {
      this.getVideos();
      console.log("no search terms");
    } else {
      this.getVideos(searchTerm);
    }
  }

  open(content: TemplateRef<NgbModal>, category?: any): void {
    this.selectedVideo = category || null;

    if (this.selectedVideo) {
      this.addVideoForm.patchValue({
        name: this.selectedVideo.name,
        description: this.selectedVideo.description,
        link: this.selectedVideo.vimeo_url,
      });

      // optionally preload image preview if editing
    } else {
      this.addVideoForm.reset();
      this.files = null;
    }

    this.modalRef = this.modalService.open(content, { scrollable: true });
  }

  uploadVideo(): void {
    if (this.addVideoForm.valid) {
      this.isSubmitting = true;

      const formData = new FormData();
      formData.append("name", this.addVideoForm.value.name);

      formData.append("description", this.addVideoForm.value.description);

      if (this.addVideoForm.value.link) {
        formData.append("link", this.addVideoForm.value.link);
      }

      if (this.files) {
        formData.append("file", this.files);
      }

      if (this.selectedVideo) {
        // 📝 Edit Mode

        this.videoService
          .updateVideos(this.selectedVideo.id, formData)
          .subscribe({
            next: (response) => {
              if (response.success) {
                this.toaster.success("Updated", response.message);
                this.getVideos();
                this.files = null;
                this.addVideoForm.reset();
                this.modalRef.close();
                this.isSubmitting = false;
                this.showExtraInput = false;
              } else {
                this.isSubmitting = false;

                this.toaster.warn("Alert", response.message);
              }
            },
            error: () => {
              this.toaster.error("Error", "Something went wrong.");
              this.isSubmitting = false;
            },
          });
      } else {
        formData.append("folderId", "videos");
        if (this.files) {
          this.uploadToVimeo(this.files, formData);
        } else {
          this.uploadVimeoWithLink(formData);
        }
      }
    } else {
      this.toaster.warn("Alert", "Please fill all mandatory fields..!");
    }
  }

  async uploadToVimeo(file: File, formData: FormData): Promise<void> {
    const accessToken = "8f9039fdab0632a7b282ab905f63bb99"; // ⚠️ Store this securely

    const createRes = await fetch("https://api.vimeo.com/me/videos", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        Accept: "application/vnd.vimeo.*+json;version=3.4",
      },
      body: JSON.stringify({
        upload: {
          approach: "tus",
          size: file.size,
        },
        name: this.addVideoForm.value.name,
        description: this.addVideoForm.value.description,
      }),
    });

    if (!createRes.ok) throw new Error("Failed to create Vimeo upload session");
    const data = await createRes.json();
    const uploadLink = data.upload.upload_link;
    const videoUri = data.uri;
    const fullLink = data.link;

    const arrayBuffer = await file.arrayBuffer();

    const patchRes = await fetch(uploadLink, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/offset+octet-stream",
        "Upload-Offset": "0",
        "Tus-Resumable": "1.0.0",
      },
      body: arrayBuffer,
    });

    if (!patchRes.ok) throw new Error("Failed to upload file to Vimeo");

    const videoId = videoUri.split("/").pop();
    const videoUrl = `https://vimeo.com/${videoId}`;

    // console.log("videoUrl *****", videoUrl);
    // console.log("fullLink *****", fullLink);

    formData.append("link", fullLink);
    formData.delete("file");

    this.uploadVimeoWithLink(formData);
  }

  private uploadVimeoWithLink(formData: FormData): void {
    this.videoService.createVideos(formData).subscribe({
      next: (response) => {
        if (response.success) {
          this.isSubmitting = false;

          this.toaster.success("Created", response.message);
          this.getVideos();
          this.files = null;
          this.showExtraInput = false;

          this.addVideoForm.reset();
          this.modalRef.close();
        } else {
          this.isSubmitting = false;

          this.toaster.warn("Alert", response.message);
        }
      },
      error: () => {
        this.toaster.error("Error", "Something went wrong.");
        this.isSubmitting = false;
      },
    });
  }

  private getVideos(search?: any): void {
    this.videoService.getVideos(this.service.page, search).subscribe({
      next: (response) => {
        if (response.success) {
          this.videos = response.data.video;

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
          console.error("Failed to load videos:", response.message);
        }
      },
      error: (error) => {
        console.error("API error:", error);
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

  openVideo(content: TemplateRef<any>, item: any): void {
    this.selectedItem = item || null;
    this.modalRef = this.modalService.open(content, { scrollable: false });
  }

  // get embedUrl(): SafeResourceUrl | null {
  //   if (!this.selectedItem?.vimeo_url) return null;

  //   const videoId = this.selectedItem.vimeo_url.split("/").pop();
  //   const embedLink = `https://player.vimeo.com/video/${videoId}?autoplay=1`;

  //   return this.sanitizer.bypassSecurityTrustResourceUrl(embedLink);
  // }
  get embedUrl(): SafeResourceUrl | null {
    if (!this.selectedItem?.vimeo_url) return null;

    const parts = this.selectedItem.vimeo_url.split("/");
    const videoId = parts[3]; // e.g., 1084348300
    const privacyHash = parts[4]; // e.g., 48af14dca4

    const embedLink = `https://player.vimeo.com/video/${videoId}?h=${privacyHash}&autoplay=1`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(embedLink);
  }

  deleteVideo(): void {
    this.isSubmitting = true;

    if (this.selectedVideo) {
      this.videoService.deleteVideo(this.selectedVideo.id).subscribe({
        next: (response) => {
          if (response.success) {
            this.isSubmitting = false;

            this.toaster.success("Deleted", response.message);
            this.getVideos();
            this.modalRef.close();
          } else {
            this.isSubmitting = false;

            this.toaster.warn("Alert", response.message);
          }
        },
        error: () => {
          this.toaster.error("Error", "Something went wrong.");
          this.isSubmitting = false;
        },
      });
    } else {
      this.toaster.warn("Alert", "Enexpected error occured , contact admin");
    }
  }
  openAlertModal(
    content: TemplateRef<NgbModal>,
    variant: string,
    category: any
  ): void {
    this.selectedVideo = category;
    this.modalRef = this.modalService.open(content, {
      size: "sm",
      modalDialogClass: "modal-filled bg-" + variant,
    });
  }
}
