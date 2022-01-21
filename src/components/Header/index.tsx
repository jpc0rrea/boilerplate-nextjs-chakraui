import { Flex, HStack, Tooltip, useToast } from '@chakra-ui/react';
import Head from 'next/head';
import { useState } from 'react';
import { RiLogoutBoxRLine } from 'react-icons/ri';
import { useAuth } from '../../hooks/useAuth';
import { IconButton } from '../Buttons/IconButton';
import Profile, { ProfileEskeleton } from './Profile';
import { ToogleThemeButton } from './ToogleThemeButton';

interface HeaderProps {
  title?: string;
}

export function Header({ title = '' }: HeaderProps) {
  const { isFirebaseUserLoading, signOut } = useAuth();
  const [alreadyLoggedOut, setAlreadyLoggedOut] = useState(false);

  const toast = useToast();

  const onSignOut = async () => {
    if (!alreadyLoggedOut) {
      await signOut();

      setTimeout(() => {
        toast({
          title: 'Logout feito com sucesso!',
          position: 'top-right',
          isClosable: true,
          status: 'success',
        });
      }, 500);

      setAlreadyLoggedOut(true);
    }
  };

  return (
    <div>
      <Head>
        <title>{`Aposta Esportiva Bolão${title ? ` - ${title}` : ''}`}</title>
      </Head>

      <Flex direction="column" width="100%">
        <Flex
          as="header"
          w="100%"
          h="20"
          mt="4" // Margem top
          px="6"
          align="center"
          justify="flex-end"
          maxH="20"
        >
          <Flex widht="100%" mx="4" textAlign="right" align="flex-end">
            <HStack>
              {isFirebaseUserLoading ? <ProfileEskeleton /> : <Profile />}

              <ToogleThemeButton />

              <Tooltip
                label="Sair da conta"
                fontSize={['xx-small', 'xx-small', 'sm']}
                hasArrow
              >
                <Flex>
                  <IconButton
                    aria-label="Logout"
                    remixIcon={RiLogoutBoxRLine}
                    onClick={onSignOut}
                  />
                </Flex>
              </Tooltip>
            </HStack>
          </Flex>
        </Flex>
      </Flex>
    </div>
  );
}
