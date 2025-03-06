public with sharing class LeadController {
    @AuraEnabled(cacheable=true)
    public static List<Lead> getEnrollmentLeads() {
        return [SELECT Id, Name, Course__c FROM Lead WHERE Course__c <> NULL AND IsConverted = FALSE LIMIT 50];
    }

    @AuraEnabled
    public static void convertLead(String leadId) {
        Lead leadToConvert = [SELECT Id FROM Lead WHERE Id = :leadId LIMIT 1];

        Database.LeadConvert lc = new Database.LeadConvert();
        lc.setLeadId(leadToConvert.Id);
        lc.setConvertedStatus('Closed - Converted'); // Ensure this status exists in Salesforce
        lc.setDoNotCreateOpportunity(false); // Set to true if you don't want an opportunity
        lc.setAccountId(null); // If null, a new Account is created

        Database.LeadConvertResult result = Database.convertLead(lc);
        
        if (!result.isSuccess()) {
            throw new AuraHandledException('Lead conversion failed');
        }
    }
}
