import { Component, OnInit } from '@angular/core';
import { User } from '../models/auth.models';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';
import { NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-edit-student',
  templateUrl: './edit-student.component.html',
  styleUrls: ['./edit-student.component.scss']
})
export class EditStudentComponent implements OnInit {

  student: User | null = null;
    pageTitle: BreadcrumbItem[] = [];
    tabs1: number = 1;
    tabs2: number = 2;
    tabs3: string = 'setting3';
    tabs4: string = 'home4';
    tabs5: number = 1;
    tabs6: number = 2;
    tabs7: number = 1;
    tabs8: number = 1;
    dynamicTabs: number[] = [1, 2, 3, 4, 5];
    counter: number = 0;

  constructor() { }

  ngOnInit(): void {

    this.student = {
      id: 1,
      username: 'johndoe',
      password: 'securepassword123',
      firstName: 'John',
      lastName: 'Doe',
      name: 'John Doe',
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      email: 'johndoe@example.com',
      avatar: 'assets/images/users/avatar-1.jpg',  // ✅ correct relative path

      location: 'New York, USA',
      title: 'johndoe@gmail.com'
    };
    this.counter = this.dynamicTabs.length + 1;
  }

  /**
     * prevents opening of tab
     * @param changeEvent navchange event
     */
    onNavChange(changeEvent: NgbNavChangeEvent) {
      if (changeEvent.nextId === 3) {
        changeEvent.preventDefault();
      }
    }
  
    /**
     * closes tab
     * @param event event
     * @param toRemove remove index
     */
    close(event: MouseEvent, toRemove: number) {
      this.dynamicTabs = this.dynamicTabs.filter((id: number) => id !== toRemove);
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  
    /**
     * add new tab
     * @param event event
     */
    add(event: MouseEvent) {
      this.dynamicTabs.push(this.counter++);
      event.preventDefault();
    }
    

}
