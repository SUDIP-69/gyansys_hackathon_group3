import { LightningElement, track } from 'lwc';
import createCourse from '@salesforce/apex/CourseController.createCourse';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getDomainOptions from '@salesforce/apex/CourseController.getDomainOptions';

export default class AddCourse extends LightningElement {
    @track name = '';
    @track price = '';
    @track duration = '';
    @track domain = '';
    @track professional = false;
    @track description = '';
    @track pictureUrl = '';
    @track domainOptions = [];

    connectedCallback() {
        this.loadDomainOptions();
    }

    loadDomainOptions() {
        getDomainOptions()
            .then(result => {
                this.domainOptions = result;
            })
            .catch(error => {
                console.error('Error loading domain options:', error);
                this.showToast('Error', 'Failed to load domain options.', 'error');
            });
    }

    handleChange(event) {
        const field = event.target.dataset.field;
        this[field] = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    }

    handleSubmit() {
        if (!this.name || !this.price || !this.duration || !this.domain) {
            this.showToast('Error', 'Please fill all required fields.', 'error');
            return;
        }

        createCourse({
            name: this.name,
            price: parseFloat(this.price),
            duration: parseInt(this.duration, 10),
            domain: this.domain,
            professional: this.professional,
            description: this.description,
            pictureUrl: this.pictureUrl
        })
            .then(() => {
                this.showToast('Success', 'Course added successfully!', 'success');
                this.resetForm();
            })
            .catch(error => {
                console.error('Error:', error);
                this.showToast('Error', 'Failed to add course.', 'error');
            });
    }

    showToast(title, message, variant) {
        this.dispatchEvent(new ShowToastEvent({ title, message, variant }));
    }

    resetForm() {
        this.name = '';
        this.price = '';
        this.duration = '';
        this.domain = '';
        this.professional = false;
        this.description = '';
        this.pictureUrl = '';
    }
}
