import { Button, FormLabel, Grid, GridItem, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, Textarea } from '@chakra-ui/react';
import Spinner from 'components/spinner/Spinner';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { BsFillSendFill } from 'react-icons/bs';
import { bulkemailSchema } from 'schema';
import { postApi } from 'services/api';
import { toast } from "react-toastify";

const AddBulkEmailHistory = (props) => {
    const { onClose, isOpen, fetchData, id,  tableData } = props

    const user = JSON.parse(localStorage.getItem('user'))
    const [isLoding, setIsLoding] = useState(false)


    const initialValues = {
        sender: user?._id,
        recipient: [], // Change to an array
        subject: '',
        message: '',
        createBy: '',
        createByLead: '',
        startDate: '',
        endDate: '',
    };
    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: bulkemailSchema,
        onSubmit: (values, { resetForm }) => {
            
            AddData();
            resetForm();
        },
    });
    const { errors, touched, values, handleBlur, handleChange, handleSubmit, setFieldValue, } = formik

    const AddData = async () => {
        
        try {
          setIsLoding(true);
          let successfulemails = 0;
      
          const emails = [];
      
          // Iterate through each recipient and createBy
          for (let i = 0; i < values.recipient.length; i++) {
            const recipient = values.recipient[i];
            const createBy = values.createBy[i];
            const firstName = values.firstName[i];
            const lastName = values.lastName[i];
            const formattedMessage = values.message.replace(/\n/g, '<br>');
            // Create a new object with the current recipient, createBy, firstName, lastName
            const email = {
              ...values,
              recipient: recipient,
              createBy: createBy,
              // Replace {firstlastname} with the concatenated first and last name
              message: formattedMessage.replace(/{firstlastname}/g, `${firstName || ''} ${lastName || ''}`),
            };
      
            emails.push(email);
          }
          const toastConfig = {
            position: "top-center", // Set the position to top-center
            autoClose: 5000, // Set the duration for the toast to be visible (in milliseconds)
            hideProgressBar: false, // Display or hide the progress bar
            closeOnClick: true, // Close the toast when clicked
            pauseOnHover: true, // Pause the autoClose timer when hovering over the toast
            draggable: true, // Allow the toast to be dragged
            fontSize: '25px',
          };
          const id = toast.loading("This may take a while, feel free to close the tab.", toastConfig);


          // Send a request for all emails
          let response = await postApi('api/email/addbulk', emails);
      
          if (response.status === 200) {
            toast.update(id, { render: `Successfully Sent To ${response?.data?.successfulEmailCount} Emails!`, type: "success", isLoading: false, ...toastConfig });
          } else {
            toast.update(id, { render: "Please connect your Email account", type: "error", isLoading: false, ...toastConfig });
          }
      
          
          // After all requests are sent, close the modal and fetch data
          props.onClose();
          fetchData();
        } catch (e) {

        } finally {
          setIsLoding(false);
        }

    };

    const fetchRecipientData = async () => {
    try {
      if (props.tableData && props.tableData.length > 0) {
        const recipients = [];
        const createByValues = [];
        const firstNames = [];
        const lastNames = [];
        const phoneNumbers = [];

        // Filter tableData based on selectedValues
        const selectedData = props.tableData.filter(row => props.id.includes(row._id));
        
        for (const row of selectedData) {
          recipients.push(row.email); // Modify this based on the actual property in your data
          createByValues.push(row._id); // Modify this based on the actual property in your data
          firstNames.push(row.firstName); // Modify this based on the actual property in your data
          lastNames.push(row.lastName); // Modify this based on the actual property in your data
          phoneNumbers.push(row.phoneNumber); // Modify this based on the actual property in your data
        }

        setFieldValue('recipient', recipients);
        setFieldValue('createBy', createByValues);
        setFieldValue('firstName', firstNames);
        setFieldValue('lastName', lastNames);
        setFieldValue('phoneNumber', phoneNumbers);
      }
    } catch (error) {
      console.error(error);
    }
  };

    useEffect(() => {
        fetchRecipientData()
        formik.setFieldValue('message', `Dear {firstlastname},\n\nBest Regards,`);
    }, [props.id, props.selectedValues])

    return (
        <Modal onClose={onClose} isOpen={isOpen} isCentered size="xl" backdropBlur='10px'>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Send Email </ModalHeader>
                <ModalCloseButton />
                <ModalBody>

                    <Grid templateColumns="repeat(12, 1fr)" gap={3}>

                        <GridItem colSpan={{ base: 12 }}>
                            <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                Recipient<Text color={"red"}>*</Text>
                            </FormLabel>
                            <Input
                                fontSize='sm'
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.recipient}
                                name="recipient"
                                placeholder='Recipient'
                                fontWeight='500'
                                borderColor={errors.recipient && touched.recipient ? "red.300" : null}
                                isDisabled={true} // Set isDisabled to true to make it uneditable
                            />
                            <Text mb='10px' color={'red'}>
                                {errors.recipient && touched.recipient && errors.recipient}
                            </Text>
                        </GridItem>

                        <GridItem colSpan={{ base: 12 }}>
                            <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                Subject
                            </FormLabel>
                            <Input
                                fontSize='sm'
                                placeholder='Enter subject'
                                onChange={handleChange} onBlur={handleBlur}
                                value={values.subject}
                                name="subject"
                                fontWeight='500'
                                borderColor={errors.subject && touched.subject ? "red.300" : null}
                            />
                            <Text mb='10px' color={'red'}> {errors.subject && touched.subject && errors.subject}</Text>
                        </GridItem>
                        
                        <GridItem colSpan={{ base: 12 }}>
                            <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                Message
                            </FormLabel>
                            <Textarea
                                fontSize='sm'
                                placeholder='Here Type message'
                                resize={'none'}
                                onChange={handleChange} onBlur={handleBlur}
                                value={values.message}
                                name="message"
                                fontWeight='500'
                                borderColor={errors.message && touched.message ? "red.300" : null}
                            />
                            <Text mb='10px' color={'red'}> {errors.message && touched.message && errors.message}</Text>
                        </GridItem>

                    </Grid>


                </ModalBody>
                <ModalFooter>
                    <Button variant='brand' onClick={AddData} rightIcon={<BsFillSendFill />} disabled={isLoding ? true : false} >{isLoding ? <Spinner /> : 'Send'}</Button>
                    <Button onClick={() => {
                        formik.resetForm()
                        onClose()
                    }}>Close</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default AddBulkEmailHistory