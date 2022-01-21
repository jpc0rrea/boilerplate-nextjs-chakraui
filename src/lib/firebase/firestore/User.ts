import { firestore } from '.';

export interface User {
  role: string;
  totalPoints: {
    [key: string]: number;
  };
}

interface CreateUserInFirestoreData {
  uid: string;
}

export async function createUserInFirestore({
  uid,
}: CreateUserInFirestoreData): Promise<User> {
  const user: User = {
    role: 'user',
    totalPoints: {},
  };

  const userRef = firestore.collection('users').doc(uid);
  await userRef.set(user);

  return user;
}

export async function getUserDetails(
  userId: string
): Promise<User | undefined> {
  const userSnapshot = await firestore.doc(`users/${userId}`).get();
  const user = userSnapshot.data() as User | undefined;

  return user;
}

interface UpdateUserRequest {
  user: User;
  uid: string;
}

export async function updateUser({
  user,
  uid,
}: UpdateUserRequest): Promise<User | undefined> {
  const userRef = firestore.doc(`users/${uid}`);
  await userRef.set(user);

  return user;
}
