import { LightningElement,wire,track } from 'lwc';
import getBoatTypes from '@salesforce/apex/BoatDataService.getBoatTypes';
import NAME_BOAT from '@salesforce/schema/Boat__c.Name';
// imports
// import getBoatTypes from the BoatDataService => getBoatTypes method';
//Name, Length, Price, and Description fields.
export default class BoatSearchForm extends LightningElement {
    selectedBoatTypeId = '';
    
    // Private
    error = undefined;
    
    @track searchOptions;
    
    // Wire a custom Apex method
    @wire(getBoatTypes)
    boatTypes({ error, data }) {
      if (data) {
        this.searchOptions = data.map(type => {
          // TODO: complete the logic
          //type.label
          //type.value
          //console.log(type);
          return {label: type.Name,value: type.Id};

        });
        this.searchOptions.unshift({ label: 'All Types', value: '' });
      } else if (error) {
        this.searchOptions = undefined;
        this.error = error;
      }
    }
    
    // Fires event that the search option has changed.
    // passes boatTypeId (value of this.selectedBoatTypeId) in the detail
    handleSearchOptionChange(event) {
      // Create the const searchEvent
      // searchEvent must be the new custom event search
      this.selectedBoatTypeId = event.detail.value;

      //console.log(event.detail.value);
      const searchEvent = new CustomEvent('search',{
        detail: {boatTypeId: this.selectedBoatTypeId}
      });


      this.dispatchEvent(searchEvent);
    }
  }
  