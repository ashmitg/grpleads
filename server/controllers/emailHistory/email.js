const { createMessage, initializeGmailClient, sendEmail } = require('../../middleware/mail');
const EmailHistory = require('../../model/schema/email');
const Apikey = require('../../model/schema/apikey');
const User = require('../../model/schema/user');
const mongoose = require('mongoose');
const {findUserAndApikey , decrypt, exchangeRefreshTokenForAccessToken } = require('../APIKEY/APIKEY')
const nodemailer = require('nodemailer');
const { google } = require('googleapis');


const add = async (req, res) => {
    
    try {
        const { sender, recipient, subject, message, startDate, endDate, createBy, createByLead } = req.body;
        
        if (createBy && !mongoose.Types.ObjectId.isValid(createBy)) {
            res.status(400).json({ error: 'Invalid createBy value' });
        }
        if (createByLead && !mongoose.Types.ObjectId.isValid(createByLead)) {
            res.status(400).json({ error: 'Invalid createByLead value' });
        }

        const email = { sender, recipient, subject, message, startDate, endDate }

        if (createBy) {
            email.createBy = createBy;
        }
        if (createByLead) {
            email.createByLead = createByLead;
        }

        const {user, apikey} = await findUserAndApikey(sender);
        if(!apikey || apikey.googEmailAddress.length===0){
            throw new Error('Please connect your google account first');
        }

        const gmail = await initializeGmailClient(apikey);
        await sendEmail(gmail, sender, recipient, subject, message);

        user.emailsent = user.emailsent + 1;
        await user.save();
        // sendEmail(email.recipient, email.subject, email.message)

        const result = new EmailHistory(email);

        await result.save();
        res.status(200).json({ result });
    } catch (err) {
        console.error('Failed to create :', err);
        res.status(400).json({ err, error: 'Failed to create' });
    }
}

const bulkAdd = async (req, res) => {
    console.log("arrived to bulkadd")
    const emails = req.body;
    let successfulEmailCount = 0;
    let failedEmailCount = 0;
    try {
      // Validate sender IDs in bulk
      const invalidSenderIds = emails.filter(email => email.createBy && !mongoose.Types.ObjectId.isValid(email.createBy))
                                     .map(email => email.createBy);
      if (invalidSenderIds.length > 0) {
        return res.status(400).json({ error: 'Invalid createBy value', invalidSenderIds });
      }
  
      const { user, apikey } = await findUserAndApikey(emails[0].sender);
  
      if (!apikey || apikey.googEmailAddress.length === 0) {
        throw new Error('Please connect your google account first');
      }
  
      const gmail = await initializeGmailClient(apikey);
  
      // Define a function to send a batch of emails
      const sendBatch = async (batch) => {
        const emailDocuments = batch.map(emailData => {
          const { sender, recipient, subject, message, startDate, endDate, createBy, createByLead } = emailData;
  
          user.emailsent = user.emailsent + 1;
  
          const email = {
            sender,
            recipient,
            subject,
            message,
            startDate,
            endDate,
            createBy: createBy || undefined,
            createByLead: createByLead || undefined
          };
  
          return new EmailHistory(email);
        });
  
        await Promise.all([
          user.save(),
          EmailHistory.insertMany(emailDocuments),
          Promise.all(batch.map(emailData => sendEmail(gmail, emailData.sender, emailData.recipient, emailData.subject, emailData.message)))
        ]);
      };
  
      // Define the batch size and delay between batches
      const batchSize = 5; // Adjust this based on your needs
      const delayBetweenBatches = 5000; // 5 seconds delay, adjust as needed
  
      // Split emails into batches
      for (let i = 0; i < emails.length; i += batchSize) {
        const batch = emails.slice(i, i + batchSize);
        console.log(`Processing email number ${i + 1} out of ${emails.length}`);
        try {
          // Send the current batch
          await sendBatch(batch);
          successfulEmailCount += batch.length;
        } catch (sendBatchError) {
          console.error('Failed to send batch:', sendBatchError);
          failedEmailCount += batch.length;
        }
  
        // Introduce a delay before sending the next batch
        if (i + batchSize < emails.length) {
            console.log("sending")
            await new Promise(resolve => setTimeout(resolve, delayBetweenBatches));
        }
      }
  
  
      res.status(200).json({ successfulEmailCount, failedEmailCount });
    } catch (err) {
      console.error('Failed to create:', err);
      res.status(400).json({ err, error: 'Failed to create' });
    }
  };
  




const index = async (req, res) => {
    try {
        const query = req.query
        if (query.sender) {
            query.sender = new mongoose.Types.ObjectId(query.sender);
        }

        let result = await EmailHistory.aggregate([
            { $match: query },
            {
                $lookup: {
                    from: 'leads', // Assuming this is the collection name for 'leads'
                    localField: 'createByLead',
                    foreignField: '_id',
                    as: 'createByrefLead'
                }
            },
            {
                $lookup: {
                    from: 'contacts', // Assuming this is the collection name for 'contacts'
                    localField: 'createBy',
                    foreignField: '_id',
                    as: 'createByRef'
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'sender',
                    foreignField: '_id',
                    as: 'users'
                }
            },
            { $unwind: { path: '$users', preserveNullAndEmptyArrays: true } },
            { $unwind: { path: '$createByRef', preserveNullAndEmptyArrays: true } },
            { $unwind: { path: '$createByrefLead', preserveNullAndEmptyArrays: true } },
            { $match: { 'users.deleted': false } },
            {
                $addFields: {
                    senderName: { $concat: ['$users.firstName', ' ', '$users.lastName'] },
                    deleted: {
                        $cond: [
                            { $eq: ['$createByRef.deleted', false] },
                            '$createByRef.deleted',
                            { $ifNull: ['$createByrefLead.deleted', false] }
                        ]
                    },
                    createByName: {
                        $cond: {
                            if: '$createByRef',
                            then: { $concat: ['$createByRef.title', ' ', '$createByRef.firstName', ' ', '$createByRef.lastName'] },
                            else: { $concat: ['$createByrefLead.leadName'] }
                        }
                    },
                }
            },
            {
                $project: {
                    createByRef: 0,
                    createByrefLead: 0,
                    users: 0
                }
            },
        ])


        res.status(200).json(result);
    } catch (err) {
        console.error('Failed :', err);
        res.status(400).json({ err, error: 'Failed ' });
    }
}

const view = async (req, res) => {
    try {
        let result = await EmailHistory.findOne({ _id: req.params.id })

        if (!result) return res.status(404).json({ message: "no Data Found." })

        let response = await EmailHistory.aggregate([
            { $match: { _id: result._id } },
            {
                $lookup: {
                    from: 'leads', // Assuming this is the collection name for 'leads'
                    localField: 'createByLead',
                    foreignField: '_id',
                    as: 'createByrefLead'
                }
            },
            {
                $lookup: {
                    from: 'contacts', // Assuming this is the collection name for 'contacts'
                    localField: 'createBy',
                    foreignField: '_id',
                    as: 'createByRef'
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'sender',
                    foreignField: '_id',
                    as: 'users'
                }
            },
            { $unwind: { path: '$users', preserveNullAndEmptyArrays: true } },
            { $unwind: { path: '$createByRef', preserveNullAndEmptyArrays: true } },
            { $unwind: { path: '$createByrefLead', preserveNullAndEmptyArrays: true } },
            { $match: { 'users.deleted': false } },
            {
                $addFields: {
                    senderEmail: '$users.username',
                    deleted: {
                        $cond: [
                            { $eq: ['$createByRef.deleted', false] },
                            '$createByRef.deleted',
                            { $ifNull: ['$createByrefLead.deleted', false] }
                        ]
                    },
                    createByName: {
                        $cond: {
                            if: '$createByRef',
                            then: { $concat: ['$createByRef.title', ' ', '$createByRef.firstName', ' ', '$createByRef.lastName'] },
                            else: { $concat: ['$createByrefLead.leadName'] }
                        }
                    },
                }
            },
            {
                $project: {
                    createByRef: 0,
                    createByrefLead: 0,
                    users: 0
                }
            },
        ])

        res.status(200).json(response[0])
    } catch (err) {
        console.error('Failed :', err);
        res.status(400).json({ err, error: 'Failed ' });
    }
}

module.exports = { add, index, view, bulkAdd }