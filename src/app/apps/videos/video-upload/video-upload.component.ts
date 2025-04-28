import { Component, OnInit, TemplateRef } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { ToastUtilService } from "../../toaster/toasterUtilService";
import { CategoryService } from "src/app/core/service/category/category.service";
import { VideosService } from "src/app/core/service/videos/videos.service";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";

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


  addVideoForm!: FormGroup;

  constructor(
    private modalService: NgbModal,
    private toaster: ToastUtilService,
    private videoService: VideosService,
    private sanitizer: DomSanitizer,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {

    this.getVideos();

    this.addVideoForm = this.fb.group({
      name: ["", Validators.required],
      description: ["", Validators.required],
    });
  }

  get form1() {
    return this.addVideoForm.controls;
  }

  open(content: TemplateRef<NgbModal>, category?: any): void {
    this.selectedVideo = category || null;

    if (this.selectedVideo) {
      this.addVideoForm.patchValue({
        name: this.selectedVideo.name,
        description: this.selectedVideo.description,

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
        this.videoService.createVideos(formData).subscribe({
          next: (response) => {
            if (response.success) {
              this.isSubmitting = false;

              this.toaster.success("Created", response.message);
              this.getVideos();
              this.files = null;
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
    } else {
      this.toaster.warn("Alert", "Please fill all mandatory fields..!");
    }
  }

  private getVideos(): void {
    this.videoService.getVideos(this.page).subscribe({
      next: (response) => {
        if (response.success) {
          this.videos = response.data.video;

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

  get embedUrl(): SafeResourceUrl | null {
    if (!this.selectedItem?.vimeo_url) return null;

    const videoId = this.selectedItem.vimeo_url.split('/').pop();
    const embedLink = `https://player.vimeo.com/video/${videoId}?autoplay=1`;
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
        error: () => {this.toaster.error("Error", "Something went wrong.");
          this.isSubmitting = false;

        }
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
