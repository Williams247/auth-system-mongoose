import { TemplatePayload } from "./type";

export function Template({
		otp,
		username,
		message
}: TemplatePayload): string {
		return `
    <html lang="en-US">
     <head>
      <meta name="x-apple-disable-message-reformatting" />
        <meta name="viewport" content="width=device-width" />
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <style>
        @import url("https://cdn.jsdelivr.net/npm/@xz/fonts@1/serve/plus-jakarta-display.min.css");
        * {
          font-family: "Plus Jakarta Display", sans-serif !important;
        }
        
        body p {
          font-size: 14px;
        }
        
        @media (prefers-color-scheme: light) {
          body {
            background-color: white !important;
          }
        }

        @media (prefers-color-scheme: dark) {
          body {
            background-color: white !important;
          }
        }
        </style>
      </head>
      <body
        style="
        background-color: white;
        -webkit-font-smoothing: antialiased;
        font-size: 14px;
        line-height: 1.4;
        margin: 0;
        padding: 0;
        -ms-text-size-adjust: 100%;
        -webkit-text-size-adjust: 100%;
        "
      >
        <div
           style="
            font-size: 14px;
            vertical-align: top;
            margin: 0 auto;
            max-width: 580px;
            width: 580px"
        >
        <div>
          <div style="background: #ffffff; width: 100%">
            <div style="margin-top: 20px; padding-left: 30px; padding-right: 30px">
                <img
		                src="https://zenithhillcity.com/wp-content/uploads/2023/05/WhatsApp-Image-2023-05-10-at-07.45.50.jpg"
		                style="width: 5rem"
                />
                <p><strong>Dear ${username}</strong></p>
                <p>${message}</p>
                ${otp && `
																		<div>
                    <p>Your otp is: <strong>${otp}</strong></p>
                    <p>Your otp is valid for 20 minutes after which it will be invalid</p>
                  </div>
               `}
                <p>
                  If you have any questions, just send a direct message on Whatsapp
                  message to <strong>+2349168242296.</strong> You can also send an
                  email to info@oneschool.africa.
                </p>
               <p>I am always happy to help. <br />Cheers, Mona.</p>
            </div>
          </div>
        </div>
      </div>
    </body>
   </html>
 `;
}
