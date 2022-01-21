import type { NextApiResponse } from 'next';
import { getUserDetails } from '../../../lib/firebase/firestore/User';
import ensureAuthenticatedUser, {
  EnsureAuthenticatedRequest,
} from '../../../middlewares/api/ensureAuthenticatedUser';

const getUserDetailsHandler = async (
  req: EnsureAuthenticatedRequest,
  res: NextApiResponse
) => {
  const { uid } = req.user;

  const user = await getUserDetails(uid);

  return res.status(200).json({ user });
};

export default ensureAuthenticatedUser(getUserDetailsHandler);
