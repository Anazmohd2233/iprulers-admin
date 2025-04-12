import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbModal, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { SortableOptions } from 'sortablejs';

type PersonCard = {
  name: string;
  avatar: string;
  title: string;
}

@Component({
  selector: 'app-edit-modules',
  templateUrl: './edit-modules.component.html',
  styleUrls: ['./edit-modules.component.scss']
})


export class EditModulesComponent implements OnInit {
      @Input() courseID: any | null = null;
  
  addModuleForm!: FormGroup;
  addSessionForm!: FormGroup;
  files: File | null = null; // Single file object




  isCollapsed: boolean = true;
  multiCollapsed1: boolean = true;
  multiCollapsed2: boolean = true;
  collapsed4: boolean = true;
  time!: NgbTimeStruct;


  modules = [
    {
      id: 1,
      name: 'Module name 1 ',
      content: 'This is the content of Module 1...'
    },
    {
      id: 2,
      name: 'Module name 2',
      content: 'This is the content of Module 2...'
    },
    {
      id: 3,
      name: 'Module name 3',
      content: 'This is the content of Module 3...'
    }
  ];

  personList1: PersonCard[] = [];
  options1: SortableOptions = {};

  

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
        private sanitizer: DomSanitizer,
    


  ) { }

  ngOnInit(): void {

    this.time = { hour: 0, minute: 0, second: 0 };

    this.addModuleForm = this.fb.group({
      module_title: ["", Validators.required],

    });

    this.addSessionForm = this.fb.group({
      session_title: ["", Validators.required],


    });

    this.options1 = {
      group: 'container2',
      handle: '.dragula-handle',
    }

    this.personList1 = [
      { avatar: 'assets/images/users/avatar-1.jpg', name: 'Session 1', title: '1 hr 30min' },
      { avatar: 'assets/images/users/avatar-2.jpg', name: 'Session 2', title: '1 hr 30mint' },
      { avatar: 'assets/images/users/avatar-3.jpg', name: 'Session 3', title: '1 hr 30min' }
    ];
  }

  onEditModule(id: number): void {
    console.log('Edit clicked for module', id);
    // Add your modal trigger or logic here
  }
  
  onDeleteModule(id: number): void {
    if (confirm('Are you sure you want to delete this module?')) {
      console.log('Deleted module', id);
      // Perform delete logic here
    }
  }
  onSubmitAddModule(){
    console.log('module add function')
  }

  onSubmitAddSession(){
    console.log('session add function')
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
