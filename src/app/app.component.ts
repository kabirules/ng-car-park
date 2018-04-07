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
  renderMarker:boolean=false;

  PARK_LAT:string = 'parkLAT';
  PARK_LON:string = 'parkLON';

  constructor() {
  }

  ngOnInit() {
    // Check current location every 5s
    Observable.interval(5000).subscribe(x => {
      this.updateLocation();
    });
    //Check if we already parked the car before
    this.lat = +localStorage.getItem(this.PARK_LAT);
    this.lon = +localStorage.getItem(this.PARK_LON);
    if (this.lat!=null && this.lon!=null) {
      this.renderMarker = true;
    }
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

  park() {
    //save the current position in localStorage
    localStorage.setItem(this.PARK_LAT, this.lat.toString());
    localStorage.setItem(this.PARK_LON, this.lon.toString());
    //make sure the marker is rendered
    this.renderMarker=true;
  }
}
