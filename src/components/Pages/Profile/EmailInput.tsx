import {
  Flex,
  Text,
  Button,
  useColorModeValue,
  Skeleton,
  HStack,
  useToast,
} from '@chakra-ui/react';
import { useState } from 'react';
import * as yup from 'yup';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAuth } from '../../../hooks/useAuth';
import { Input } from '../../Form/Input';
import { updateEmail } from 'firebase/auth';
import { auth } from '../../../lib/firebase/client';
import { ConfirmChangesSection } from '../../Form/ConfirmChangesSection';
import { FirebaseError } from 'firebase/app';
import decodeFirebaseErrorCode from '../../../utils/decodeFirebaseErrorCode';

type UpdateEmailFormData = FieldValues;

const UpdateEmailSchema = yup.object().shape({
  email: yup.string().email('E-mail inválido').required('E-mail é obrigatório'),
});

export default function EmailInput() {
  const [isEdditing, setIsEdditing] = useState(false);
  const { firebaseUser, setFirebaseUser } = useAuth();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(UpdateEmailSchema),
    defaultValues: {
      email: firebaseUser?.email,
    },
  });
  const toast = useToast();

  const handleUpdateEmail: SubmitHandler<UpdateEmailFormData> = async (
    values
  ) => {
    const { email } = values;

    if (email === firebaseUser?.email) {
      setIsEdditing(false);
      toast({
        title: 'E-mail alterado com sucesso',
        status: 'success',
        position: 'top-right',
        isClosable: true,
      });
      return;
    }

    if (auth.currentUser) {
      try {
        await updateEmail(auth.currentUser, email);

        // Update the user in the context
        await auth.currentUser.reload();
        const refreshedUser = {
          ...auth.currentUser,
        };
        setFirebaseUser(refreshedUser);
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
        reset({
          email: firebaseUser?.email,
        });
        return;
      }
    }

    setIsEdditing(false);
    toast({
      title: 'E-mail alterado com sucesso',
      status: 'success',
      position: 'top-right',
      isClosable: true,
    });
  };

  const onCancelChanges = () => {
    setIsEdditing(false);
  };

  const profileInformationTitleColor = useColorModeValue(
    'gray.600',
    'gray.500'
  );

  const inputBackgroundColor = useColorModeValue('gray.100', 'gray.700');

  if (isEdditing) {
    return (
      <HStack justify="space-between" align="center" spacing="2">
        <Flex
          as="form"
          width="100%"
          align="flex-end"
          marginBottom="2"
          onSubmit={handleSubmit(handleUpdateEmail)}
        >
          <Flex direction="column" width="100%">
            <Text color={profileInformationTitleColor}>Email</Text>
            <Input
              backgroundColor={inputBackgroundColor}
              fontSize="xl"
              width="95%"
              error={errors.email}
              {...register('email')}
            />
          </Flex>
          <ConfirmChangesSection
            onCancelChanges={onCancelChanges}
            isSavingChanges={isSubmitting}
          />
        </Flex>
      </HStack>
    );
  }

  return (
    <Flex direction="column" width="100%" marginBottom="4">
      <Text color={profileInformationTitleColor}>Email</Text>
      <Flex width="100%" justifyContent="space-between" align="center">
        {!firebaseUser?.email ? (
          <Skeleton width="60%" height="8" />
        ) : (
          <Text fontSize="xl">{firebaseUser?.email}</Text>
        )}
        <Button colorScheme="yellow" onClick={() => setIsEdditing(true)}>
          Editar
        </Button>
      </Flex>
    </Flex>
  );
}
