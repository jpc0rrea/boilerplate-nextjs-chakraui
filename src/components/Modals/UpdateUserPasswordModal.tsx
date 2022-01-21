import {
  Modal as ChakraModal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  Flex,
  useToast,
} from '@chakra-ui/react';
import * as yup from 'yup';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAuth } from '../../hooks/useAuth';
import { PasswordInput } from '../Form/PasswordInput';
import { auth } from '../../lib/firebase/client';
import { updatePassword } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import decodeFirebaseErrorCode from '../../utils/decodeFirebaseErrorCode';

interface ModalProps {
  isOpen: boolean;
  setIsOpen: () => void;
}

type UpdatePasswordFormData = FieldValues;

const UpdateUserPasswordSchema = yup.object().shape({
  newPassword: yup
    .string()
    .min(6, 'A senha tem que ter mais que 6 caracteres')
    .required('Senha obrigatória'),
  newPasswordConfirmation: yup
    .string()
    .oneOf([yup.ref('newPassword', undefined)], 'Senhas não conferem')
    .required('Confirmação de senha obrigatória'),
});

export default function UpdateUserPasswordModal({
  isOpen,
  setIsOpen,
}: ModalProps) {
  const { setFirebaseUser } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(UpdateUserPasswordSchema),
  });
  const toast = useToast();

  const handleUpdateUserPassword: SubmitHandler<
    UpdatePasswordFormData
  > = async (values) => {
    const { newPassword, newPasswordConfirmation } = values;

    if (newPassword !== newPasswordConfirmation) {
      toast({
        title: 'Senhas não conferem',
        status: 'error',
        isClosable: true,
        position: 'top-right',
      });
    }

    if (auth.currentUser) {
      try {
        await updatePassword(auth.currentUser, newPassword);

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
        return;
      }
    }

    toast({
      title: 'Senha alterada com sucesso',
      status: 'success',
      position: 'top-right',
      isClosable: true,
    });

    setIsOpen();
  };

  return (
    <ChakraModal isOpen={isOpen} onClose={setIsOpen}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign="center">Altere sua senha</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex
            as="form"
            direction="column"
            onSubmit={handleSubmit(handleUpdateUserPassword)}
          >
            <PasswordInput
              label="Nova senha"
              error={errors.newPassword}
              {...register('newPassword')}
            />
            <PasswordInput
              label="Confirmação da nova senha"
              error={errors.newPasswordConfirmation}
              {...register('newPasswordConfirmation')}
            />
            <Flex width="100%" justifyContent="space-around" marginTop="6">
              <Button
                colorScheme="green"
                type="submit"
                isLoading={isSubmitting}
              >
                Confirmar
              </Button>
              <Button
                colorScheme="red"
                variant="outline"
                onClick={setIsOpen}
                isLoading={isSubmitting}
              >
                Cancelar
              </Button>
            </Flex>
          </Flex>
        </ModalBody>
      </ModalContent>
    </ChakraModal>
  );
}
