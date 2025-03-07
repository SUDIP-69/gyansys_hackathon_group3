import { LightningElement, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import getUserDetails from '@salesforce/apex/UserProfileController.getUserDetails';
import getEnrollmentCount from '@salesforce/apex/UserProfileController.getEnrollmentCount';
import hasRaisedCase from '@salesforce/apex/UserProfileController.hasRaisedCase';

export default class ProfilePage extends NavigationMixin(LightningElement) {
    firstName;
    lastName;
    email;
    phone;
    enrollmentCount;
    caseRaised = false;

    @wire(getUserDetails)
    wiredUser({ error, data }) {
        if (data) {
            this.firstName = data.FirstName;
            this.lastName = data.LastName;
            this.email = data.Email;
            this.phone = data.Phone;
        } else if (error) {
            console.error('Error fetching user data:', error);
        }
    }

    @wire(getEnrollmentCount)
    wiredEnrollments({ error, data }) {
        if (data !== undefined) {
            this.enrollmentCount = data;
        } else {
            this.enrollmentCount = 0;
        }
    }

    @wire(hasRaisedCase)
    wiredCases({ error, data }) {
        if (data !== undefined) {
            this.caseRaised = data;
        }
    }

    // Navigate to Home
    navigateToHome() {
        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
                url: '/'
            }
        });
    }

    // Navigate to Support
    navigateToSupport() {
        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
                url: '/support'
            }
        });
    }

    // Logout User
    handleLogout() {
        window.location.href = '/secur/logout.jsp';
    }
}
