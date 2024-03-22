import * as yup from 'yup';


export const bulkemailSchema = yup.object({
    sender: yup.string().required("Sender Is required"),
    recipient: yup.array().of(yup.string().email().required("Recipient is required")).required("Recipient is required"),
    cc: yup.string().email(),
    bcc: yup.string().email(),
    relatedToContact: yup.string(),
    relatedToLead: yup.string(),
    subject: yup.string(),
    message: yup.string(),
    createBy: yup.string(),
    createByLead: yup.string(),
}).test('createBy-or-createByLead-required', 'Recipient Is required', function (value) {
    if (!value.createBy && !value.createByLead) {
        return this.createError({
            path: 'createBy',
            message: 'Recipient Is required',
        });
    }
});