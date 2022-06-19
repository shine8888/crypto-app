import { JwtPayload } from 'jsonwebtoken';
export interface Decode {
  valid: Boolean;
  expired: Boolean;
  decoded: string | null | JwtPayload;
}
