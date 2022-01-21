import { ChangeEvent } from 'react';
import { Button, Text } from '@chakra-ui/react';

interface UploadButtonProps {
  onChange: (event: ChangeEvent<HTMLInputElement>) => Promise<void>;
  isUploading: boolean;
  progress: string;
}

export default function UploadButton({
  onChange,
  isUploading,
  progress,
}: UploadButtonProps) {
  return (
    <>
      <Button
        as="label"
        colorScheme="yellow"
        marginRight="4"
        size="sm"
        transitionProperty="all"
        transitionDuration="300ms"
        _hover={{
          filter: 'brightness(0.8)',
          cursor: 'pointer',
        }}
        isLoading={isUploading}
        loadingText={progress}
      >
        <input
          // className="cursor-pointer absolute block py-2 px-4 w-full opacity-0 pin-r pin-t z-40"
          className="hidden cursor-pointer"
          type="file"
          onChange={onChange}
          accept="image/x-png,image/gif,image/jpeg"
        />
        <Text
          _hover={{
            cursor: 'pointer',
          }}
        >
          Alterar foto
        </Text>
      </Button>
    </>
  );
}
