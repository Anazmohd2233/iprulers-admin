import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { VideoUploadComponent } from './video-upload/video-upload.component';




const routes: Routes = [
  
  {
    path: 'videos',
    component: VideoUploadComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VideoRoutingModule { }
