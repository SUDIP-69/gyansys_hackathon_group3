import { LightningElement, wire, track } from 'lwc';
import getCourses from '@salesforce/apex/CourseController.getCourses';

export default class CourseListing extends LightningElement {
    @track courses = [];
    @track selectedDomain = '';
    @track showModal = false;
    @track selectedCourse;

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
}
