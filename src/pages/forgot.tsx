import { Button, Flex, Heading, Text, useToast } from '@chakra-ui/react';
import Head from 'next/head';
import { yupResolver } from '@hookform/resolvers/yup';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { sendPasswordResetEmail } from 'firebase/auth';

import { Input } from '../components/Form/Input';
import { withSSRGuest } from '../middlewares/pages/withSSRGuest';
import Link from 'next/link';
import { auth } from '../lib/firebase/client';
import { FirebaseError } from 'firebase/app';
import decodeFirebaseErrorCode from '../utils/decodeFirebaseErrorCode';

type ForgotPasswordFormData = FieldValues;

const ForgotPasswordSchema = yup.object().shape({
  email: yup.string().email('E-mail inválido').required('E-mail obrigatório'),
});

export default function Login() {
  const toast = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(ForgotPasswordSchema),
  });

  const handleForgotPassword: SubmitHandler<ForgotPasswordFormData> = async (
    values
  ) => {
    const { email } = values;

    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      if (error instanceof FirebaseError) {
        const errorCode = error.code;
        console.log(errorCode);
        const decodedError = decodeFirebaseErrorCode(errorCode);
        toast({
          title: decodedError,
          status: 'error',
          position: 'top-right',
          isClosable: true,
        });
      }
      return;
    }
    toast({
      title: 'E-mail enviado com sucesso',
      description: 'Cheque sua caixa de entrada e altere sua senha.',
      status: 'success',
      position: 'top-right',
      isClosable: true,
    });
  };

  return (
    <div>
      <Head>
        <title>Aposta Esportiva Bolão - Esqueci a senha</title>
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
              Esqueci a senha
            </Heading>
            <Text marginBottom={['0', '2']} fontWeight="light">
              Digite o e-mail cadastrado na sua conta para receber um link para
              redefinir a senha
            </Text>
          </Flex>
          <Flex
            as="form"
            width="100%"
            marginTop="4"
            direction="column"
            onSubmit={handleSubmit(handleForgotPassword)}
          >
            <Input label="E-mail" error={errors.email} {...register('email')} />
            <Button
              marginTop="4"
              colorScheme="yellow"
              mr={3}
              type="submit"
              isLoading={isSubmitting}
            >
              Enviar e-mail
            </Button>
          </Flex>
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
                  Lembra da sua senha? Faça o login
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
