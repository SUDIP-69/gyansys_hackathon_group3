public with sharing class UserProfileController {
    @AuraEnabled(cacheable=true)
    public static User getUserDetails() {
        return [
            SELECT Id, FirstName, LastName, Email, Phone 
            FROM User 
            WHERE Id = :UserInfo.getUserId()
        ];
    }

    @AuraEnabled(cacheable=true)
    public static Integer getEnrollmentCount() {
        return [
            SELECT COUNT()
            FROM Enrollment__c 
            WHERE Contact__c IN (
                SELECT ContactId FROM User WHERE Id = :UserInfo.getUserId()
            )
        ];
    }

    @AuraEnabled(cacheable=true)
    public static Boolean hasRaisedCase() {
        Integer caseCount = [
            SELECT COUNT() 
            FROM Case 
            WHERE ContactId IN (
                SELECT ContactId FROM User WHERE Id = :UserInfo.getUserId()
            )
        ];
        return caseCount > 0;
    }
}
