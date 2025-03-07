import { LightningElement, wire, track, api } from 'lwc';
import getCourses from '@salesforce/apex/CourseController.getCourses';
import createEnrollment from '@salesforce/apex/EnrollmentController.createEnrollment';
import { NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class CourseListing extends NavigationMixin(LightningElement) {
    @track courses = [];
    @track selectedDomain = '';
    @track showModal = false;
    @track selectedCourse;
    @api enrollmentUrl = '/enrollments';

    @wire(getCourses)
    wiredCourses({ error, data }) {
        if (data) {
            this.courses = data;
        } else if (error) {
            console.error(error);
        }
    }

    get domains() {
        return [...new Set(this.courses.map(course => course.Domain__c))];
    }

    get tabList() {
        return this.domains.map(domain => ({
            name: domain,
            class: domain === this.selectedDomain ? 'tab active' : 'tab'
        }));
    }

    get filteredCourses() {
        return this.selectedDomain
            ? this.courses.filter(course => course.Domain__c === this.selectedDomain)
            : this.courses;
    }

    handleTabClick(event) {
        this.selectedDomain = event.target.dataset.domain;
    }

    handleCourseClick(event) {
        const courseId = event.currentTarget.dataset.id;
        this.selectedCourse = this.courses.find(course => course.Id === courseId);
        this.showModal = true;
    }

    closeModal() {
        this.showModal = false;
    }

    handleEnroll() {
        if (!this.selectedCourse || !this.selectedCourse.Id) {
            this.showToast('Error', 'No course selected', 'error');
            return;
        }

        this.showToast('Info', 'Processing enrollment...', 'info');
        
        createEnrollment({ courseId: this.selectedCourse.Id })
            .then(() => {
                this.showToast('Success', 'Successfully enrolled in the course!', 'success');
                this.closeModal();
                // Refresh enrolled courses if the component exists
                this.dispatchEvent(new CustomEvent('enrollmentcreated'));
            })
            .catch(error => {
                console.error('Enrollment Error:', JSON.stringify(error));
                let errorMessage = 'An unexpected error occurred.';
                
                if (error.body && error.body.message) {
                    errorMessage = error.body.message;
                } else if (error.message) {
                    errorMessage = error.message;
                }
                
                this.showToast('Error', errorMessage, 'error');
            });
    }

    handleEnrollAndRedirect() {
        // First handle the enrollment (your existing enrollment logic)
        this.handleEnroll();
        
        // Then navigate to the enrollments page
        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
                url: '/enrollments'
            }
        });
    }

    showToast(title, message, variant) {
        this.dispatchEvent(
            new ShowToastEvent({
                title: title,
                message: message,
                variant: variant
            })
        );
    }
}
