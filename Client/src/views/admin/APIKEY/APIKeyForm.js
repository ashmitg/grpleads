// APIKeyForm.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Input,
  Button,
  FormControl,
  FormLabel,
  FormHelperText,
  IconButton,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';


const APIKeyForm = ({ apiKey, groupon_client_id, onSave }) => {
  const [localApiKey, setLocalApiKey] = useState(apiKey);
  const [showApiKey, setShowApiKey] = useState(false);
  const [localClientId, setLocalClientId] = useState(groupon_client_id); // Added state for client_id
  const [showLocalClientId, setShowLocalClientId] = useState(false); // Added state for client_id visibility

  useEffect(() => {
    setLocalApiKey(apiKey);
    setLocalClientId(groupon_client_id); // Updated to set localClientId
  }, [apiKey, groupon_client_id]);

  const handleSave = () => {
    onSave(localApiKey, localClientId); // Updated to pass localClientId
  };

  const handleApiToggleVisibility = () => {
    setShowApiKey(!showApiKey);
  };

  const handleClientToggleVisibility = () => {
    setShowLocalClientId(!showLocalClientId); // Updated to set visibility for client_id
  };

  return (
    <Box>
      <FormControl>
        <FormLabel> API Key</FormLabel>
        <InputGroup>
          <Input
            type={showApiKey ? 'text' : 'password'}
            value={localApiKey}
            onChange={(e) => setLocalApiKey(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <IconButton
              h="1.75rem"
              size="sm"
              onClick={handleApiToggleVisibility}
              icon={showApiKey ? <ViewOffIcon /> : <ViewIcon />}
            />
          </InputRightElement>
        </InputGroup>
        <FormHelperText>
          Enter your  API key to access the API.
        </FormHelperText>
      </FormControl>

      {/* Add a similar FormControl for client_id */}
      <FormControl mt={4}>
        <FormLabel> Client ID</FormLabel>
        <InputGroup>
          <Input
            type={showLocalClientId ? 'text' : 'password'} // Use 'text' or 'password' as needed
            value={localClientId}
            onChange={(e) => setLocalClientId(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <IconButton
              h="1.75rem"
              size="sm"
              onClick={handleClientToggleVisibility}
              icon={showLocalClientId ? <ViewOffIcon /> : <ViewIcon />}
            />
          </InputRightElement>
        </InputGroup>
        <FormHelperText>
          Enter your  Client ID.
        </FormHelperText>
      </FormControl>

      <Button mt={4} colorScheme="teal" onClick={handleSave}>
        Save API Key
      </Button>
    </Box>
  );
};

export default APIKeyForm;
