import { Component, OnInit } from '@angular/core';

// types
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';

// data
import { CLIENTS } from './data';
import { Client } from '../../crm/shared/crm.model';

@Component({
  selector: 'app-crm-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class CRMClientsComponent implements OnInit {

  pageTitle: BreadcrumbItem[] = [];
  clients: Client[] = [];


  constructor () { }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'CRM', path: '/' }, { label: 'Clients List', path: '/', active: true }];
    this._fetchData();
  }

  /**
   * fetches order list
   */
  _fetchData(): void {
    this.clients = [...CLIENTS];
  }
}
