import { Component, OnInit, TemplateRef } from '@angular/core';


// data
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { BannerService } from "src/app/core/service/banner.service";
import { Banner, Course } from '../../chat/banner/banner.module';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';
import { formatDate } from '@angular/common';
import { CourseService } from 'src/app/core/service/course.service';
import { EventsService } from 'src/app/core/service/events.service';
import { Event } from './get_model_event';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit {

  events: any[] = [];
    courses: Course[] = [];
    pageTitle: BreadcrumbItem[] = [];
  
    courseId: string | null = null; // Class property to hold courseId
    eventId: string | null = null; // Class property to hold courseId
  
    page: number = 1; // Class property to hold courseId

    files: File | null = null; // Single file object
  
    addEventForm!: FormGroup;
  
    editEventForm!: FormGroup;
  
  
    constructor(
      private http: HttpClient,
      private sanitizer: DomSanitizer,
      private modalService: NgbModal,
      private fb: FormBuilder,
      private eventService: EventsService,
      private courseService: CourseService,
  
    ) {this.fetchCourse()}
  
    ngOnInit(): void {
      this.pageTitle = [
        { label: "Apps", path: "/" },
        { label: "Chat", path: "/", active: true },
      ];
  
      this.courseId = localStorage.getItem("courseId");
  
  
      this._fetchData();
  
      this.intializeForms();
  
    }

    private intializeForms(): void {
      this.addEventForm = this.fb.group({
        name: ["", Validators.required],  // Event Name
        title: ["", Validators.required], // Event Title
        venue_time: ["", Validators.required], // Venue Time
        venue_date: ["", Validators.required], // Venue Date
        description: ["", Validators.required], // Description
        status: ["", Validators.required], // Status (true/false)
        course_id: ["", Validators.required], // Course ID
        user_joined_max: ["", Validators.required], // Max Users (optional)
        location: ["", Validators.required], // Location (optional)
        conductor_name: ["", Validators.required], // Conductor Name (optional)
        conductor_phone: ["", Validators.required], // Conductor Phone (optional)
      });
    
      
    }
  
    private _fetchData(): void {
  
      this.eventService.getEvents(this.page).subscribe({
        next: (response) => {
          console.log("Banners:", response);
          this.events = response.data.event_list;
        },
        error: (error) => {
          console.error("Error fetching banners:", error);
        },
      });
    }
    getEmbedUrl(videoUrl: string): SafeResourceUrl {
      const videoId = this.getYouTubeVideoId(videoUrl);
      const embedUrl = `https://www.youtube.com/embed/${videoId}`;
      return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
    }
  
    // Extract the video ID from YouTube URL
    private getYouTubeVideoId(url: string): string {
      const match = url.match(/[?&]v=([a-zA-Z0-9_-]+)/);
      return match ? match[1] : ""; // return video ID or empty string
    }
  
    getTrustedUrl(url: string): SafeResourceUrl {
      return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
  
    open(content: TemplateRef<NgbModal>): void {
      this.modalService.open(content, { scrollable: true });
    }
  
    openEdit(content: TemplateRef<NgbModal>, event:Event): void {
  
      this.eventId = event.id;
      this.editEventForm = this.fb.group({

        name: [event.name, Validators.required],  // Event Name
        title: [event.title, Validators.required], // event. Title
        venue_time: [event.time, Validators.required], // Venue Time
        venue_date: [event.date, Validators.required], // Venue Date
        description: [event.content, Validators.required], // Description
        status: [event.status === 1 ? "true" : "false", Validators.required],
        course_id: [event.course.id, Validators.required], // Course ID
        user_joined_max: [event.max_user, Validators.required], // Max Users (optional)
        location: [event.location, Validators.required], // Location (optional)
        conductor_name: [event.conductor_name, Validators.required], // Conductor Name (optional)
        conductor_phone: [event.conductor_phone, Validators.required], // Conductor Phone (optional)
      });
      this.modalService.open(content, { scrollable: true });
    }
    onRemoveFile(event: any) {
      // this.files.splice(this.files.indexOf(event), 1);
      this.files = null; // Clear the file
    }
    onSelectImage(event: any): void {
      if (event.addedFiles && event.addedFiles.length > 0) {
        this.files = event.addedFiles[0]; // Store only the first selected file
      }
    }
    
  
    resetForm() {
      this.addEventForm.reset();
      
      this.editEventForm.reset();
      this.files = null;
    }
    getSize(f: File) {
      const bytes = f.size;
      if (bytes === 0) {
        return "0 Bytes";
      }
      const k = 1024;
      const dm = 2;
      const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
    }
  
    /**
     * returns preview url of uploaded file
     */
    getPreviewUrlImg(f: File) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(
        encodeURI(URL.createObjectURL(f))
      );
    }
  
  
    createEvent(): void {
      if (this.addEventForm.valid) {
     
        const formatTime = (time: string): string => {
          return time.length === 5 ? `${time}:00` : time; // Ensure hh:mm:ss format
        };
        const formatDateForSubmission = (date: string): string => {
          if (!date) return ""; // Handle empty date input
        
          // Split the input string "05-05-2025" into day, month, and year
          const parts = date.split("-");
          if (parts.length !== 3) return ""; // Ensure valid format
        
          const day = parts[0].padStart(2, '0'); // Ensure two-digit day
          const month = parts[1].padStart(2, '0'); // Ensure two-digit month
          const year = parts[2]; // Full year (2025)
        
          return `${year}-${month}-${day}`; // Returns "2025-05-05"
        };
        
        // Example Usage
        console.log(formatDateForSubmission("05-05-2025")); // Output: "2025-05-05"
        
        
        const formData = new FormData();
  
        // Add scalar values
        formData.append("name", this.addEventForm.value.name);
        formData.append("title", this.addEventForm.value.title);
        formData.append("venue_time", formatTime(this.addEventForm.value.venue_time)); // Ensure hh:mm:ss format
        formData.append("venue_date", this.addEventForm.value.venue_date);
        formData.append("description", this.addEventForm.value.description);
        formData.append("status", this.addEventForm.value.status);
        formData.append("course_id", this.addEventForm.value.course_id);
        formData.append("user_joined_max", this.addEventForm.value.user_joined_max);
        formData.append("location", this.addEventForm.value.location );
        formData.append("conductor_name", this.addEventForm.value.conductor_name);
        formData.append("conductor_phone", this.addEventForm.value.conductor_phone);
      
     
        if (this.files) {
          formData.append("img", this.files); // Single file for course image
        }
       
  
        console.log('formData',formData)
  
        this.eventService.createEvents(formData).subscribe({
          next: (response) => {
            console.error("Event created succesfully");
              if (response.success) {
                this.resetForm();
                this.files = null;
               
              } else {
                console.error("Failed to create event:", response.message);
              }
            },
            error: (error) => {
              console.error("Error create events:", error);
            },
            complete: () => {
              this._fetchData();
              console.log("Event successfully created!...");
            },
          });
  
      }else{
        console.log('not valid')
      }
    }
  
    
    updateEvent(): void {
      if (this.editEventForm.valid) {
        const formatTime = (time: string): string => {
          return time.length === 5 ? `${time}:00` : time; // Ensure hh:mm:ss format
        };
        const formData = new FormData();
    // Add scalar values
    formData.append("name", this.editEventForm.value.name);
    formData.append("title", this.editEventForm.value.title);
    formData.append("venue_time", formatTime(this.editEventForm.value.venue_time)); // Ensure hh:mm:ss format
    formData.append("venue_date", this.editEventForm.value.venue_date);
    formData.append("description", this.editEventForm.value.description);
    formData.append("status", this.editEventForm.value.status);
    formData.append("course_id", this.editEventForm.value.course_id);
    formData.append("user_joined_max", this.editEventForm.value.user_joined_max);
    formData.append("location", this.editEventForm.value.location );
    formData.append("conductor_name", this.editEventForm.value.conductor_name);
    formData.append("conductor_phone", this.addEventForm.value.conductor_phone);
  
 
    if (this.files) {
      formData.append("img", this.files); // Single file for course image
    }
    if(this.eventId){
      formData.append("id", this.eventId);
    }
      this.eventService.updateEvents(formData).subscribe({
        next: (response) => {
          if (response.success) {
            console.error("Event updated succesfully");

           
          } else {
            console.error("Failed to updated event:", response.message);
          }
        },
        error: (error) => {
          console.error("Error updated events:", error);
        },
        complete: () => {
          this._fetchData();
          console.log("Event successfully updated!...");
        },
      });
    }
    }

    fetchCourse(): void {

      this.courseService.getCourses(this.page).subscribe({
        next: (response) => {
          if (response.success) {
            this.courses = response.data.courses;

          } else {
            console.error('Failed to fetch data:', response.message);
          }
        },
        error: (error) => {
          console.error('Error fetching admin list:', error);
        },
        complete: () => {
          console.log('Admin list fetch completed.');
        }
      });

    }
    convertTo12HourFormat(timeString: string): string {
      // Create a Date object in UTC by appending 'Z' (which signifies UTC time)
      const time = new Date(`1970-01-01T${timeString}Z`);
  
      // Use the UTC hours, minutes, and seconds methods to avoid local timezone adjustments
      const hours = time.getUTCHours();
      const minutes = time.getUTCMinutes();
      const seconds = time.getUTCSeconds();
  
      // Format the time in 12-hour AM/PM format
      const formattedTime = this.formatTo12Hour(hours, minutes, seconds);
      return formattedTime;
    }
  
    private formatTo12Hour(hours: number, minutes: number, seconds: number): string {
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = hours % 12 || 12; // Convert to 12-hour format
      const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
      // const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
  
      return `${formattedHours}:${formattedMinutes} ${ampm}`;
    }

}
