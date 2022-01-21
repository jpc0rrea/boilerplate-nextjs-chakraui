import {
  Avatar,
  Button,
  Flex,
  Heading,
  SkeletonCircle,
  Text,
  useColorModeValue,
  useToast,
  VStack,
} from '@chakra-ui/react';
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { updateProfile } from 'firebase/auth';
import { useRouter } from 'next/router';
import { ChangeEvent, useState } from 'react';
import { RiArrowLeftLine } from 'react-icons/ri';
import { IconButton } from '../components/Buttons/IconButton';
import UploadButton from '../components/Buttons/UploadButton';
import { Header } from '../components/Header';
import { useAuth } from '../hooks/useAuth';
import { auth, storage } from '../lib/firebase/client';
import { convertNumberToPercentage } from '../utils/convertNumberToPercentage';
import { withSSRUser } from '../middlewares/pages/withSSRUser';
import getUserPhotoPath from '../utils/getUserPhotoPath';
import NameInput from '../components/Pages/Profile/NameInput';
import EmailInput from '../components/Pages/Profile/EmailInput';
import UpdateUserPasswordModal from '../components/Modals/UpdateUserPasswordModal';

export default function Profile() {
  const [isUploading, setIsUploading] = useState(false);
  const [alreadyLoggedOut, setAlreadyLoggedOut] = useState(false);
  const [isUpdateUserPasswordModalOpen, setIsUpdateUserPasswordModalOpen] =
    useState(false);
  const [progress, setProgress] = useState('0%');
  const toast = useToast();
  const {
    firebaseUser,
    setFirebaseUser,
    isFirebaseUserLoading,
    setIsFirebaseUserLoading,
    signOut,
  } = useAuth();
  const router = useRouter();

  function ToogleUpdateUserPasswordModal() {
    setIsUpdateUserPasswordModalOpen(!isUpdateUserPasswordModalOpen);
  }

  const uploadPhoto = async (event: ChangeEvent<HTMLInputElement>) => {
    setIsUploading(true);
    setIsFirebaseUserLoading(true);
    const file = event.target.files ? event.target.files[0] : null;

    if (!file) {
      setIsUploading(false);
      return;
    }
    const extension = file.type.split('/')[1];

    // Makes reference to the storage bucket location
    const storageRef = ref(
      storage,
      `uploads/${firebaseUser?.uid}/${Date.now()}.${extension}`
    );
    setIsUploading(true);

    // Starts the upload
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress = convertNumberToPercentage(
          snapshot.bytesTransferred / snapshot.totalBytes
        );
        console.log('Upload is ' + progress + '% done');
        setProgress(progress);
        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          case 'running':
            console.log('Upload is running');
            break;
        }
      },
      (error) => {
        setIsUploading(false);
        // Handle unsuccessful uploads
        console.log(error);
      },
      async () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          const downloadURLWithoutToken = downloadURL.split('&token=')[0];

          const userOldPhotoPath = getUserPhotoPath(firebaseUser);

          if (auth.currentUser) {
            try {
              // Set the user photoURL as this
              await updateProfile(auth.currentUser, {
                photoURL: downloadURLWithoutToken,
              });

              // Delete the older photo if it's aplicable
              if (userOldPhotoPath) {
                const oldPhotoRef = ref(storage, `uploads/${userOldPhotoPath}`);

                await deleteObject(oldPhotoRef);
              }

              // Update the user in the context
              await auth.currentUser.reload();
              const refreshedUser = {
                ...auth.currentUser,
              };
              setFirebaseUser(refreshedUser);
            } catch (error) {
              console.log(error);
            }
          } else {
            toast({
              title: 'Erro ao atualizar foto de perfil',
              description: 'Tente novamente mais tarde',
              status: 'error',
              isClosable: true,
              position: 'top-right',
            });

            setIsUploading(false);
            setIsFirebaseUserLoading(false);
            return;
          }
        });

        toast({
          title: 'Foto de perfil atualizada com sucesso',
          status: 'success',
          position: 'top-right',
          isClosable: true,
        });
        setIsFirebaseUserLoading(false);
        setIsUploading(false);
      }
    );
  };

  const handleDeleteUserPhoto = async () => {
    setIsFirebaseUserLoading(true);
    const userOldPhotoPath = getUserPhotoPath(firebaseUser);

    if (auth.currentUser) {
      try {
        // Set the user photoURL as this
        await updateProfile(auth.currentUser, {
          photoURL: '',
        });

        // Delete the older photo if it's aplicable
        if (userOldPhotoPath) {
          const oldPhotoRef = ref(storage, `uploads/${userOldPhotoPath}`);

          await deleteObject(oldPhotoRef);
        }

        // Update the user in the context
        await auth.currentUser.reload();
        const refreshedUser = {
          ...auth.currentUser,
        };
        setFirebaseUser(refreshedUser);
      } catch (error) {
        console.log(error);
      }
    } else {
      toast({
        title: 'Erro ao excluir foto de perfil',
        description: 'Tente novamente mais tarde',
        status: 'error',
        isClosable: true,
        position: 'top-right',
      });

      setIsUploading(false);
      setIsFirebaseUserLoading(false);
      return;
    }

    toast({
      title: 'Foto de perfil deletada com sucesso',
      status: 'success',
      position: 'top-right',
      isClosable: true,
    });
    setIsFirebaseUserLoading(false);
    setIsUploading(false);
  };

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

  const profileInformationsBackgroundColor = useColorModeValue(
    'gray.300',
    'gray.800'
  );

  return (
    <Flex direction="column" h="100vh">
      <Header />
      <UpdateUserPasswordModal
        isOpen={isUpdateUserPasswordModalOpen}
        setIsOpen={ToogleUpdateUserPasswordModal}
      />
      <Flex width="100%" marginY="6" marginX="auto" paddingBottom="6">
        <Flex paddingX="8" width="100%" direction="column">
          <Flex align="center">
            <IconButton
              remixIcon={RiArrowLeftLine}
              aria-label="Back to last page"
              marginRight="4"
              onClick={() => router.back()}
            />
            <Heading size="lg">Minha conta</Heading>
          </Flex>
          <Flex width="100%" justify="center" direction="column">
            <Flex align="center" marginTop="6" justify="center">
              <Flex marginRight="4">
                {isFirebaseUserLoading ? (
                  <SkeletonCircle height="28" width="28" />
                ) : (
                  <Avatar
                    key={firebaseUser?.photoURL}
                    src={
                      firebaseUser?.photoURL
                        ? firebaseUser?.photoURL
                        : '/no-img.png'
                    }
                    size="xl"
                    name={
                      firebaseUser?.displayName
                        ? firebaseUser?.displayName
                        : 'User'
                    }
                  />
                )}
                {/* <Avatar
                  imageUrl={firebaseUser?.photoURL}
                  alt={`${firebaseUser?.displayName} foto de perfil`}
                  width={12}
                  height={12}
                  isLoading={isReactFirebaseHookUserLoading}
                /> */}
              </Flex>
              <VStack spacing="4" align="flex-start">
                <Text fontWeight="bold">{firebaseUser?.displayName}</Text>
                <Flex justifyContent="space-between">
                  <UploadButton
                    onChange={uploadPhoto}
                    isUploading={isUploading}
                    progress={progress}
                  />
                  <Button
                    colorScheme="red"
                    variant="outline"
                    size="sm"
                    onClick={handleDeleteUserPhoto}
                    isLoading={isUploading || isFirebaseUserLoading}
                    isDisabled={
                      isUploading ||
                      isFirebaseUserLoading ||
                      !firebaseUser?.photoURL
                    }
                  >
                    Deletar foto
                  </Button>
                </Flex>
              </VStack>
            </Flex>
            <Flex
              borderRadius="12"
              backgroundColor={profileInformationsBackgroundColor}
              padding="8"
              marginTop="8"
              width="80%"
              alignSelf="center"
              direction="column"
            >
              <NameInput />
              <EmailInput />
              <Flex width="100%" justify="space-around" marginTop="4">
                <Button onClick={ToogleUpdateUserPasswordModal}>
                  Alterar senha
                </Button>
                <Button onClick={onSignOut} isLoading={alreadyLoggedOut}>
                  Sair da conta
                </Button>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}

export const getServerSideProps = withSSRUser(async () => {
  return {
    props: {},
  };
});
