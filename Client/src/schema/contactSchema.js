import * as yup from 'yup'

export const contactSchema = yup.object({
    // 1. Basic Information
    firstName: yup.string().min(2).required('First Name is required'),
    lastName: yup.string().min(2).required('Last Name is required'),
    title: yup.string(),
    email: yup.string().email().required('Email is required'),
    physicalAddress: yup.string(),
    // mailingAddress: yup.string(),
    // preferredContactMethod: yup.string(),
    // 2.Lead Source Information
    leadSource: yup.string(),
    referralSource: yup.string(),
    campaignSource: yup.string(),
    // 3. Status and Classifications
    leadStatus: yup.string(),
    leadRating: yup.number(),
    leadConversionProbability: yup.string(),
    // 5. History:
    emailHistory: yup.string(),
    phoneCallHistory: yup.string(),
    meetingHistory: yup.string(),
    notesandComments: yup.string(),
    // 6. Tags or Categories
    tagsOrLabelsForcategorizingcontacts: yup.string(),
    // 7. Important Dates:
    // 8. Additional Personal Information
    dob: yup.string(),
    gender: yup.string(),
    occupation: yup.string(),
    interestsOrHobbies: yup.string(),
    // 9. Preferred  Communication Preferences:
    communicationFrequency: yup.string(),
    preferences: yup.string(),
    // 10. Social Media Profiles:
    linkedInProfile: yup.string(),
    facebookProfile: yup.string(),
    twitterHandle: yup.string(),
    otherProfiles: yup.string(),
    // 11. Lead Assignment and Team Collaboration:
    agentOrTeamMember: yup.string(),
    internalNotesOrComments: yup.string(),
    createBy: yup.string(),
    // 12. Custom Fields:
})