export const integrationConfigs = {
  1: {
    id: 1,
    type: "whatsapp",
    title: "Gupshup WhatsApp Integration",
    fields: [
      { name: "apiKey", label: "API Key", required: true },
      { name: "apiSecret", label: "API Secret", required: true },
      { name: "senderId", label: "Sender ID", required: true },
      { name: "webhookUrl", label: "Webhook URL", required: true },
      { name: "phoneNumber", label: "Phone Number", required: true },
      { name: "accountId", label: "Account ID", required: false },
      { name: "environment", label: "Environment", required: false },
      { name: "description", label: "Description", required: false },
    ],
  },

  2: {
    id: 2,
    type: "sms",
    title: "SMS Gateway Integration",
    fields: [
      { name: "apiKey", label: "API Key", required: true },
      { name: "senderId", label: "Sender ID", required: true },
      { name: "phoneNumber", label: "Phone Number", required: true },
    ],
  },

  3: {
    id: 3,
    type: "email",
    title: "SMTP Email Integration",
    fields: [
      { name: "smtpHost", label: "SMTP Host", required: true },
      { name: "smtpPort", label: "SMTP Port", required: true },
      { name: "username", label: "Username", required: true },
      { name: "password", label: "Password", required: true },
      { name: "fromEmail", label: "From Email", required: true },
    ],
  },
};
