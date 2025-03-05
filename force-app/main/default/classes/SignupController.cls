public with sharing class SignupController {
    @AuraEnabled
    public static String createContact(String firstName, String lastName, String email, String password) {
        try {
            Contact newContact = new Contact();
            newContact.FirstName = firstName;
            newContact.LastName = lastName;
            newContact.Username__c = firstName + '.' + lastName;
            newContact.Email = email;
            newContact.Password__c = password; // Custom field to store password
            insert newContact;
            return 'SUCCESS';
        } catch (Exception e) {
            throw new AuraHandledException('Error creating contact: ' + e.getMessage());
        }
    }
}
