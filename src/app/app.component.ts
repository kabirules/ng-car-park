import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import * as mapboxgl from  'mapbox-gl';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

/*
glmapbox docs
https://github.com/Wykks/ngx-mapbox-gl/wiki/API-Documentation
How to set access token
https://stackoverflow.com/questions/44332290/mapbox-gl-typing-wont-allow-accesstoken-assignment#answer-44393954
Tutorial (events)
https://angularfirebase.com/lessons/build-realtime-maps-in-angular-with-mapbox-gl/
*/
export class AppComponent implements OnInit {

  location = {};
  lat:number = 0;
  lon:number = 0;
  parkLat:number = 0;
  parkLon:number = 0;
  renderMarker:boolean=false;

  PARK_LAT:string = 'parkLAT';
  PARK_LON:string = 'parkLON';

  map: mapboxgl.Map; // Mapbox GL Map object (Mapbox is ran outside angular zone, keep that in mind when binding events from this object)

  constructor() {
  }

  ngOnInit() {
    // Check current location every 5s
    Observable.interval(5000).subscribe(x => {
      this.updateLocation();
    });
    //Check if we already parked the car before.
    this.parkLat = +localStorage.getItem(this.PARK_LAT);
    this.parkLon = +localStorage.getItem(this.PARK_LON);
    if (this.parkLat!=0 && this.parkLon!=0) {
      this.renderMarker = true;
    }
    Object.getOwnPropertyDescriptor(mapboxgl, "accessToken").set('pk..oYdvq_XT79XIefBeuDNFVg');
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v9',
      zoom: 16,
      center: [this.lon, this.lat]
    });
    //// Add Marker on longpress
    this.map.on('contextMenu', (event) => {
      //const coordinates = [event.lngLat.lng, event.lngLat.lat]
      //const newMarker   = new GeoJson(coordinates, { message: this.message })
      //this.mapService.createMarker(newMarker)
    })    
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
    // set the current position as park position
    this.parkLat = this.lat;
    this.parkLon = this.lon;
    //save the park position in localStorage
    localStorage.setItem(this.PARK_LAT, this.parkLat.toString());
    localStorage.setItem(this.PARK_LON, this.parkLon.toString());
    //make sure the marker is rendered
    this.renderMarker=true;
  }
}
