import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideoUploadComponent } from './video-upload/video-upload.component';
import { VideoRoutingModule } from './video-routing.module';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';



@NgModule({
  declarations: [
    VideoUploadComponent
  ],
  imports: [
    CommonModule,
    VideoRoutingModule,
        NgxDropzoneModule,
          FormsModule,
          ReactiveFormsModule,
              NgbPaginationModule,
          

        
    
  ]
})
export class VideosModule { }
