import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditModulesComponent } from './edit-modules.component';

describe('EditModulesComponent', () => {
  let component: EditModulesComponent;
  let fixture: ComponentFixture<EditModulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditModulesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditModulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
