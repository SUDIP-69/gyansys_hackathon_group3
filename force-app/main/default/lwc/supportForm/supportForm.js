import { LightningElement, wire, track } from 'lwc';
import getProducts from '@salesforce/apex/CourseController.getProducts';

export default class SupportForm extends LightningElement {
    @track products = [];

    @wire(getProducts)
    wiredProducts({ error, data }) {
        if (data) {
            this.products = data;
        } else if (error) {
            console.error('Error fetching products:', error);
        }
    }
}
