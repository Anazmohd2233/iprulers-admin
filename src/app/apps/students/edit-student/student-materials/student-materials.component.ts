

import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';


// data
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { FormArray, FormBuilder,Validators } from "@angular/forms";
import { DomSanitizer } from "@angular/platform-browser";
import { Router } from "@angular/router";

import { StudentService } from 'src/app/core/service/student/student.service';
import { MaterialService } from 'src/app/core/service/material/material.service';

@Component({
  selector: 'app-student-materials',
  templateUrl: './student-materials.component.html',
  styleUrls: ['./student-materials.component.scss']
})

export class StudentMaterialsComponent implements OnInit {

    @Input() studentID: any | null = null;

    assignMaterialForm!: FormGroup;


  materialList: any[] = [];
  studentMaterial: any[] = [];



  page:number = 1;

  ribbons = [
    {
      name: "CCIE EI v1.1 DOO-1 Section 2",
      img: "assets/images/sample.jpg",
      ribbon: { name: "Expired", color: "danger", direction: "left" }
    },
    {
      name: "CCIE EI v1.1 DOO-1 Section 3",
      img: "assets/images/sample2.jpg",
      ribbon: { name: "New", color: "success", direction: "right" }
    }
  ];
  

  constructor(
    private http: HttpClient,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private studentService: StudentService,
        private materialService: MaterialService,
    

  ) {}

  ngOnInit(): void {
    this.assignMaterialForm = this.fb.group({
      material: ["", Validators.required],
    });

    if (this.studentID) {
      this.fetchStudentDetails(this.studentID);
      this.getMaterials();
    }

  }

 

  assignMaterial(): void {
    if (this.assignMaterialForm.valid) {
      const formData = new FormData();

      // Add scalar values
      formData.append("material", this.assignMaterialForm.value.material);
      formData.append("id", this.studentID);

      this.studentService.assignCourseOrMaterials(formData).subscribe({
        next: (response) => {
          console.log("response of assign materials - ", response);
          if (response.success) {
            this.assignMaterialForm.reset();
            this.fetchStudentDetails(this.studentID);

          } else {
            console.error("Failed to assign materials:", response.message);
          }
        },
        error: (error) => {
          console.error("Error assign materials:", error);
        },
        complete: () => {
          console.log("material assign successfully!...");
        },
      });
    }else{
      console.log('material adding form not validated')
    }
  }

  getMaterials(): void {

    this.materialService.getMaterial(this.page).subscribe({
      next: (response) => 
        {console.log('response of material list - ',response)
        if (response.success) {
          this.materialList = response.data.material;
          console.log('Materials:', this.materialList);
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
  
  fetchStudentDetails(id: any): void {
    this.studentService.getStudentById(id).subscribe({
      next: (response) => {
        if (response.success) {
          this.studentMaterial = response.data.materials;
          console.log("studentList", this.studentMaterial);
        } else {
          console.error("Failed to fetch data:", response.message);
        }
      },
      error: (error) => {
        console.error("Error fetching admin list:", error);
      },
      complete: () => {
        // Optionally handle the completion logic here
        console.log("Admin list fetch completed.");
      },
    });
  }


}


