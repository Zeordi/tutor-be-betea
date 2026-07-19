import { registerAs } from '@nestjs/config';

export default registerAs('veriff', () => ({
  apiKey: process.env.VERIFF_API_KEY,
  baseUrl: process.env.VERIFF_BASE_URL,
}));
