import { User } from 'firebase/auth';

export default function getUserPhotoPath(user: User | null) {
  // check if this user has the old photo on my Firebase Storage
  try {
    if (user && user?.photoURL && user.photoURL.split('uploads%2F')) {
      return user.photoURL
        .split('uploads%2F')[1]
        .split('?alt=media')[0]
        .replace('%2F', '/');
    } else {
      return '';
    }
  } catch {
    return '';
  }
}
