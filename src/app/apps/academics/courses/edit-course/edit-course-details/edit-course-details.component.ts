import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Select2Data } from 'ng-select2-component';
import { CourseService } from 'src/app/core/service/course.service';

type selectedMember = {
  id: number;
  name: string;
  image: string;
}
@Component({
  selector: 'app-edit-course-details',
  templateUrl: './edit-course-details.component.html',
  styleUrls: ['./edit-course-details.component.scss']
})
export class EditCourseDetailsComponent implements OnInit {

  level: Select2Data = [];
  selectedMembers: selectedMember[] = [];

  projectName: string = '';
  projectOverview: string = '';
  projectStartDate: string = '';
  projectEndDate: string = '';
  projectBudget: number = 0;
  submitted: boolean = false;

  files: File | null = null; // Single file object

  courseImageForm!: FormGroup;
  addCourseDetailsForm!: FormGroup;




  constructor(
    private sanitizer: DomSanitizer,
    private modalService: NgbModal,
    private fb: FormBuilder,
        private courseService: CourseService
    



  ) { }

  ngOnInit(): void {


    this.addCourseDetailsForm = this.fb.group({
      title: ['', Validators.required],
      card_title: ['', Validators.required],
      description: [''],
      duration: [''],
      level: [''],
      rating: [''],
      overview: [''],
    });
    

    this.level = [
      {
        value: 'beginner',
        label: 'Beginner',
      },
      {
        value: 'intermediate',
        label: 'Intermediate',
      },
      {
        value: 'advanced',
        label: 'Advanced',
      },
      
    ]
  }



  /**
   *  on project form submit
   */
  onSubmitCourseDetails(): void {
    if (this.addCourseDetailsForm.valid) {
      const formData = new FormData();
  
      // Append form values
      formData.append('title', this.addCourseDetailsForm.value.title);
      formData.append('card_title', this.addCourseDetailsForm.value.card_title);
      formData.append('description', this.addCourseDetailsForm.value.description);
      formData.append('duration', this.addCourseDetailsForm.value.duration);
      formData.append('level', this.addCourseDetailsForm.value.level);
      formData.append('rating', this.addCourseDetailsForm.value.rating);
      formData.append('overview', this.addCourseDetailsForm.value.overview);
  
      // Add image file if available
      if (this.files) {
        formData.append('course_img', this.files); // Assuming this.files holds a single File object
      }
  
      this.courseService.createCourse(formData).subscribe({
        next: (response) => {
          console.log('Response from createCourse:', response);
          if (response.success) {
            this.resetForm();
          } else {
            console.error('Failed to create course:', response.message);
          }
        },
        error: (error) => {
          console.error('Error creating course:', error);
        },
        complete: () => {
          console.log('Course created successfully!');
        }
      });
    } else {
      console.log('Form is not valid')
      this.addCourseDetailsForm.markAllAsTouched();
    }
  }
  resetForm() {
    this.addCourseDetailsForm.reset({
      title: '',
      card_title: '',
      description: '',
      duration: '',
      level: '',
      rating: '',
      overview: ''
    });
    this.files = null;
  }
  

  /**
   * returns member id
   */
  trackByItemID(index: number, member: selectedMember): number { return member.id; }


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
      return '0 Bytes';
    }
    const k = 1024;
    const dm = 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }


  /**
   * Returns the preview url
   */
  getPreviewUrl(f: File) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(encodeURI(URL.createObjectURL(f)));
  }

      open(content: TemplateRef<NgbModal>): void {
        console.log('**********')
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
  onChangeImage(){
    console.log('course image change')
  }
  

}
