import React from 'react';
import { ReactSpreadsheetImport } from 'react-spreadsheet-import';
import { Button } from '@chakra-ui/react';
import {postApi} from 'services/api';
import { toast } from "react-toastify";

const ImportComponent = ({ isOpen, setIsOpen, onClose, fetchData}) => {
  const toastConfig = {
    position: "top-center", // Set the position to top-center
    autoClose: 5000, // Set the duration for the toast to be visible (in milliseconds)
    hideProgressBar: false, // Display or hide the progress bar
    closeOnClick: true, // Close the toast when clicked
    pauseOnHover: true, // Pause the autoClose timer when hovering over the toast
    draggable: true, // Allow the toast to be dragged
    fontSize: '25px',
  };

  const onFileLoaded = async (data) => {
    const id = toast.loading("Uploading Leads", toastConfig);
    try{
        
        const response = await postApi('api/contact/bulkadd', data);
        fetchData()
        toast.update(id, { render: `Successfuly Uploading Contacts`, type: "success", isLoading: false, ...toastConfig });

      }catch(err){
        toast.update(id, { render: "Ooops an error occured, please contact support", type: "error", isLoading: false, ...toastConfig });
      }
  }
  const onSubmit = (data, file) => {

    
    onFileLoaded(data)
    //const response = await postApi('api/contact/bulkadd', {});
    // Add your logic here to handle the submitted data
    // You can send it to a server, update state, etc.
    onClose(); // Close the modal after submission
  };

  const fields = [
    {
      label: 'Title',
      key: 'title',
      fieldType: {
        type: 'input',
      },
      validations: [],
      alternateMatches: ['Title', 'Product Name', 'Product', 'Item', 'Goods'],
      example: 'Product',
    },
    {
      label: 'First Name',
      key: 'firstName',
      fieldType: {
        type: 'input',
      },
      validations: [
        {
          errorMessage: 'First Name is required',
          level: 'error',
        },
      ],
      example: 'John',
      alternateMatches: ['first name', 'first', 'Given Name', 'Forename', 'name', 'Name', 'Full Name', 'Fullname', ],
    },
    {
      label: 'Last Name',
      key: 'lastName',
      fieldType: {
        type: 'input',
      },
      validations: [],
      example: 'Doe',
      alternateMatches: ['last name', 'last', 'Surname', 'Family Name'],
    },
    {
      label: 'Phone Number',
      key: 'phoneNumber',
      fieldType: {
        type: 'input',
      },
      validations: [],
      example: '123-456-7890',
      alternateMatches: ['phone', 'contact number', 'Mobile', 'Cell', 'Telephone', 'Phone Number', 'Phone No', 'Phone', 'Phone No.', 'Phone Number.', 'Phone No.'],
    },
    {
      label: 'Email Address',
      key: 'email',
      fieldType: {
        type: 'input',
      },
      validations: [
        {
          rule: 'required',
          errorMessage: 'Email Address is required',
          level: 'error',
        },
      ],
      example: 'john.doe@example.com',
      alternateMatches: ['email', 'e-mail', 'Electronic Mail', 'Email ID', 'emailaddress', 'email address'],
    },
  ];
  
  

  return (
    <div>
      <Button onClick={() => setIsOpen(true)} variant="solid" colorScheme="brand">
        Import Leads
      </Button>
      <ReactSpreadsheetImport isOpen={isOpen} onClose={onClose} onSubmit={onSubmit} fields={fields} allowInvalidSubmit={false} />
    </div>
  );
};

export default ImportComponent;
