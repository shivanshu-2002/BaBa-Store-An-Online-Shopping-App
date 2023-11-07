const otpTemplate = (otp) => {
	return `<!DOCTYPE html>
	<html>
	
	<head>
		<meta charset="UTF-8">
		<title>OTP Verification Email</title>
		<style>
			body {
				background-color: #ffffff;
				font-family: Arial, sans-serif;
				font-size: 16px;
				line-height: 1.4;
				color: #333333;
				margin: 0;
				padding: 0;
			}
	
			.container {
				max-width: 600px;
				margin: 0 auto;
				padding: 20px;
				text-align: center;
				align-items:center;
				
			}
	
			.logo {
				max-width: 200px;
				margin-bottom: 20px;
			}
	
			.message {
				font-size: 18px;
				font-weight: bold;
				margin-bottom: 20px;
			}
	
			.body {
				font-size: 16px;
				margin-bottom: 20px;
			}
	
			.cta {
				display: inline-block;
				padding: 10px 20px;
				background-color: #FFD60A;
				color: #000000;
				text-decoration: none;
				border-radius: 5px;
				font-size: 16px;
				font-weight: bold;
				margin-top: 20px;
			}
	
			.support {
				font-size: 14px;
				color: #999999;
				margin-top: 20px;
			}
	
			.highlight {
				font-weight: bold;
			}
	
			/* Styling the title with a gradient background */
			.title {
				
				background-color: #9054FF;
				border:2px solid black;
				color: white;
				font-size: 36px;
			}
		</style>
	
	</head>
	
	<body>
		<div class="container">
			<!-- Apply the 'title' class to style the title -->
			<h1 class="title">BABA | STORE</h1>
			<div class="message">OTP Verification Email</div>
			<div class="body">
				<p>Dear User,</p>
				<p>Thank you for registering with BABA | STORE. To complete your registration, please use the following OTP
					${otp} to verify your account:</p>
				<h2 class="highlight"><!-- Replace this with the actual OTP value --></h2>
				<p>This OTP is valid for 5 minutes. If you did not request this verification, please disregard this email.
					Once your account is verified, you will have access to our platform and its features.</p>
			</div>
			<div class="support">If you have any questions or need assistance, please feel free to reach out to us at <a
					href="mailto:info@babastores.com">info@babastore.com</a>. We are here to help!</div>
		</div>
	</body>
	
	</html>
	`;
};
module.exports = otpTemplate;