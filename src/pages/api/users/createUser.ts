import type { NextApiResponse } from 'next';
import ensureAuthenticatedUser, {
  EnsureAuthenticatedRequest,
} from '../../../middlewares/api/ensureAuthenticatedUser';
import { createUserInFirestore } from '../../../lib/firebase/firestore/User';

const createUserHandler = async (
  req: EnsureAuthenticatedRequest,
  res: NextApiResponse
) => {
  const { uid } = req.user;
  const user = await createUserInFirestore({ uid });

  console.log(user);

  return res.status(200).json({ user });
};

export default ensureAuthenticatedUser(createUserHandler);
