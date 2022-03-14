import { LightningElement, wire,api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getBoatsByLocation from '@salesforce/apex/BoatDataService.getBoatsByLocation';

// imports
const LABEL_YOU_ARE_HERE = 'You are here!';
const ICON_STANDARD_USER = 'standard:user';
const ERROR_TITLE = 'Error loading Boats Near Me';
const ERROR_VARIANT = 'error';
export default class BoatsNearMe extends LightningElement {
  @api
  boatTypeId;
  mapMarkers = [];
  isLoading = true;
  isRendered;
  latitude;
  longitude;
  
  // Add the wired method from the Apex Class
  // Name it getBoatsByLocation, and use latitude, longitude and boatTypeId
  // Handle the result and calls createMapMarkers
  @wire(getBoatsByLocation,{latitude:'$latitude',longitude:'$longitude',boatTypeId:'$boatTypeId'})
  wiredBoatsJSON({error, data}) { 
    if (data) {
        createMapMarkers(data);
      } else if (error) {
        const evt = new ShowToastEvent({
            title: ERROR_TITLE,
            error: error.messsage,
            variant: ERROR_VARIANT,
        });
        this.dispatchEvent(evt);
      }
      this.isLoading = false;

  }
  
  // Controls the isRendered property
  // Calls getLocationFromBrowser()
  renderedCallback() { 
      if(!this.isRendered){
          this.getLocationFromBrowser();
      }
      this.isRendered = true;

  }
  
  // Gets the location from the Browser
  // position => {latitude and longitude}
  getLocationFromBrowser() { 
    //navigator.geolocation.getCurrentPosition(success, error, options);
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(position => {
            this.latitude = position.coords.latitude;
            this.longitude = position.coords.longitude;
        });
    }

  }
  
  // Creates the map markers

  createMapMarkers(boatData) {
    this.mapMarkers = boatData.map(rowBoat => {
    return {
    location: {
    Latitude: rowBoat.Geolocation__Latitude__s,
    Longitude: rowBoat.Geolocation__Longitude__s
    },
    title: rowBoat.Name,
    };
    });
    this.mapMarkers.unshift({
    location: {
    Latitude: this.latitude,
    Longitude: this.longitude
    },
    title: LABEL_YOU_ARE_HERE,
    icon: ICON_STANDARD_USER
    });
    this.isLoading = false;
    }




}
