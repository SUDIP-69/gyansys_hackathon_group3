public with sharing class CourseController {
    @AuraEnabled(cacheable=true)
    public static List<Course__c> getCourses() {
        return [SELECT Id, Name, Price__c, Duration__c, Domain__c, Description__c, Professional__c FROM Course__c];
    }
}
