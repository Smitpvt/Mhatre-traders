import nodemailer from 'nodemailer';
import { env } from '../config/env.js';
import { logger } from '../middlewares/logging.middleware.js';

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_PORT === 465, // true for 465, false for other ports
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
});

export const sendInvoiceEmail = async (toEmail, invoiceNumber, pdfBuffer) => {
  try {
    const mailOptions = {
      from: `"Mhatre Traders" <${env.FROM_EMAIL}>`,
      to: toEmail,
      subject: `Your Invoice ${invoiceNumber} from Mhatre Traders`,
      text: `Dear Customer,\n\nPlease find attached your invoice ${invoiceNumber} from Mhatre Traders.\n\nThank you for your business!`,
      attachments: [
        {
          filename: `Invoice_${invoiceNumber}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info(`Invoice email sent to ${toEmail}: ${info.messageId}`);
    return true;
  } catch (error) {
    logger.error({ error: error.message }, `Failed to send invoice email to ${toEmail}`);
    return false;
  }
};
