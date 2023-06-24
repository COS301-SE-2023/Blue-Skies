export default interface IKey {
  keyId: number;
  owner: string;
  APIKey: number;
  remainingCalls: number;
  suspended: boolean;
}
