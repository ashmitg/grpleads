import React, { useState, useEffect } from 'react';
import { Box, Heading, Button } from '@chakra-ui/react';
import APIKeyForm from './APIKeyForm';
import { postApi } from 'services/api'; // Assuming you have postApi and getApi functions
import { toast } from "react-toastify";
import { useGoogleLogin } from '@react-oauth/google';
import { FaGoogle } from 'react-icons/fa';

const API = () => {
  const [apiKey, setApiKey] = useState('');
  const [groupon_client_id, set_groupon_client_id] = useState('');
  const [googleAccount, setGoogleAccount] = useState('');
  // Fetch the API key from the server on component mount
  useEffect(() => {
    const fetchApiKeys = async () => {
      try {
        // Make a POST request to the 'api/update/view' endpoint
        const response = await postApi('api/update/view', {}); // Adjust the endpoint as needed

        if (response && response.data && response.status === 200) {
          setApiKey(response.data.Apikey || '');
          setGoogleAccount(response.data.GoogleAccount || '');
          set_groupon_client_id(response.data.groupon_client_id || '');
        } else {
          console.error('Failed to fetch API Key:', response?.data?.error);
        }
      } catch (error) {
        console.error('Error fetching API Key:', error);
      }
    };

    fetchApiKeys();
  }, []);


  // API Key Save Function
  const handleSaveAPIKey = async (newApiKey, Client_id) => {
    try {
      // Make a POST request to update the API key on the server
      const response = await postApi('api/update/apiupdate', { key: newApiKey , groupon_client_id: Client_id});

      // Check if the response object exists and has the expected properties
      if (response && response.data && response.status) {
        // Check if the API key was updated successfully
        if (response.status === 200) {
          toast.success("API Key Saved Successfully!")
        } else {
          console.error('Failed to update API Key:', response.data.error);
        }
      } else {
        console.error('Invalid response format:', response);
      }
    } catch (error) {
      console.error('Error updating API Key:', error);
    }
  };

  const handleUnlinkGoogleAccount = async () => {
    try {
      // Make a POST request to unlink the Google account
      const response = await postApi('api/update/unlinkgoogleaccount', {});

      // Check if the response object exists and has the expected properties
      if (response && response.status === 200) {
        setGoogleAccount('Not configured'); // Clear the Google account information
        toast.success("Google Account Unlinked Successfully!");
      } else {
        console.error('Failed to unlink Google Account:', response?.data?.error);
      }
    } catch (error) {
      console.error('Error unlinking Google Account:', error);
    }
  };


  const login = useGoogleLogin({
    onSuccess: (codeResponse) => {
      // The onSuccess callback provides the authorization code

      // Call a function to exchange the code for tokens
      exchangeCodeForTokens(codeResponse.code);
    },
    flow: 'auth-code',
    scope: 'https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/userinfo.email',
  });

  const exchangeCodeForTokens = async (authorizationCode) => {
    console.log(authorizationCode, "authorizationCode")
    try{
      const response = await postApi('api/update/sendgooglecode',{googlecode: authorizationCode});
      if(response && response.data.GoogleAccount){
        setGoogleAccount(response.data.GoogleAccount);
        toast.success("Google Account Linked Successfully!");
      }else{
        console.error('Failed to link Google Account:', response?.data?.error);
      }
    }catch(error){
      console.log(error)
    }
    
  };
  
  return (
    <Box>
      <Heading mb={4}>API Settings</Heading>
      <APIKeyForm apiKey={apiKey} groupon_client_id={groupon_client_id} onSave={handleSaveAPIKey} />

      <Heading mt={4} mb={3}>Connect Gmail Account</Heading>
      <p>
        To enable email automation, connect your Gmail account. This will allow the application to send automated emails.
      </p>
      {googleAccount !== 'Not configured' ? (
        <>
          <Button
            size="lg"
            border="2px solid red" // Assuming your UI library supports the 'border' prop
            onClick={handleUnlinkGoogleAccount}
          >
            Logout from Google {googleAccount}
          </Button>
        </>
      ) : (
        <Button
          mt={3}
          size="lg"
          border="2px solid red" // Assuming your UI library supports the 'border' prop
          onClick={() => login()}
        >
          <FaGoogle style={{ marginRight: '8px' }} /> Connect Gmail Account 📧
        </Button>
      )}
    </Box>
  );
};

export default API;
