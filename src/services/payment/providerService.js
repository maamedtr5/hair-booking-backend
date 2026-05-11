import axios from 'axios';

export const handlePayment = async (provider, amount, metadata) => {
  switch (provider) {
    case 'PAYSTACK':
      return await initializePaystack(amount, metadata.email);

    case 'CASH':
    case 'MOBILE_MONEY':
      // Static methods: no API call, just record locally
      return {
        reference: `STATIC-${Date.now()}`,
        externalId: null,
        checkoutUrl: null
      };

    default:
      throw new Error('Unsupported provider');
  }
};

const initializePaystack = async (amount, email) => {
  const response = await axios.post(
    'https://api.paystack.co/transaction/initialize',
    { amount: amount * 100, email },
    { headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET}` } }
  );

  return {
    reference: response.data.data.reference,
    checkoutUrl: response.data.data.authorization_url,
    externalId: response.data.data.reference
  };
};
