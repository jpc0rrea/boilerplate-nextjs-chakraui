import {
  Button,
  Divider,
  Flex,
  Heading,
  Image,
  Text,
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

type SignUpFormData = FieldValues;

const signUpSchema = yup.object().shape({
  name: yup.string().required('Nome é obrigatório'),
  email: yup.string().email('E-mail inválido').required('E-mail obrigatório'),
  password: yup
    .string()
    .min(6, 'A senha tem que ter mais que 6 caracteres')
    .required('Senha obrigatória'),
  // password confirmation valiidation
  passwordConfirmation: yup
    .string()
    .oneOf([yup.ref('password', undefined)], 'Senhas não conferem')
    .required('Confirmação de senha obrigatória'),
});

export default function SignUp() {
  const toast = useToast();
  const { loginWithGoogle, signUpWithEmailAndPassword } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined
  );
  const [isLoggingInWithGoogle, setIsLoggingInWithGoogle] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(signUpSchema),
  });

  const handleLoginWithGoogle = useCallback(async () => {
    setIsLoggingInWithGoogle(true);
    setErrorMessage(undefined);
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
      title: 'Conta criada com sucesso!',
      description: `Bem vindo ${user?.displayName}`,
      status: 'success',
      isClosable: true,
      position: 'top-right',
    });

    await sleep(500);

    setIsLoggingInWithGoogle(false);

    Router.push('/dashboard');
  }, [loginWithGoogle, toast]);

  const handleSignUp: SubmitHandler<SignUpFormData> = async (values) => {
    setErrorMessage(undefined);
    const { name, email, password, passwordConfirmation } = values;
    const { user, success, error } = await signUpWithEmailAndPassword({
      name,
      email,
      password,
      passwordConfirmation,
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
      title: 'Conta criada com sucesso!',
      description: `Bem vindo ${user?.displayName}`,
      status: 'success',
      isClosable: true,
      position: 'top-right',
    });

    await sleep(500);

    Router.push('/dashboard');
  };

  // const formFlexBgColor = useColorModeValue('gray.200', 'gray.700');
  // const subtitleColor = useColorModeValue('gray.600', 'gray.400');

  return (
    <div>
      <Head>
        <title>Bolão App - Criar conta</title>
      </Head>
      <Flex w="100vw" h="100vh" align="center" justify="center" paddingTop="6">
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
              Cadastro
            </Heading>
            <Text marginBottom={['0', '2']} fontWeight="light">
              Bem vindo ao Aposta Esportiva Bolão! Crie sua conta para ter
              acesso ao sistema.
            </Text>
          </Flex>
          <Flex
            as="form"
            width="100%"
            marginTop="4"
            direction="column"
            onSubmit={handleSubmit(handleSignUp)}
          >
            {!!errorMessage && (
              <Text color="red.300" fontSize="sm">
                {errorMessage}
              </Text>
            )}
            <Input label="Nome" error={errors.name} {...register('name')} />
            <Input label="E-mail" error={errors.email} {...register('email')} />
            <PasswordInput
              label="Senha"
              error={errors.password}
              {...register('password')}
            />
            <PasswordInput
              label="Confirmação de senha"
              error={errors.passwordConfirmation}
              {...register('passwordConfirmation')}
            />

            <Button
              marginTop="4"
              colorScheme="yellow"
              mr={3}
              type="submit"
              isLoading={isSubmitting || isLoggingInWithGoogle}
            >
              Criar conta
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
          >
            <Image
              src="https://logopng.com.br/logos/google-37.png"
              boxSize="8"
              marginRight="4"
            />
            <Text fontWeight="normal">Se cadastre com o Google</Text>
          </Button>
          <Flex
            width="100%"
            align="center"
            justifyContent="center"
            marginTop="4"
          >
            <Link href="/login">
              <a>
                <Text
                  fontWeight="bold"
                  _hover={{
                    textDecoration: 'underline',
                  }}
                >
                  Já tem conta? Faça login
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
