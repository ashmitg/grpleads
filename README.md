[video.webm](https://github.com/ashmitg/Mern-CRM/assets/84148720/596716b6-0adc-489b-843c-a61c1a847a3a)


## MERN CRM Full Stack App

This is a comprehensive Customer Relationship Management (CRM) application built using the MERN stack (MongoDB, Express.js, React.js, Node.js). The CRM is designed to efficiently manage contacts, send bulk emails, import contacts, and integrate with Gmail via OAuth2 authentication.

### Features

- **OAuth2 Connection to Gmail Account**: Authenticate with Gmail accounts securely using OAuth2, enabling seamless integration and access to Gmail features.
- **Sending Bulk Emails**: Send bulk emails to selected contacts or groups, facilitating efficient communication with clients or leads.
- **Importing Contacts**: Easily import contacts from various sources, streamlining the process of populating the CRM database.
- **Managing Contacts**: Comprehensive contact management functionalities including adding, editing, deleting, and categorizing contacts.
- **Non-commercial Use License**: This application is provided under a non-commercial use license, enabling free usage for personal or educational purposes.

### Technologies Used

- **MongoDB**: A NoSQL database used for storing contact information and other relevant data.
- **Express.js**: A backend framework for Node.js used for building the RESTful API.
- **React.js**: A JavaScript library for building user interfaces, used for the frontend of the CRM application.
- **Node.js**: A JavaScript runtime used for building the server-side logic and API endpoints.
- **OAuth2**: Standardized protocol used for secure authorization and authentication.
- **Gmail NPM package**: Module by google to send emails using oauth2.
- **Chakra**: Frontend framework used for responsive and mobile-first design.
- **react-spreadsheet-import**: Open source react csv importer [react-spreadsheet-import](https://github.com/UgnisSoftware/react-spreadsheet-import)
### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/your_username/mern-crm.git
    ```

2. Navigate to the project directory:

    ```bash
    cd mern-crm
    ```

3. Install dependencies for both the server and client:

    ```bash
    cd server && npm install
    cd ../client && npm install
    ```

4. Configure the environment variables:

    - Create a `.env` file in the `server` directory.
    - Add necessary environment variables such as MongoDB connection URI, Gmail API credentials, etc.



5. Start the app:

    ```bash
    cd ../client && npm run heroku-postbuild && npm run start
    ```

6. Access the application in your browser at `http://localhost:5001`.

### License

This project is licensed under the [Non-commercial Use License](LICENSE), which means it can be used freely for non-commercial purposes only.

### Contributing

Contributions are welcome! Feel free to submit issues and pull requests.

### Authors

- [Ashmit](https://github.com/ashmitg)

