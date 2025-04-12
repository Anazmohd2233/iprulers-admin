



import { Component, ComponentFactoryResolver, EventEmitter, Input, OnInit, Output, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';
import { UserProfileService } from 'src/app/core/service/user.service';
import { Admin } from '../../../materials/models/model';
import { Column } from '../../../materials/advanced-table/advanced-table.component';
import { SortEvent } from '../../../materials/advanced-table/sortable.directive';
import { CourseService } from 'src/app/core/service/course.service';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastUtilService } from 'src/app/apps/toaster/toasterUtilService';

@Component({
  selector: 'app-edit-lab',
  templateUrl: './edit-lab.component.html',
  styleUrls: ['./edit-lab.component.scss']
})

export class EditLabComponent implements OnInit {
  @Input() courseID: any | null = null;


   records: Admin[] = [];
  columns: Column[] = [];
  pageSizeOptions: number[] = [10, 25, 50, 100];

   labList: any[] = [];
   modalRef!: NgbModalRef;


 
  totalCount: number = 0;
  limit: number = 0;

  page: number = 1;
  tableName:string="labs";

  constructor(
    private courseService: CourseService,
    private toaster: ToastUtilService



  ) {}
  
  ngOnInit(): void {
     this.getCourseById();
    this.initTableCofig();
  }


  getCourseById(): void {

    this.courseService.getCourseById(this.courseID).subscribe({
      next: (response) => 
        {
        if (response.success) {
          this.labList = response.data.labs;
          this.records = this.labList;
          this.totalCount = response.data.total_count;
          this.limit = response.data.limit;
        } else {
          console.error('Failed to fetch data:', response.message);
        }
      },
      error: (error) => {
        console.error('Error fetching admin list:', error);
      },
      complete: () => {
        console.log('Lab list fetch completed.');
      }
    });
    
  }

  /**
   * initialize advanced table columns
   */
  initTableCofig(): void {
    this.columns = [
     
      {
        name: 'labs',
        label: 'Labs',
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
      this.records = this.labList;
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
      let updatedData = this.labList;

      //  filter
      updatedData = updatedData.filter(record => this.matches(record, searchTerm));
      this.records = updatedData;
    }

  }


 

}



