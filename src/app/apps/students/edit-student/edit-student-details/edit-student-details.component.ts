import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Select2Data } from 'ng-select2-component';

type selectedMember = {
  id: number;
  name: string;
  image: string;
}
@Component({
  selector: 'app-edit-student-details',
  templateUrl: './edit-student-details.component.html',
  styleUrls: ['./edit-student-details.component.scss']
})
export class EditStudentDetailsComponent implements OnInit {

  level: Select2Data = [];
  selectedMembers: selectedMember[] = [];
  files: File | null = null; // Single file object

  projectName: string = '';
  projectOverview: string = '';
  projectStartDate: string = '';
  projectEndDate: string = '';
  projectBudget: number = 0;
  submitted: boolean = false;

  chnagePasswordForm!: FormGroup;





  @ViewChild('newProject', { static: true }) newProject!: NgForm;

  constructor(
    private sanitizer: DomSanitizer,
    private modalService: NgbModal,

  ) { }

  ngOnInit(): void {

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
  onSubmit(): void {
    this.newProject.form.reset();
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
  onChangePassword(){
    console.log('*********password changed******')
  }



}
