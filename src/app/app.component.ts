import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  location = {};
  lat:number = 0;
  lon:number = 0;

  constructor() {
  }

  ngOnInit() {
    Observable.interval(5000).subscribe(x => {
      this.updateLocation();
    });    
  }

  updateLocation() {
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(position => {
        this.location = position.coords;
        this.lat = position.coords.latitude;
        this.lon = position.coords.longitude;
      });
   }
  }
}
