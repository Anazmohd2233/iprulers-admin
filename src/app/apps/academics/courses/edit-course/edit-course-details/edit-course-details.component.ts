import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Select2Data } from 'ng-select2-component';

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
  files: File[] = [];

  projectName: string = '';
  projectOverview: string = '';
  projectStartDate: string = '';
  projectEndDate: string = '';
  projectBudget: number = 0;
  submitted: boolean = false;



  @ViewChild('newProject', { static: true }) newProject!: NgForm;

  constructor(
    private sanitizer: DomSanitizer
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

  /**
   *  adds new file in uploaded files
   */
  onSelect(event: any) {
    this.files.push(...event.addedFiles);
  }

  /**
   *   removes file from uploaded files
   */
  onRemove(event: any) {
    this.files.splice(this.files.indexOf(event), 1);
  }

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


}
