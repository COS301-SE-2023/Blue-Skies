export default interface IKey {
  keyId: number;
  remainingCalls: number;
  suspended: number;
  owner: string;
  APIKey: number;
  isBusiness: number;
  description: string;
  location: string;
  website: string;
  phoneNumber: string;
  email: string;
}
