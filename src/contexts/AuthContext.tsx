import {
  createContext,
  ReactNode,
  useState,
  useEffect,
  useCallback,
  Dispatch,
  SetStateAction,
} from 'react';
import { setCookie, destroyCookie } from 'nookies';
import {
  createUserWithEmailAndPassword,
  User as FirebaseUser,
  signOut as firebaseSignOut,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  updateProfile,
  fetchSignInMethodsForEmail,
} from 'firebase/auth';

import { User } from '../lib/firebase/firestore/User';
import { nextApi } from '../lib/api';
import decodeFirebaseErrorCode from '../utils/decodeFirebaseErrorCode';
import { FirebaseError } from 'firebase/app';
import Router from 'next/router';
import { auth } from '../lib/firebase/client';

interface SignInCredentials {
  email: string;
  password: string;
}

interface SignInResponse {
  user: FirebaseUser | null;
  success: boolean;
  error?: string;
}

export interface SignUpCredentials {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}

interface SignUpResponse {
  user: FirebaseUser | null;
  success: boolean;
  error?: string;
}

export interface AuthContextData {
  signUpWithEmailAndPassword: ({
    name,
    email,
    password,
    passwordConfirmation,
  }: SignUpCredentials) => Promise<SignUpResponse>;
  loginWithEmailAndPassword: ({
    email,
    password,
  }: SignInCredentials) => Promise<SignInResponse>;
  loginWithGoogle: () => Promise<SignUpResponse>;
  signOut: () => Promise<void>;
  firebaseUser: FirebaseUser | null;
  isFirebaseUserLoading: boolean;
  setIsFirebaseUserLoading: Dispatch<SetStateAction<boolean>>;
  setFirebaseUser: Dispatch<SetStateAction<FirebaseUser | null>>;
  user: User | null;
  isUserLoading: boolean;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isFirebaseUserLoading, setIsFirebaseUserLoading] = useState(true);
  const [isUserLoading, setIsUserLoading] = useState(true);

  useEffect(() => {
    return auth.onIdTokenChanged(async (user) => {
      setIsFirebaseUserLoading(true);
      if (!user) {
        setFirebaseUser(null);
        destroyCookie(undefined, 'apostaesportivabolao.token');
        setIsFirebaseUserLoading(false);
      } else {
        const token = await user.getIdToken();
        setFirebaseUser(user);
        setCookie(undefined, 'apostaesportivabolao.token', token, {
          maxAge: 60 * 60 * 24, // 1 day
        });
        setIsFirebaseUserLoading(false);
      }
    });
  }, []);

  // force refresh the token every 10 minutes
  useEffect(() => {
    const handle = setInterval(async () => {
      const currentUser = auth.currentUser;
      if (currentUser) await currentUser.getIdToken(true);
    }, 10 * 60 * 1000); // 10 minutes in miliseconds

    // clean up setInterval
    return () => clearInterval(handle);
  }, []);

  const signUpWithEmailAndPassword = useCallback(
    async ({
      name,
      email,
      password,
      passwordConfirmation,
    }: SignUpCredentials): Promise<SignUpResponse> => {
      if (password !== passwordConfirmation) {
        return {
          user: null,
          success: false,
          error: 'As senhas não conferem',
        };
      }

      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        const userInAuth = userCredential.user;

        const token = await userInAuth.getIdToken();

        setCookie(undefined, 'apostaesportivabolao.token', token, {
          maxAge: 60 * 60 * 24, // 1 day
        });

        // Adicionar o nome ao usuário
        await updateProfile(userInAuth, {
          displayName: name,
        });

        // Criar usuário no banco
        try {
          const createUserResponse = await nextApi.post<{ user: User }>(
            'users/createUser'
          );

          const { user } = createUserResponse.data;

          setUser(user);
          setIsUserLoading(false);

          return {
            user: userInAuth,
            success: true,
          };
        } catch (error) {
          if (error instanceof FirebaseError) {
            const errorCode = error.code;
            console.log(errorCode);
            return {
              user: null,
              success: false,
              error: decodeFirebaseErrorCode(errorCode),
            };
          }

          return {
            user: null,
            success: false,
            error: 'Um erro aconteceu. Tente novamente mais tarde.',
          };
        }
      } catch (error: unknown) {
        if (error instanceof FirebaseError) {
          const errorCode = error.code;
          console.log(errorCode);
          return {
            user: null,
            success: false,
            error: decodeFirebaseErrorCode(errorCode),
          };
        }
        return {
          user: null,
          success: false,
          error: 'Um erro aconteceu. Tente novamente mais tarde.',
        };
      }
    },
    []
  );

  const loginWithEmailAndPassword = useCallback(
    async ({ email, password }: SignInCredentials): Promise<SignInResponse> => {
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

        const userInAuth = userCredential.user;

        const token = await userInAuth.getIdToken();

        setCookie(undefined, 'apostaesportivabolao.token', token, {
          maxAge: 60 * 60 * 24, // 1 day
        });

        // Buscar usuário no banco
        try {
          const getUserDetailsResponse = await nextApi.get<{
            user: User | undefined;
          }>('users/getUserDetails');

          const { user } = getUserDetailsResponse.data;

          if (user) {
            setUser(user);
            setIsUserLoading(false);

            return {
              user: userInAuth,
              success: true,
            };
          } else {
            // não consegui pegar o user no banco
            return {
              user: null,
              success: false,
              error: 'Não foi possível encontrar o usuário no banco de dados',
            };
          }
        } catch (error) {
          if (error instanceof FirebaseError) {
            const errorCode = error.code;
            console.log(errorCode);
            return {
              user: null,
              success: false,
              error: decodeFirebaseErrorCode(errorCode),
            };
          }

          return {
            user: null,
            success: false,
            error: 'Um erro aconteceu. Tente novamente mais tarde.',
          };
        }
      } catch (error: unknown) {
        if (error instanceof FirebaseError) {
          const errorCode = error.code;
          console.log(errorCode);
          if (errorCode === 'auth/wrong-password') {
            const providers = await fetchSignInMethodsForEmail(auth, email);
            if (providers.length) {
              if (providers[0] === 'google.com') {
                return {
                  user: null,
                  success: false,
                  error:
                    'A senha digitada está incorreta. Você pode usar a conta do Google para fazer login.',
                };
              }
              return {
                user: null,
                success: false,
                error: decodeFirebaseErrorCode(errorCode),
              };
            }

            return {
              user: null,
              success: false,
              error: 'Credenciais incorretas',
            };
          }
          return {
            user: null,
            success: false,
            error: decodeFirebaseErrorCode(errorCode),
          };
        }
        return {
          user: null,
          success: false,
          error: 'Um erro aconteceu. Tente novamente mais tarde.',
        };
      }
    },
    []
  );

  const loginWithGoogle = useCallback(async () => {
    const googleAuthProvider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, googleAuthProvider);

      const userInAuth = result.user;

      const token = await userInAuth.getIdToken();

      setCookie(undefined, 'apostaesportivabolao.token', token, {
        maxAge: 60 * 60 * 24, // 1 day
      });

      // Tentar buscar o usuário no banco
      const getUserDetailsResponse = await nextApi.get<{
        user: User | undefined;
      }>('users/getUserDetails');

      const { user } = getUserDetailsResponse.data;

      if (user) {
        // se ele já existir, eu só atualizo o state user
        setUser(user);
        setIsUserLoading(false);

        return {
          user: userInAuth,
          success: true,
          message: 'User logged in with Google',
        };
      } else {
        // se ele não existir, crio ele no banco
        // Criar usuário no banco
        try {
          const createUserResponse = await nextApi.post<{ user: User }>(
            'users/createUser'
          );

          const { user } = createUserResponse.data;

          setUser(user);
          setIsUserLoading(false);

          return {
            user: userInAuth,
            success: true,
          };
        } catch (error) {
          if (error instanceof FirebaseError) {
            const errorCode = error.code;
            console.log(errorCode);
            return {
              user: null,
              success: false,
              error: decodeFirebaseErrorCode(errorCode),
            };
          }

          return {
            user: null,
            success: false,
            error: 'Um erro aconteceu. Tente novamente mais tarde.',
          };
        }
      }
    } catch (error) {
      if (error instanceof FirebaseError) {
        const errorCode = error.code;
        console.log(errorCode);
        return {
          user: null,
          success: false,
          error: decodeFirebaseErrorCode(errorCode),
        };
      }

      return {
        user: null,
        success: false,
        error: 'Um erro aconteceu. Tente novamente mais tarde.',
      };
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      Router.push('/login');
      await firebaseSignOut(auth);
      setUser(null);
      setIsUserLoading(false);
      destroyCookie(undefined, 'apostaesportivabolao.token');
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        firebaseUser,
        setFirebaseUser,
        isFirebaseUserLoading,
        setIsFirebaseUserLoading,
        user,
        isUserLoading,
        signUpWithEmailAndPassword,
        loginWithEmailAndPassword,
        loginWithGoogle,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
