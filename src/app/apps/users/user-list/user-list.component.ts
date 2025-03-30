import { Component, ComponentFactoryResolver, EventEmitter, Input, OnInit, Output, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';


import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';
import { AdvancedTable } from './advanced.model';
import { Column } from '../advanced-table/advanced-table.component';
import { SortEvent } from '../advanced-table/sortable.directive';
import { UserProfileService } from 'src/app/core/service/user.service';
import { Admin } from '../models/model';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  pageTitle: BreadcrumbItem[] = [];
   records: Admin[] = [];
  columns: Column[] = [];
  pageSizeOptions: number[] = [10, 25, 50, 100];

   adminList: Admin[] = [];

 
  totalCount: number = 0;
  limit: number = 0;

  page: number = 1;
  tableName:string="userList";

  constructor(private userService: UserProfileService) {}
  
  ngOnInit(): void {
    this.pageTitle = [{ label: 'Tables', path: '/' }, { label: 'Advanced Tables', path: '/', active: true }];
     this._fetchData();
    this.initTableCofig();
  }

  /**
   * fetches table records
   */
  _fetchData(): void {
    // this.records = tableData;


    this.userService.getUserList(this.page).subscribe({
      next: (response) => 
        {console.log('response of user list - ',response)
        if (response.success) {
          this.adminList = response.data.admin_list;
          this.records = this.adminList;
          this.totalCount = response.data.total_count;
          this.limit = response.data.limit;
          console.log('Admins:', this.adminList);
        } else {
          console.error('Failed to fetch data:', response.message);
        }
      },
      error: (error) => {
        console.error('Error fetching admin list:', error);
      },
      complete: () => {
        // Optionally handle the completion logic here
        console.log('Admin list fetch completed.');
      }
    });
    
  }

  /**
   * initialize advanced table columns
   */
  initTableCofig(): void {
    this.columns = [
      {
        name: 'name',
        label: 'Name',
        formatter: (record: Admin) => record.name,
        width: 245,
      },
      {
        name: 'phone',
        label: 'Phone',
        formatter: (record: Admin) => record.phone,
        width: 250,
      },
      {
        name: 'email',
        label: 'Email',
        formatter: (record: Admin) => record.email,
        width: 250
      },
      {
        name: 'gender',
        label: 'Gender',
        formatter: (record: Admin) => record.gender,
      },
      {
        name: 'action',
        label: 'Action',
        formatter: () => '',       },
     
      // {
      //   name: 'date',
      //   label: 'Date',
      //   formatter: (record: AdvancedTable) => record.date,
      // },
      // {
      //   name: 'salary',
      //   label: 'Salary',
      //   formatter: (record: AdvancedTable) => record.salary,

      // }
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
      this.records = this.adminList;
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
      this._fetchData();
    }
    else {
      let updatedData = this.adminList;

      //  filter
      updatedData = updatedData.filter(record => this.matches(record, searchTerm));
      this.records = updatedData;
    }

  }


 

}
