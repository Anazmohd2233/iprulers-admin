import { Component, Input, OnInit, TemplateRef } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DomSanitizer } from "@angular/platform-browser";
import {
  NgbModal,
  NgbModalRef,
  NgbTimeStruct,
} from "@ng-bootstrap/ng-bootstrap";
import { SortableOptions } from "sortablejs";
import { ToastUtilService } from "src/app/apps/toaster/toasterUtilService";
import { CourseService } from "src/app/core/service/course/course.service";

type PersonCard = {
  name: string;
  avatar: string;
  title: string;
};

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
  modules: any[] = [];

  isCollapsed: boolean = true;
  multiCollapsed1: boolean = true;
  multiCollapsed2: boolean = true;
  collapsed4: boolean = true;
  time!: NgbTimeStruct;

  personList1: PersonCard[] = [];
  options1: SortableOptions = {};

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private sanitizer: DomSanitizer,
    private toaster: ToastUtilService,
    private courseService: CourseService
  ) {}

  ngOnInit(): void {
    this.getModule();
    this.time = { hour: 0, minute: 0, second: 0 };

    this.addModuleForm = this.fb.group({
      module_title: ["", Validators.required],
    });

    this.addSessionForm = this.fb.group({
      session_title: ["", Validators.required],
      duration: this.fb.control({ hour: 0, minute: 0, second: 0 }),
    });

    this.options1 = {
      group: "container2",
      handle: ".dragula-handle",
      onUpdate: (event: any) => {
        console.log('eventttttttttttt',event)
        const moduleIndex = event.from.getAttribute('data-module-index');
        console.log('moduleIndex',moduleIndex)

        if (moduleIndex !== null) {
          const updatedModule = this.modules[+moduleIndex];
          this.onSessionReorder(updatedModule);
        }
      }
    };

   
  }

  onEditModule(id: number): void {
    console.log("Edit clicked for module", id);
    // Add your modal trigger or logic here
  }

  onDeleteModule(id: number): void {
    if (confirm("Are you sure you want to delete this module?")) {
      console.log("Deleted module", id);
      // Perform delete logic here
    }
  }
  onSubmitAddModule() {
    if (this.addModuleForm.valid) {
      const formData = new FormData();
      formData.append("module_title", this.addModuleForm.value.module_title);
      formData.append("course_id", this.courseID);


      if (!this.selectedModule) {
        this.courseService.createModule(formData).subscribe({
          next: (response) => {
            if (response.success) {
              this.toaster.success("Success", response.message);
              this.getModule();

              this.addModuleForm.reset();
              this.modalRef.close();
            } else {
              this.toaster.warn("Alert", response.message);
            }
          },
          error: () => this.toaster.error("Error", "Something went wrong."),
        });
      } else {
        formData.append("module_id", this.selectedModule.id);

        this.courseService.updateModule(formData).subscribe({
          next: (response) => {
            if (response.success) {
              this.toaster.success("Success", response.message);
              this.getModule();

              this.addModuleForm.reset();
              this.modalRef.close();
            } else {
              this.toaster.warn("Alert", response.message);
            }
          },
          error: () => this.toaster.error("Error", "Something went wrong."),
        });
      }
    } else {
      this.toaster.warn("Alert", "Please fill all mandatory fields..!");
    }
  }

  onSubmitAddSession() {
    if (this.addSessionForm.valid) {
      const formData = new FormData();

      const data = this.addSessionForm.value;
      const { hour, minute, second } = data.duration;

      if (this.selectedModule) {
        formData.append("module_id", this.selectedModule.id);

      }

      formData.append("session_title", data.session_title);
      formData.append("hour", hour);
      formData.append("minute", minute);
      formData.append("seconds", second);

      if (this.files) {
        formData.append("video", this.files);
      }

      if (!this.selectedSession) {

        this.courseService.createSession(formData).subscribe({
          next: (response) => {
            if (response.success) {
              this.toaster.success("Success", response.message);
              this.getModule();

              this.addSessionForm.reset();
              this.modalRef.close();
            } else {
              this.toaster.warn("Alert", response.message);
            }
          },
          error: () => this.toaster.error("Error", "Something went wrong."),
        });
      } else {
        formData.append("session_id", this.selectedSession.id);

        this.courseService.updateSession(formData).subscribe({
          next: (response) => {
            if (response.success) {
              this.toaster.success("Success", response.message);
              this.getModule();
              this.addSessionForm.reset();
              this.modalRef.close();
            } else {
              this.toaster.warn("Alert", response.message);
            }
          },
          error: () => this.toaster.error("Error", "Something went wrong."),
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

  openSession(content: TemplateRef<NgbModal>, session?: any,module?:any): void {
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
      });
    } else {
      this.addSessionForm.reset();
    }
    this.modalRef = this.modalService.open(content, { scrollable: true });
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

  private getModule(): void {
    this.courseService.getModule(this.courseID).subscribe({
      next: (response) => {
        if (response.success) {
          this.modules = response.data.modules;
        } else {
          console.error("Failed to load module:", response.message);
        }
      },
      error: (error) => {
        console.error("API error:", error);
      },
    });
  }


  onSessionReorder(updatedModule:any) {


    console.log('new orderrrrrrrrrrrrr',updatedModule)

    this.courseService.updateSessionOrder(updatedModule).subscribe({
      next: (response) => {
        if (response.success) {
          this.toaster.success("Success", response.message);
          this.getModule();
        } else {
          this.toaster.warn("Alert", response.message);
        }
      },
      error: () => this.toaster.error("Error", "Something went wrong."),
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


  deleteSession():void{

    if (this.selectedSession) {
      this.courseService.deleteSession(this.selectedSession.id).subscribe({
        next: (response) => {
          if (response.success) {
            this.toaster.success("Deleted", response.message);
            this.getModule();
            this.modalRef.close();
          } else {
            this.toaster.warn("Alert", response.message);
          }
        },
        error: () => this.toaster.error("Error", "Something went wrong."),
      });
    } else {
      this.toaster.warn("Alert", "Enexpected error occured , contact admin");
    }

  }
  deleteModule():void{

    if (this.selectedModule) {
      this.courseService.deletModule(this.selectedModule.id).subscribe({
        next: (response) => {
          if (response.success) {
            this.toaster.success("Deleted", response.message);
            this.getModule();
            this.modalRef.close();
          } else {
            this.toaster.warn("Alert", response.message);
          }
        },
        error: () => this.toaster.error("Error", "Something went wrong."),
      });
    } else {
      this.toaster.warn("Alert", "Enexpected error occured , contact admin");
    }

  }




  getSortableOptions(module: any) {
    return {
      group: 'container2',
      handle: '.dragula-handle',
      onUpdate: (event: any) => {
        this.onSessionReorder(module);
      }
    };
  }

  onSessionReorder02(module: any) {
    if (!module || !Array.isArray(module.sessions)) return;

    const reorderedSessions = module.sessions
      .map((session: any, index: number) => {
        if (!session || !session.id) return null;
        return {
          id: session.id,
          sort_order: index + 1,
        };
      })
      .filter(Boolean); // Removes any null entries

    console.log('module idddddddd',module.id)
    console.log('module reorderedSessionsssssssss',reorderedSessions)

  
    this.courseService.updateSessionOrder({
      module_id: module.id,
      order: reorderedSessions,
    }).subscribe({
      next: (res) => this.toaster.success("Reordered", "Session order updated"),
      error: () => this.toaster.error("Error", "Failed to update session order"),
    });
  }
  
}
