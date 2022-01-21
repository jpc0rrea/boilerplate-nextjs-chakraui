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
import { updateProfile } from 'firebase/auth';
import { auth } from '../../../lib/firebase/client';
import { ConfirmChangesSection } from '../../Form/ConfirmChangesSection';
import { FirebaseError } from 'firebase/app';
import decodeFirebaseErrorCode from '../../../utils/decodeFirebaseErrorCode';

type UpdateNameFormData = FieldValues;

const UpdateNameSchema = yup.object().shape({
  name: yup.string().required('Nome é obrigatório'),
});

export default function NameInput() {
  const [isEdditing, setIsEdditing] = useState(false);
  const { firebaseUser, setFirebaseUser } = useAuth();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(UpdateNameSchema),
    defaultValues: {
      name: firebaseUser?.displayName,
    },
  });
  const toast = useToast();

  const handleUpdateName: SubmitHandler<UpdateNameFormData> = async (
    values
  ) => {
    const { name } = values;

    if (name === firebaseUser?.displayName) {
      setIsEdditing(false);
      toast({
        title: 'Nome alterado com sucesso',
        status: 'success',
        position: 'top-right',
        isClosable: true,
      });
      return;
    }

    if (auth.currentUser) {
      try {
        await updateProfile(auth.currentUser, {
          displayName: name,
        });

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
          name: firebaseUser?.displayName,
        });
        return;
      }
    }

    setIsEdditing(false);
    toast({
      title: 'Nome alterado com sucesso',
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
          onSubmit={handleSubmit(handleUpdateName)}
        >
          <Flex direction="column" width="100%">
            <Text color={profileInformationTitleColor}>Nome em exibição</Text>
            <Input
              backgroundColor={inputBackgroundColor}
              fontSize="xl"
              width="95%"
              error={errors.name}
              {...register('name')}
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
      <Text color={profileInformationTitleColor}>Nome em exibição</Text>
      <Flex width="100%" justifyContent="space-between" align="center">
        {!firebaseUser?.displayName ? (
          <Skeleton width="60%" height="8" />
        ) : (
          <Text fontSize="xl">{firebaseUser?.displayName}</Text>
        )}
        <Button colorScheme="yellow" onClick={() => setIsEdditing(true)}>
          Editar
        </Button>
      </Flex>
    </Flex>
  );
}
