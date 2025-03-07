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

    @AuraEnabled(cacheable=true)
    public static List<Map<String, String>> getDomainOptions() {
        List<Map<String, String>> options = new List<Map<String, String>>();
        
        Schema.DescribeFieldResult fieldResult = Course__c.Domain__c.getDescribe();
        List<Schema.PicklistEntry> ple = fieldResult.getPicklistValues();
        
        for(Schema.PicklistEntry entry : ple) {
            options.add(new Map<String, String>{
                'label' => entry.getLabel(),
                'value' => entry.getValue()
            });
        }
        
        return options;
    }

    @AuraEnabled
    public static void createCourse(String name, Decimal price, Integer duration, 
                                  String domain, Boolean professional, 
                                  String description, String pictureUrl) {
        Course__c newCourse = new Course__c(
            Name = name,
            Price__c = price,
            Duration__c = duration,
            Domain__c = domain,
            Professional__c = professional,
            Description__c = description,
            Picture__c = pictureUrl
        );
        
        insert newCourse;
    }
}
