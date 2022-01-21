import { Flex, Text } from '@chakra-ui/react';
import { Header } from '../components/Header';
import { useAuth } from '../hooks/useAuth';
import { withSSRUser } from '../middlewares/pages/withSSRUser';

export default function Profile() {
  const { firebaseUser } = useAuth();
  return (
    <Flex direction="column" h="100vh">
      <Header />
      <Flex direction="column">
        <Text>{`Firebase name: ${firebaseUser?.displayName}`}</Text>
        <Text>{`Firebase uid: ${firebaseUser?.uid}`}</Text>
      </Flex>
    </Flex>
  );
}

export const getServerSideProps = withSSRUser(async () => {
  return {
    props: {},
  };
});
