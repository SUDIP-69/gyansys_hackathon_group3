public without sharing class EnrollmentController {
    @AuraEnabled(cacheable=true)
    public static List<Enrollment__c> getEnrolledCourses() {
        // Fetch the logged-in user's contact ID
        Id contactId = [SELECT ContactId FROM User WHERE Id = :UserInfo.getUserId()].ContactId;
        
        if (contactId == null) {
            return new List<Enrollment__c>();
        }

        return [
            SELECT Id, Course_Enrollment_Rel__r.Name 
            FROM Enrollment__c 
            WHERE Contact__c = :contactId
        ];
    }

    @AuraEnabled
    public static void createEnrollment(Id courseId) {
        try {
            // Debug logs
            System.debug('Starting enrollment process for courseId: ' + courseId);
            
            if (courseId == null) {
                throw new AuraHandledException('Course ID cannot be null');
            }

            // Get current user info with debug
            Id userId = UserInfo.getUserId();
            System.debug('Current User Id: ' + userId);
            
            User currentUser;
            try {
                currentUser = [SELECT Id, ContactId FROM User WHERE Id = :userId LIMIT 1];
                System.debug('Current User Contact Id: ' + currentUser.ContactId);
            } catch (Exception e) {
                throw new AuraHandledException('Unable to retrieve user information');
            }
            
            if (currentUser.ContactId == null) {
                throw new AuraHandledException('Please create a contact record for this user before enrolling.');
            }

            // Verify course exists
            List<Course__c> course = [SELECT Id FROM Course__c WHERE Id = :courseId LIMIT 1];
            if (course.isEmpty()) {
                throw new AuraHandledException('Course not found');
            }

            // Check for existing enrollment with debug
            List<Enrollment__c> existingEnrollments = [
                SELECT Id FROM Enrollment__c 
                WHERE Contact__c = :currentUser.ContactId 
                AND Course_Enrollment_Rel__c = :courseId 
                LIMIT 1
            ];
            System.debug('Existing enrollments found: ' + existingEnrollments.size());

            if (!existingEnrollments.isEmpty()) {
                throw new AuraHandledException('You are already enrolled in this course.');
            }

            // Create enrollment with debug
            try {
                Enrollment__c enrollment = new Enrollment__c(
                    Contact__c = currentUser.ContactId,
                    Course_Enrollment_Rel__c = courseId
                );
                
                insert enrollment;
                System.debug('Enrollment created successfully. Id: ' + enrollment.Id);
            } catch (DmlException de) {
                System.debug('DML Error: ' + de.getMessage());
                throw new AuraHandledException('Failed to create enrollment: ' + de.getMessage());
            }

        } catch (AuraHandledException ae) {
            System.debug('Aura Error: ' + ae.getMessage());
            throw ae;
        } catch (Exception e) {
            System.debug('General Error: ' + e.getMessage());
            throw new AuraHandledException('An unexpected error occurred: ' + e.getMessage());
        }
    }
}
