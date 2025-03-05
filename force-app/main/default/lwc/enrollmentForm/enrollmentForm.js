import { LightningElement, track, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { createRecord } from 'lightning/uiRecordApi';
import COURSE_OBJECT from '@salesforce/schema/Course__c';
import LEAD_OBJECT from '@salesforce/schema/Lead';
import FIRST_NAME from '@salesforce/schema/Lead.FirstName';
import LAST_NAME from '@salesforce/schema/Lead.LastName';
import EMAIL from '@salesforce/schema/Lead.Email';
import PHONE from '@salesforce/schema/Lead.Phone';
import COMPANY from '@salesforce/schema/Lead.Company';
import COURSE_FIELD from '@salesforce/schema/Lead.Course__c';
import getCourses from '@salesforce/apex/CourseController.getCourses';

export default class EnrollmentForm extends LightningElement {
    @track firstName = '';
    @track lastName = '';
    @track email = '';
    @track phone = '';
    @track selectedCourse = '';
    @track courseOptions = [];

    // Fetch courses from the custom Course__c object
    @wire(getCourses)
    wiredCourses({ error, data }) {
        if (data) {
            this.courseOptions = data.map(course => ({
                label: course.Name,
                value: course.Name
            }));
        } else if (error) {
            console.error('Error fetching courses:', error);
        }
    }

    handleInputChange(event) {
        this[event.target.dataset.field] = event.target.value;
    }

    handleCourseChange(event) {
        this.selectedCourse = event.target.value;
    }

    handleSubmit() {
        if (!this.firstName || !this.lastName || !this.email) {
            this.showToast('Error', 'Please fill in all required fields.', 'error');
            return;
        }

        const fields = {};
        fields[FIRST_NAME.fieldApiName] = this.firstName;
        fields[LAST_NAME.fieldApiName] = this.lastName;
        fields[EMAIL.fieldApiName] = this.email;
        fields[PHONE.fieldApiName] = this.phone;
        fields[COURSE_FIELD.fieldApiName] = this.selectedCourse;
        fields[COMPANY.fieldApiName] = "Self"; 

        // console.log(this.selectedCourse);
        

        const recordInput = { apiName: LEAD_OBJECT.objectApiName, fields };

        createRecord(recordInput)
            .then(() => {
                this.showToast('Success', 'Enrollment submitted successfully!', 'success');
                this.resetForm();
            })
            .catch(error => {
                console.error('Error creating lead:', JSON.stringify(error));
                this.showToast('Error', error.body.message || 'Failed to submit enrollment', 'error');
            });
    }

    showToast(title, message, variant) {
        this.dispatchEvent(new ShowToastEvent({ title, message, variant }));
    }

    resetForm() {
        this.firstName = '';
        this.lastName = '';
        this.email = '';
        this.phone = '';
        this.selectedCourse = '';
    }
}
