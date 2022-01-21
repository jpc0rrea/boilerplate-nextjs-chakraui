import {
  Button,
  Divider,
  Flex,
  Heading,
  Image,
  Text,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import Head from 'next/head';
import Router from 'next/router';
import { yupResolver } from '@hookform/resolvers/yup';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';

import { Input } from '../components/Form/Input';
import { PasswordInput } from '../components/Form/PasswordInput';
// import { useAuth } from '../contexts/AuthContext';
import { withSSRGuest } from '../middlewares/pages/withSSRGuest';
import Link from 'next/link';
import { useAuth } from '../hooks/useAuth';
import { useCallback, useState } from 'react';
import sleep from '../utils/sleep';

type LoginFormData = FieldValues;

const SignInSchema = yup.object().shape({
  email: yup.string().email('E-mail inválido').required('E-mail obrigatório'),
  password: yup
    .string()
    .min(6, 'A senha tem que ter no mínimo 6 caracteres')
    .required('Senha obrigatória'),
});

export default function Login() {
  const toast = useToast();
  const { loginWithGoogle, loginWithEmailAndPassword } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined
  );
  const [isLoggingInWithGoogle, setIsLoggingInWithGoogle] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(SignInSchema),
  });

  const handleLoginWithGoogle = useCallback(async () => {
    setErrorMessage(undefined);
    setIsLoggingInWithGoogle(true);
    const { user, success, error } = await loginWithGoogle();

    if (!success) {
      toast({
        title: error,
        status: 'error',
        isClosable: true,
        position: 'top-right',
      });
      setErrorMessage(error);
      setIsLoggingInWithGoogle(false);
      return;
    }

    toast({
      title: 'Login realizado com sucesso!',
      description: `Bem vindo de volta ${user?.displayName}`,
      status: 'success',
      isClosable: true,
      position: 'top-right',
    });

    await sleep(500);

    setIsLoggingInWithGoogle(false);
    Router.push('/dashboard');
  }, [loginWithGoogle, toast]);

  const handleLoginWithEmailAndPassword: SubmitHandler<LoginFormData> = async (
    values
  ) => {
    setErrorMessage(undefined);
    const { email, password } = values;

    const { user, success, error } = await loginWithEmailAndPassword({
      email,
      password,
    });

    if (!success) {
      toast({
        title: error,
        status: 'error',
        isClosable: true,
        position: 'top-right',
      });
      setErrorMessage(error);
      return;
    }

    toast({
      title: 'Login realizado com sucesso!',
      description: `Bem vindo de volta ${user?.displayName}`,
      status: 'success',
      isClosable: true,
      position: 'top-right',
    });

    await sleep(500);

    Router.push('/dashboard');
  };

  const googleButtonBackgroundColor = useColorModeValue('gray.300', 'gray.700');
  const googleButtonHoverColor = useColorModeValue('gray.400', 'gray.800');

  return (
    <div>
      <Head>
        <title>Aposta Esportiva Bolão - Login</title>
      </Head>
      <Flex w="100vw" h="100vh" align="center" justify="center">
        <Flex
          width={['90%', '80%', '60%', '40%']}
          maxWidth={720}
          // bg={formFlexBgColor}
          padding="8"
          borderRadius={8}
          flexDirection="column"
          align="center"
          justify="center"
        >
          <Flex width="100%" align="flex-start" direction="column">
            <Heading fontSize="5xl" fontWeight="bold" marginBottom={['0', '2']}>
              Login
            </Heading>
            <Text marginBottom={['0', '2']} fontWeight="light">
              Bem vindo de volta! Faça login para ter acesso ao Aposta Esportiva
              Bolão.
            </Text>
          </Flex>
          <Flex
            as="form"
            width="100%"
            marginTop="4"
            direction="column"
            onSubmit={handleSubmit(handleLoginWithEmailAndPassword)}
          >
            {!!errorMessage && (
              <Text color="red.300" fontSize="sm">
                {errorMessage}
              </Text>
            )}
            <Input label="E-mail" error={errors.email} {...register('email')} />
            <PasswordInput
              label="Senha"
              error={errors.password}
              {...register('password')}
            />
            <Flex width="100%" align="flex-start" marginTop="2">
              <Link href="/forgot">
                <a>
                  <Text
                    fontWeight="bold"
                    _hover={{
                      textDecoration: 'underline',
                    }}
                  >
                    Esqueci a senha
                  </Text>
                </a>
              </Link>
            </Flex>
            <Button
              marginTop="4"
              colorScheme="yellow"
              mr={3}
              type="submit"
              isLoading={isSubmitting || isLoggingInWithGoogle}
            >
              Entrar
            </Button>
          </Flex>
          <Flex marginY="4" width="100%" align="center">
            <Divider width="100%" />
            <Text marginX="4">ou</Text>
            <Divider width="100%" />
          </Flex>
          <Button
            padding="6"
            onClick={handleLoginWithGoogle}
            isLoading={isLoggingInWithGoogle}
            backgroundColor={googleButtonBackgroundColor}
            _hover={{
              backgroundColor: googleButtonHoverColor,
            }}
          >
            <Image
              src="https://logopng.com.br/logos/google-37.png"
              boxSize="8"
              marginRight="4"
            />
            <Text fontWeight="normal">Faça login com o Google</Text>
          </Button>
          <Flex
            width="100%"
            align="center"
            justifyContent="center"
            marginTop="4"
          >
            <Link href="/signup">
              <a>
                <Text
                  fontWeight="bold"
                  _hover={{
                    textDecoration: 'underline',
                  }}
                >
                  Não tem conta ainda? Cadastre-se
                </Text>
              </a>
            </Link>
          </Flex>
        </Flex>
      </Flex>
    </div>
  );
}

export const getServerSideProps = withSSRGuest(async () => {
  return {
    props: {},
  };
});
