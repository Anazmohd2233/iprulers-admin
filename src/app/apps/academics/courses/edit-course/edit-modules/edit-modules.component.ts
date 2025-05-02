import { Component, Input, OnInit, TemplateRef } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";

import {
  NgbModal,
  NgbModalRef,
  NgbTimeStruct,
} from "@ng-bootstrap/ng-bootstrap";
import { SortableOptions } from "sortablejs";
import { ToastUtilService } from "src/app/apps/toaster/toasterUtilService";
import { CourseService } from "src/app/core/service/course/course.service";
import { VideosService } from "src/app/core/service/videos/videos.service";


@Component({
  selector: "app-edit-modules",
  templateUrl: "./edit-modules.component.html",
  styleUrls: ["./edit-modules.component.scss"],
})
export class EditModulesComponent implements OnInit {
  @Input() courseID: any | null = null;

  addModuleForm!: FormGroup;
  addSessionForm!: FormGroup;
  files: File | null = null; // Single file object
  modalRef!: NgbModalRef;
  selectedModule: any = null; // null = add mode
  selectedSession: any = null; // null = add mode
  selectedItem: any = null; // null = add mode
  

  modules: any[] = [];

  isCollapsed: boolean = true;
  multiCollapsed1: boolean = true;
  multiCollapsed2: boolean = true;
  collapsed4: boolean = true;
  time!: NgbTimeStruct;
  isSubmitting: boolean = false;
  videos: any[] = [];
  page:number = 1;




  sortableOptionsMap: { [moduleId: number]: SortableOptions } = {};


  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private sanitizer: DomSanitizer,
    private toaster: ToastUtilService,
    private courseService: CourseService,
    private videoService: VideosService,

    
  ) {

    // this.options = {
    //   onUpdate: (event: any) => {
    //     this.postChangesToServer(event);
    //   }
    // };
  }


  ngOnInit(): void {
    this.getModule();
    this.getVideos();

    this.time = { hour: 0, minute: 0, second: 0 };

    this.addModuleForm = this.fb.group({
      module_title: ["", Validators.required],
    });

    this.addSessionForm = this.fb.group({
      session_title: ["", Validators.required],
      duration: this.fb.control({ hour: 0, minute: 0, second: 0 }),
      video: ["", Validators.required],

    });


  }

  options: SortableOptions  = {
    group: "container2",
    handle: ".dragula-handle",
  };


  
  private getVideos(): void {
    this.videoService.getVideos('all').subscribe({
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
  postChangesToServer(event:any,module:any):void{

    console.log('module',module)

    const sessionId = event.item?.getAttribute('data-session-id');

    console.log('Dragged session ID:', sessionId);
    console.log('event old..........',event.oldIndex)
    console.log('event new..........',event.newIndex)
    console.log('postChangesToServer worling ..........')

    const formData = new FormData();
    formData.append("session_id", sessionId);
    formData.append("old_index", event.oldIndex.toString());
    formData.append("new_index", event.newIndex.toString());

    formData.append("module_id", module.id.toString());


    this.courseService.updateSessionOrder(formData).subscribe({
      next: (response) => {
        if (response.success) {
          this.toaster.success("Success", response.message);
        } else {
          this.toaster.warn("Alert", response.message);
        }
      },
      error: () => this.toaster.error("Error", "Something went wrong."),
    });

  }

  onSubmitAddModule() {
    if (this.addModuleForm.valid) {
      this.isSubmitting = true;

      const formData = new FormData();
      formData.append("module_title", this.addModuleForm.value.module_title);
      formData.append("course_id", this.courseID);

      if (!this.selectedModule) {
        this.courseService.createModule(formData).subscribe({
          next: (response) => {
            if (response.success) {
              this.isSubmitting = false;

              this.toaster.success("Success", response.message);
              this.getModule();

              this.addModuleForm.reset();
              this.modalRef.close();
            } else {
              this.isSubmitting = false;

              this.toaster.warn("Alert", response.message);
            }
          },
          error: () => {this.toaster.error("Error", "Something went wrong.")
            this.isSubmitting = false;

          }
        });
      } else {
        formData.append("module_id", this.selectedModule.id);

        this.courseService.updateModule(formData).subscribe({
          next: (response) => {
            if (response.success) {
              this.toaster.success("Success", response.message);
              this.getModule();
              this.isSubmitting = false;

              this.addModuleForm.reset();
              this.modalRef.close();
            } else {
              this.isSubmitting = false;

              this.toaster.warn("Alert", response.message);
            }
          },
          error: () => {this.toaster.error("Error", "Something went wrong.")
            this.isSubmitting = false;

          }
        });
      }
    } else {
      this.toaster.warn("Alert", "Please fill all mandatory fields..!");
    }
  }

  onSubmitAddSession() {
    if (this.addSessionForm.valid) {
      this.isSubmitting = true;

      const formData = new FormData();

      const data = this.addSessionForm.value;
      if (data.duration) {
        const hour = data.duration.hour;
        const minute = data.duration.minute;
        const second = data.duration.second;

        formData.append("hour", hour);
        formData.append("minute", minute);
        formData.append("seconds", second);
      } else {
        this.toaster.warn("Alert", "Please fill all duration fields..!");
        this.isSubmitting = false;
        return;
      }

      if (this.selectedModule) {
        formData.append("module_id", this.selectedModule.id);
      }

      formData.append("session_title", data.session_title);
      formData.append("video", data.video);



      if (!this.selectedSession) {
        this.courseService.createSession(formData).subscribe({
          next: (response) => {
            if (response.success) {
              this.isSubmitting = false;
              this.toaster.success("Success", response.message);
              this.getModule();

              this.addSessionForm.reset();
              this.modalRef.close();
              this.files = null;
            } else {
              this.isSubmitting = false;
              this.toaster.warn("Alert", response.message);
            }
          },
          error: () => {
            this.toaster.error("Error", "Something went wrong.")
            this.isSubmitting = false;
          }
        });
      } else {
        formData.append("session_id", this.selectedSession.id);

        this.courseService.updateSession(formData).subscribe({
          next: (response) => {
            if (response.success) {
              this.isSubmitting = false;

              this.toaster.success("Success", response.message);
              this.getModule();
              this.addSessionForm.reset();
              this.modalRef.close();
            } else {
              this.isSubmitting = false;

              this.toaster.warn("Alert", response.message);
            }
          },
          error: () => {this.toaster.error("Error", "Something went wrong.")
            this.isSubmitting = false;

          }
        });
      }
    } else {
      this.toaster.warn("Alert", "Please fill all mandatory fields..!");
    }
  }

  openModule(content: TemplateRef<NgbModal>, module?: any): void {
    this.selectedModule = module || null;

    if (this.selectedModule) {
      this.addModuleForm.patchValue({
        module_title: this.selectedModule.module_title,
      });
    } else {
      this.addModuleForm.reset();
    }
    this.modalRef = this.modalService.open(content, { scrollable: true });
  }

  openSession(
    content: TemplateRef<NgbModal>,
    session?: any,
    module?: any
  ): void {
    this.files = null;
    this.selectedSession = session || null;
    this.selectedModule = module || null;

    if (this.selectedSession) {
      this.addSessionForm.patchValue({
        session_title: this.selectedSession.session_title,
        duration: {
          hour: +this.selectedSession.hour,
          minute: +this.selectedSession.minute,
          second: +this.selectedSession.seconds,
        },
        video: this.selectedSession.videos.id,

      });
    } else {
      this.addSessionForm.reset();
    }
    this.modalRef = this.modalService.open(content, { scrollable: true });
  }

 
  private getModule(): void {
    this.courseService.getModule(this.courseID).subscribe({
      next: (response) => {
        if (response.success) {
          this.modules = response.data.modules;
          this.modules.forEach(module => {
            this.sortableOptionsMap[module.id] = {
              group: 'sessionGroup',
              handle: '.dragula-handle',
              onUpdate: (event: any) => {
                this.postChangesToServer(event, module);
              }
            };
          });
          
        } else {
          console.error("Failed to load module:", response.message);
        }
      },
      error: (error) => {
        console.error("API error:", error);
      },
    });
  }



  openSessionDelete(
    content: TemplateRef<NgbModal>,
    variant: string,
    session: any
  ): void {
    this.selectedSession = session;
    this.modalRef = this.modalService.open(content, {
      size: "sm",
      modalDialogClass: "modal-filled bg-" + variant,
    });
  }

  openModuleDelete(
    content: TemplateRef<NgbModal>,
    variant: string,
    module: any
  ): void {
    this.selectedModule = module;
    this.modalRef = this.modalService.open(content, {
      size: "sm",
      modalDialogClass: "modal-filled bg-" + variant,
    });
  }

  deleteSession(): void {
    if (this.selectedSession) {
      this.isSubmitting = true;

      this.courseService.deleteSession(this.selectedSession.id).subscribe({
        next: (response) => {
          if (response.success) {
            this.isSubmitting = false;

            this.toaster.success("Deleted", response.message);
            this.getModule();
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
  deleteModule(): void {
    if (this.selectedModule) {
      this.isSubmitting = true;

      this.courseService.deletModule(this.selectedModule.id).subscribe({
        next: (response) => {
          if (response.success) {
            this.isSubmitting = false;

            this.toaster.success("Deleted", response.message);
            this.getModule();
            this.modalRef.close();
          } else {
            this.isSubmitting = false;

            this.toaster.warn("Alert", response.message);
          }
        },
        error: () => {this.toaster.error("Error", "Something went wrong.")
          this.isSubmitting = false;

        }
      });
    } else {
      this.toaster.warn("Alert", "Enexpected error occured , contact admin");
    }
  }



  onSessionReorder02(module: any) {
    if (!module || !Array.isArray(module.sessions)) return;

    const reorderedSessions = module.sessions
      .map((session: any, index: number) => {
        if (!session || !session.id) return null;
        return {
          id: session.id,
          sort_order: index,
        };
      })
      .filter(Boolean); // Removes any null entries

    console.log("module idddddddd", module.id);
    console.log("module reorderedSessionsssssssss", reorderedSessions);

    this.courseService
      .updateSessionOrder({
        module_id: module.id,
        order: reorderedSessions,
      })
      .subscribe({
        next: (res) =>
          this.toaster.success("Reordered", "Session order updated"),
        error: () =>
          this.toaster.error("Error", "Failed to update session order"),
      });
  }

  openVideo(content: TemplateRef<any>, item: any): void {
    this.selectedItem = item || null;
    this.modalRef = this.modalService.open(content, { scrollable: false });
  }
  get embedUrl(): SafeResourceUrl | null {
    if (!this.selectedItem?.videos?.vimeo_url) return null;

    const videoId = this.selectedItem?.videos?.vimeo_url.split('/').pop();
    const embedLink = `https://player.vimeo.com/video/${videoId}?autoplay=1`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(embedLink);
  }
}
