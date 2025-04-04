import { Component, Input, OnInit } from '@angular/core';
import { User } from '../../models/auth.models';
// types

@Component({
  selector: 'app-profile-userbox',
  templateUrl: './userbox.component.html',
  styleUrls: ['./userbox.component.scss']
})
export class UserboxComponent implements OnInit {

  @Input() student: User | null = null;

  constructor () { }

  ngOnInit(): void {
  }

}
