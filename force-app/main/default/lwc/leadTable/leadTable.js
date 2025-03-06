import { LightningElement, wire, track } from 'lwc';
import getEnrollmentLeads from '@salesforce/apex/LeadController.getEnrollmentLeads';
import convertLead from '@salesforce/apex/LeadController.convertLead';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class LeadTable extends LightningElement {
    @track leads = [];

    columns = [
        { label: 'Lead Name', fieldName: 'Name', type: 'text' },
        { label: 'Course', fieldName: 'Course__c', type: 'text' },
        {
            type: 'button',
            fixedWidth: 100,
            typeAttributes: {
                label: 'Allot',
                name: 'allot',
                variant: 'brand'
            }
        }
    ];

    @wire(getEnrollmentLeads)
    wiredLeads({ error, data }) {
        if (data) {
            this.leads = data;
        } else if (error) {
            console.error('Error fetching leads:', error);
        }
    }

    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;

        if (actionName === 'allot') {
            convertLead({ leadId: row.Id })
                .then(() => {
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Success',
                            message: `Lead ${row.Name} converted successfully!`,
                            variant: 'success'
                        })
                    );

                    // Refresh the list to remove the converted lead
                    return refreshApex(this.wiredLeads);
                })
                .catch(error => {
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Error',
                            message: 'Lead conversion failed.',
                            variant: 'error'
                        })
                    );
                    console.error('Error converting lead:', error);
                });
        }
    }
}
