import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import 'assets/css/App.css';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import AuthLayout from 'layouts/auth';
import AdminLayout from 'layouts/admin';
import UserLayout from 'layouts/user';
import { ChakraProvider } from '@chakra-ui/react';
import theme from 'theme/theme';
import { ThemeEditorProvider } from '@hypertheme-editor/chakra-ui';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { GoogleOAuthProvider } from '@react-oauth/google';

import PrivacyPolicy from 'views/admin/PrivacyPolicy';
import TermsOfService from 'views/admin/TOS';

function App() {
	console.error = function() {};
	console.warn = function() {};
	console.info = function() {};


	const token = localStorage.getItem("token") || sessionStorage.getItem("token");
	const user = JSON.parse(localStorage.getItem("user"))
	useNavigate()

	return (
		<>
		  <ToastContainer />
		  <Routes>
			{/* Add routes for PrivacyPolicy and TermsOfService */}
			<Route path="/privacy-policy" element={<PrivacyPolicy />} />
			<Route path="/terms-of-service" element={<TermsOfService />} />
	
			{token && user?.role ? (
			  user?.role === 'user' ? (
				<Route path="/*" element={<UserLayout />} />
			  ) : user?.role === 'admin' ? (
				<Route path="/*" element={<AdminLayout />} />
			  ) : (
				''
			  )
			) : (
			  <Route path="/*" element={<AuthLayout />} />
			)}
		  </Routes>
		</>
	  );
}

ReactDOM.render(
	<GoogleOAuthProvider clientId="">
	<ChakraProvider theme={theme}>
			<ThemeEditorProvider>
				<Router>
					<App />
				</Router>
			</ThemeEditorProvider>
	</ChakraProvider>
	</GoogleOAuthProvider>
	, document.getElementById('root')
);

