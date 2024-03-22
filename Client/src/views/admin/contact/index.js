import CountUpComponent from "components/countUpComponent/countUpComponent";

import { AddIcon } from "@chakra-ui/icons";
import { Button, Grid, GridItem, Spinner, useDisclosure, Text, Flex } from '@chakra-ui/react';
import { useState } from 'react';
import { getApi } from 'services/api';
import CheckTable from './components/CheckTable';
import Add from "./Add";
import ImportComponent from './spreadsheet';

const Index = () => {
    const columns = [
        { Header: "#", accessor: "_id", isSortable: false, width: 10 },
        { Header: 'title', accessor: 'title' },
        { Header: "first Name", accessor: "firstName", },
        { Header: "last Name", accessor: "lastName", },
        { Header: "phone Number", accessor: "phoneNumber", },
        { Header: "Email Address", accessor: "email", },
        { Header: "Date Added", accessor: "datecreated", },
    ];
    
    const { isOpen, onOpen, onClose } = useDisclosure()
    const size = "lg";
    const [data, setData] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const user = JSON.parse(localStorage.getItem("user"))

    const fetchData = async () => {
        setIsLoading(true)
        let result = await getApi(user.role === 'admin' ? 'api/contact/' : `api/contact/?createBy=${user._id}`);
        setData(result.data);
        setIsLoading(false)
    }

    const handleClick = () => {
        onOpen()
    }
    
    
    const [spreadFlow, setspreadFlow] = useState(false);
    const onCloseCSV = () => {
      setspreadFlow(false);
    };

    return (
      <div>
        <Grid templateColumns="repeat(6, 1fr)" mb={3} gap={1}>
          <GridItem colStart={6} textAlign={"right"}>
            <Flex direction="row">
             <ImportComponent isOpen={spreadFlow} setIsOpen={setspreadFlow} onClose = {onCloseCSV} fetchData={fetchData}/>
              <Button onClick={() => handleClick()} leftIcon={<AddIcon />} variant="brand">
                Add
              </Button>
            </Flex>
          </GridItem>
        </Grid>
        <Text
            color={"black"}
            fontSize="22px"
            fontWeight="700"
            lineHeight="100%"
            mb={4}
          >
            Contacts (<CountUpComponent targetNumber={data?.length} />)
          </Text>
        <CheckTable isLoading={isLoading} columnsData={columns} isOpen={isOpen} tableData={data} fetchData={fetchData} />
        <Add isOpen={isOpen} size={size} onClose={onClose} />
      </div>
  )
}

export default Index
