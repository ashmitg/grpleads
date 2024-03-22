import { Button, FormLabel, Grid, GridItem, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, Textarea } from '@chakra-ui/react';
import Spinner from 'components/spinner/Spinner';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { BsFillSendFill } from 'react-icons/bs';
import { emailSchema } from 'schema';
import { getApi, postApi } from 'services/api';
import { toast } from "react-toastify";


const AddEmailHistory = (props) => {
    const { onClose, isOpen, fetchData } = props
    const user = JSON.parse(localStorage.getItem('user'))
    const [isLoading, setIsLoading] = useState(false)
    const [contactModelOpen, setContactModel] = useState(false);
    const [leadModelOpen, setLeadModel] = useState(false);

    const initialValues = {
        sender: user?._id,
        recipient: '',
        subject: '',
        message: '',
        createBy: '',
        createByLead: '',
        startDate: '',
        endDate: '',
    }
    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: emailSchema,
        onSubmit: (values, { resetForm }) => {
            
            AddData();
            resetForm();
        },
    });
    const { errors, touched, values, handleBlur, handleChange, handleSubmit, setFieldValue, } = formik

    const AddData = async () => {
        try {
            setIsLoading(true);
            values.message = values.message.replace(/\n/g, '<br>');
            let response = await postApi('api/email/add', values);
            if (response.status === 200) {
                props.onClose();
                fetchData();
                toast.success('Email sent successfully');
            } else {
                throw new Error(response.data?.message);
            }
        } catch (e) {
            props.onClose();
            toast.error(`Failed: Please Connect Your Email`);

        } finally {
            setIsLoading(false);
        }
    };

    const fetchRecipientData = async () => {
        if (props.id && props.lead !== 'true') {
            let response = await getApi('api/contact/view/', props.id)
            if (response?.status === 200) {
                setFieldValue('recipient', response?.data?.contact?.email);
                setFieldValue('createBy', props.id);
                values.recipient = response?.data?.contact?.email
            }
        } else if (props.id && props.lead === 'true') {
            let response = await getApi('api/lead/view/', props.id)
            if (response?.status === 200) {
                setFieldValue('recipient', response?.data?.lead?.leadEmail);
                setFieldValue('createByLead', props.id);
                values.recipient = response?.data?.lead?.leadEmail
            }
        }
    }

    useEffect(() => {
        fetchRecipientData()
    }, [props.id])

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
                                onChange={handleChange} onBlur={handleBlur}
                                value={values.recipient}
                                name="recipient"
                                placeholder='Recipient'
                                fontWeight='500'
                                borderColor={errors.recipient && touched.recipient ? "red.300" : null}
                                isDisabled={true}
                            />
                            <Text mb='10px' color={'red'}> {errors.recipient && touched.recipient && errors.recipient}</Text>
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
                    <Button variant='brand' onClick={handleSubmit} rightIcon={<BsFillSendFill />} disabled={isLoading ? true : false} >{isLoading ? <Spinner /> : 'Send'}</Button>
                    <Button onClick={() => {
                        formik.resetForm()
                        onClose()
                    }}>Close</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default AddEmailHistory