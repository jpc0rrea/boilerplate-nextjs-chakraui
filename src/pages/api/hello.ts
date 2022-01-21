// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { firestore } from '../../lib/firebase/firestore';

type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const usersCollection = await firestore.collection('users').get();
  usersCollection.forEach((user) => {
    console.log(user.data());
  });
  res.status(200).json({ name: 'John Doe' });
}
