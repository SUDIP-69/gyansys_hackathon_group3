public with sharing class CourseController {

    @AuraEnabled(cacheable=true)
    public static List<Course__c> getCourses() {
        return [SELECT Id, Name, Price__c, Duration__c, Domain__c,Picture__c, Description__c, Professional__c FROM Course__c];
    }

    @AuraEnabled(cacheable=true)
    public static List<Map<String, String>> getProducts() {
        List<Map<String, String>> options = new List<Map<String, String>>();
        options.add(new Map<String, String>{'value' => '', 'label' => '--None--'});
        for (Course__c prod : [SELECT Id, Name FROM Course__c]) {
            options.add(new Map<String, String>{'value' => prod.Name, 'label' => prod.Name});
        }
        return options;
    }
}
