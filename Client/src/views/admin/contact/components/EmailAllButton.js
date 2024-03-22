// EmailAllButton.js
import React from 'react';
import { Button, Stack } from '@chakra-ui/react';
import { MdOutlineMailOutline, MdOutlineMessage } from "react-icons/md";

const EmailAllButton = ({ onClick }) => {
  return (
    <>
        <Stack direction='row' spacing={4}>
            <Button onClick={onClick} leftIcon={<MdOutlineMailOutline />} colorScheme='teal' variant='solid'>
                Email All
            </Button>
            {/* <Button onClick={onClick} rightIcon={<MdOutlineMessage />} colorScheme='teal' variant='solid'>
                Text All
            </Button> */}
        </Stack>
    </>
  );
};

export default EmailAllButton;
