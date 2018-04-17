import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import * as mapboxgl from  'mapbox-gl';
import { environment } from '../environments/environment';

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
  //Current position
  lat:number = 0;
  lon:number = 0;
  //Parking position
  parkLat:number = 0;
  parkLon:number = 0;
  marker;

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
    this.buildMap();
    this.setInitalMarkers();
    this.setListeners();
  }

  buildMap() {
    Object.getOwnPropertyDescriptor(mapboxgl, "accessToken").set(environment.mapbox.accessToken);
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v9',
      zoom: 16
    });
  }

  //Check if we already parked the car before.
  setInitalMarkers() {
    this.parkLat = +localStorage.getItem(this.PARK_LAT);
    this.parkLon = +localStorage.getItem(this.PARK_LON);
    if (this.parkLat!=0 && this.parkLon!=0) {
      this.marker = new mapboxgl.Marker().setLngLat([this.parkLon, this.parkLat]).addTo(this.map);
    }
  }

  // Set map listeners and controllers
  setListeners() {
    // Add Marker on longpress 
    this.map.on('contextmenu', (event) => {
      this.park(event.lngLat.lat, event.lngLat.lng);
    })
    this.map.addControl(new mapboxgl.GeolocateControl({
      positionOptions: {
          enableHighAccuracy: true
      },
      trackUserLocation: true
    }));
  }

  //update map with current position
  updateLocation() {
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(position => {
        this.location = position.coords;
        this.lat = position.coords.latitude;
        this.lon = position.coords.longitude;
        this.map.flyTo({
          center: [this.lon, this.lat]
        })
      });
   }
  }

  //set a marker on params position or current postion if no params
  park(lat?, lon?) {
    //remove the old marker
    if (this.marker!=null) {
      this.marker.remove();
    }
    if (lat==null && lon==null) { 
      this.parkLat = this.lat;
      this.parkLon = this.lon;
    } else { 
      this.parkLat = lat;
      this.parkLon = lon;    
    }
    //save the park position in localStorage
    localStorage.setItem(this.PARK_LAT, this.parkLat.toString());
    localStorage.setItem(this.PARK_LON, this.parkLon.toString());
    // add custom marker
    //var el = document.createElement('div');
    //el.innerHTML="<img src=\"./assets/img/park.png\"/>";
    // make a marker for each feature and add to the map
    //this.marker = new mapboxgl.Marker(el).setLngLat([this.parkLon, this.parkLat]).addTo(this.map);
    //add standard marker 
    this.marker = new mapboxgl.Marker().setLngLat([this.parkLon, this.parkLat]).addTo(this.map);
  }
}
