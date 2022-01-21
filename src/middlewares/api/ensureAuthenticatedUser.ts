import { NextApiRequest, NextApiResponse } from 'next';
import { destroyCookie } from 'nookies';
import { admin } from '../../lib/firebase/admin';

export interface EnsureAuthenticatedRequest extends NextApiRequest {
  user: {
    uid: string;
  };
}

export default function ensureAuthenticatedUser(
  handler: (
    req: EnsureAuthenticatedRequest,
    res: NextApiResponse
  ) => Promise<void>
) {
  return async (req: EnsureAuthenticatedRequest, res: NextApiResponse) => {
    try {
      const token = req.cookies['apostaesportivabolao.token'];

      if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const decodedToken = await admin.auth().verifyIdToken(token);

      const { uid } = decodedToken;

      req.user = {
        uid,
      };

      return handler(req, res);
    } catch (error) {
      console.log(error);
      destroyCookie({ res }, 'apostaesportivabolao.token');
      return res.status(401).json({ message: 'Unauthorized' });
    }
  };
}
