// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { firestore } from '../../../../lib/firebase/firestore';
import { User } from '../../../../lib/firebase/firestore/User';

interface GetUserByUidRequest extends NextApiRequest {
  query: {
    email: string;
  };
}

interface ResponseData {
  user: User | undefined;
}

export default async function handler(
  req: GetUserByUidRequest,
  res: NextApiResponse<ResponseData>
) {
  const { email } = req.query;
  const userSnapshot = await firestore
    .collection('users')
    .where('email', '==', email)
    .get();

  if (userSnapshot.empty) {
    return res.status(200).json({ user: undefined });
  }

  const user = userSnapshot.docs[0].data() as User;

  res.status(200).json({ user });
}
