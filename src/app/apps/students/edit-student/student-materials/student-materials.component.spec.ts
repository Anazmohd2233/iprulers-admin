import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentMaterialsComponent } from './student-materials.component';

describe('StudentMaterialsComponent', () => {
  let component: StudentMaterialsComponent;
  let fixture: ComponentFixture<StudentMaterialsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentMaterialsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentMaterialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
