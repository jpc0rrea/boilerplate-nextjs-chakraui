import { Avatar, Flex, Skeleton, SkeletonCircle, Text } from '@chakra-ui/react';
import Link from 'next/link';
import { useAuth } from '../../hooks/useAuth';

export default function Profile() {
  const { firebaseUser } = useAuth();

  return (
    <Link href="/profile" passHref>
      <a>
        <Flex
          direction="column"
          marginRight={['2', '4']}
          transitionDuration="300ms"
          align="center"
          _hover={{
            filter: 'brightness(0.8)',
          }}
        >
          {/* <Avatar name={user?.name} size="md" src={user?.photoURL} /> */}
          <Avatar
            src={
              firebaseUser?.photoURL ? firebaseUser?.photoURL : '/no-img.png'
            }
            alt={`${firebaseUser?.displayName} foto de perfil`}
            size="md"
            name={
              firebaseUser?.displayName ? firebaseUser?.displayName : 'User'
            }
          />
          <Text
            fontWeight="bold"
            textAlign="center"
            fontSize={['sm', 'sm', 'medium']}
            marginTop="2"
            _hover={{
              textDecoration: 'underline',
            }}
          >
            {firebaseUser?.displayName}
          </Text>
        </Flex>
      </a>
    </Link>
  );
}

export function ProfileEskeleton() {
  return (
    <Flex direction="column" align="center">
      <SkeletonCircle size="12" />
      <Skeleton width="48" marginTop="2" height="4" />
    </Flex>
  );
}
