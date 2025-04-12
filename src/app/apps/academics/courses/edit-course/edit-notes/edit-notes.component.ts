
import { Component, ComponentFactoryResolver, EventEmitter, Input, OnInit, Output, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';
import { UserProfileService } from 'src/app/core/service/user.service';
import { Admin } from '../../../materials/models/model';
import { Column } from '../../../materials/advanced-table/advanced-table.component';
import { SortEvent } from '../../../materials/advanced-table/sortable.directive';
import { CourseService } from 'src/app/core/service/course.service';

@Component({
  selector: 'app-edit-notes',
  templateUrl: './edit-notes.component.html',
  styleUrls: ['./edit-notes.component.scss']
})

export class EditNotesComponent implements OnInit {
  @Input() courseID: any | null = null;

  pageTitle: BreadcrumbItem[] = [];
   records: Admin[] = [];
  columns: Column[] = [];
  pageSizeOptions: number[] = [10, 25, 50, 100];

   noteList: any[] = [];

 
  totalCount: number = 0;
  limit: number = 0;

  page: number = 1;
  tableName:string="notes";

  constructor(private userService: UserProfileService,    private courseService: CourseService,
  ) {}
  
  ngOnInit(): void {
     this.getCourseById();
    this.initTableCofig();
  }

  /**
   * fetches table records
   */
  getCourseById(): void {
    // this.records = tableData;


    this.courseService.getCourseById(this.courseID).subscribe({
      next: (response) => 
        {
        if (response.success) {
          this.noteList = response.data.notes;
          this.records = this.noteList;
          this.totalCount = response.data.total_count;
          this.limit = response.data.limit;
        } else {
          console.error('Failed to fetch data:', response.message);
        }
      },
      error: (error) => {
        console.error('Error fetching notes:', error);
      },
      complete: () => {
        // Optionally handle the completion logic here
        console.log('Notes fetch completed.');
      }
    });
    
  }

  
 

  /**
   * initialize advanced table columns
   */
  initTableCofig(): void {
    this.columns = [
     
      {
        name: 'notes',
        label: 'Notes',
        formatter: (record: any) => record.title,
        width: 1100,
      },
      {
        name: '',
        label: '',
        formatter: () => '', 
        width: 100
      },
    
    ];
  }

  openCourses(record: Admin) {
    console.log('Courses for', record);
    // Your logic here
  }

  // compares two cell values
  compare(v1: string | number, v2: string | number): any {
    return v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
  }

  /**
   * Sort the table data
   * @param event column name, sort direction
   */
  onSort(event: SortEvent): void {
    if (event.direction === '') {
      this.records = this.noteList;
    } else {
      this.records = [...this.records].sort((a, b) => {
        const res = this.compare(a[event.column], b[event.column]);
        return event.direction === 'asc' ? res : -res;
      });
    }
  }

  /**
 * Table Data Match with Search input
 * @param tables Table field value fetch
 * @param term Search the value
 */
  matches(tables: Admin, term: string) {
    return tables.name.toLowerCase().includes(term)
      || tables.phone.toLowerCase().includes(term)
      || tables.email.toLowerCase().includes(term)
      || String(tables.gender).includes(term)
      // || tables.date.toLowerCase().includes(term)
      // || tables.salary.toLowerCase().includes(term);
  }

  /**
   * Search Method
  */
  searchData(searchTerm: string): void {
    if (searchTerm === '') {
      this.getCourseById();
    }
    else {
      let updatedData = this.noteList;

      //  filter
      updatedData = updatedData.filter(record => this.matches(record, searchTerm));
      this.records = updatedData;
    }

  }


 

}




