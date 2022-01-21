import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from 'next';
import { parseCookies } from 'nookies';
import { ADMIN_EMAILS } from '../../lib/contants';
import { admin } from '../../lib/firebase/admin';

export function withSSRUser<P>(fn: GetServerSideProps<P>) {
  return async (
    ctx: GetServerSidePropsContext
  ): Promise<GetServerSidePropsResult<P>> => {
    const cookies = parseCookies(ctx);

    if (!cookies['apostaesportivabolao.token']) {
      return {
        redirect: {
          destination: '/login',
          permanent: false,
        },
      };
    }

    const token = cookies['apostaesportivabolao.token'];

    const decodedToken = await admin.auth().verifyIdToken(token);

    const { uid, email } = decodedToken;

    console.log(uid, email);
    console.log(ADMIN_EMAILS);

    return await fn(ctx);
  };
}
