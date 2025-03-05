import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import createUser from '@salesforce/apex/SignupController.createContact';

export default class SignupForm extends LightningElement {
    @track firstName = '';
    @track lastName = '';
    @track email = '';
    @track password = '';
    @track confirmPassword = '';

    handleInputChange(event) {
        this[event.target.dataset.field] = event.target.value;
    }

    handleSignup() {
        if (!this.firstName || !this.lastName || !this.email || !this.password || !this.confirmPassword) {
            this.showToast('Error', 'All fields are required.', 'error');
            return;
        }

        if (this.password !== this.confirmPassword) {
            this.showToast('Error', 'Passwords do not match.', 'error');
            return;
        }

        createUser({ firstName: this.firstName, lastName: this.lastName, email: this.email, password: this.password })
            .then(() => {
                this.showToast('Success', 'Account created successfully!', 'success');
                window.location.href = '/login';
            })
            .catch(error => {
                this.showToast('Error', error.body.message, 'error');
            });
    }

    showToast(title, message, variant) {
        this.dispatchEvent(new ShowToastEvent({ title, message, variant }));
    }
}
