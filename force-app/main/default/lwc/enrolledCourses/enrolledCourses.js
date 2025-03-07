import { LightningElement, wire } from 'lwc';
import getEnrolledCourses from '@salesforce/apex/EnrollmentController.getEnrolledCourses';

export default class EnrolledCourses extends LightningElement {
    courses = [];
    error;

    @wire(getEnrolledCourses)
    wiredCourses({ error, data }) {
        if (data) {
            this.courses = data.map(course => ({
                id: course.Id,
                name: course.Course_Enrollment_Rel__r.Name
            }));
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.courses = [];
        }
    }
}
