
import { Component, ComponentFactoryResolver, EventEmitter, Input, OnInit, Output, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';
import { SortEvent } from './advanced-table/sortable.directive';
import { UserProfileService } from 'src/app/core/service/user.service';
import { Admin } from './models/model';
import { Column } from './advanced-table/advanced-table.component';
import { MaterialService } from 'src/app/core/service/material/material.service';
@Component({
  selector: 'app-materials',
  templateUrl: './materials.component.html',
  styleUrls: ['./materials.component.scss']
})

export class MaterialsComponent implements OnInit {
  pageTitle: BreadcrumbItem[] = [];
   records: any[] = [];
  columns: Column[] = [];
  pageSizeOptions: number[] = [10, 25, 50, 100];

   materialList: any[] = [];

 
  totalCount: number = 0;
  limit: number = 0;

  page: number = 1;
  tableName:string="material";

  constructor(
    private materialService: MaterialService,

  ) {}
  
  ngOnInit(): void {
     this.getMaterial();
    this.initTableCofig();
  }

  getMaterial(): void {

    this.materialService.getMaterial(this.page).subscribe({
      next: (response) => 
        {
        if (response.success) {
          this.materialList = response.data.material;
          this.records = this.materialList;
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
        name: 'type',
        label: 'Type',
        formatter: (record: any) => record.type,
        width: 50,
      },
      {
        name: 'name',
        label: 'Name',
        formatter: (record: any) => record.title,
        width: 900,
      },
      {
        name: 'action',
        label: 'Edit',
        formatter: () => '', 
        width: 200
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
      this.records = this.materialList;
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
      this.getMaterial();
    }
    else {
      let updatedData = this.materialList;

      //  filter
      updatedData = updatedData.filter(record => this.matches(record, searchTerm));
      this.records = updatedData;
    }

  }


 

}


