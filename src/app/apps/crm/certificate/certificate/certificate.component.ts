import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';


import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';
import { UserProfileService } from 'src/app/core/service/user.service';

import { Column } from 'src/app/apps/users/advanced-table/advanced-table.component';
import { SortEvent } from 'src/app/shared/advanced-table/sortable.directive';
import { CertificateService } from 'src/app/core/service/certificate.service';
import { CertificateListItem } from './fetch_cert_model';

@Component({
  selector: 'app-certificate',
  templateUrl: './certificate.component.html',
  styleUrls: ['./certificate.component.scss']
})
export class CertificateComponent implements OnInit {

  
    pageTitle: BreadcrumbItem[] = [];
     records: CertificateListItem[] = [];
    columns: Column[] = [];
    pageSizeOptions: number[] = [10, 25, 50, 100];
  
     certificateLists: CertificateListItem[] = [];
  
     tableName:string="certificateTable";

    totalCount: number = 0;
    limit: number = 0;
  
    constructor(private certificateService: CertificateService) {}
    
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
  
  
      this.certificateService.fetchCertificates(1).subscribe({
        next: (response) => 
          {console.log('response of certificate - ',response)
          if (response.success) {
            this.certificateLists = response.data.certificateList;
            this.records = this.certificateLists;
            this.totalCount = response.data.total_count;
            this.limit = response.data.limit;
            console.log('certicates:', this.certificateLists);
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
          formatter: (record: CertificateListItem) => record.user_name,
          width: 245,
        },
        {
          name: 'phone',
          label: 'Phone',
          formatter: (record: CertificateListItem) => record.user_phone,
          width: 250,
        },
        {
          name: 'email',
          label: 'Email',
          formatter: (record: CertificateListItem) => record.user_email,
          width: 250
        },
        {
          name: 'gender',
          label: 'Gender',
          formatter: (record: CertificateListItem) => record.user_gender,
        },
        {
          name: 'payment',
          label: 'Payment',
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
  
    openCourses(record: CertificateListItem) {
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
        this.records = this.certificateLists;
      } else {
        console.log('onsort event direction have values')
        // this.records = [...this.records].sort((a, b) => {
        //   const res = this.compare(a[event.column], b[event.column]);
        //   return event.direction === 'asc' ? res : -res;
        // });
      }
    }
  
    /**
   * Table Data Match with Search input
   * @param tables Table field value fetch
   * @param term Search the value
   */
    // matches(tables: CertificateListItem, term: string) {
    //   return tables.user_name.toLowerCase().includes(term)
    //     || tables.user_phone.toLowerCase().includes(term)
    //     || tables.user_email.toLowerCase().includes(term)
    //     || String(tables.gender).includes(term)
    //     // || tables.date.toLowerCase().includes(term)
    //     // || tables.salary.toLowerCase().includes(term);
    // }
  
    /**
     * Search Method
    */
    searchData(searchTerm: string): void {
      if (searchTerm === '') {
        this._fetchData();
      }
      else {
        let updatedData = this.certificateLists;
  
        //  filter
        // updatedData = updatedData.filter(record => this.matches(record, searchTerm));
        this.records = updatedData;
      }
  
    }
  
  
   
}
