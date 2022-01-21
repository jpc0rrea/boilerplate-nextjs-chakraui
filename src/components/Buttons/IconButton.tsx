import {
  IconButtonProps as ChakraIconButtonProps,
  IconButton as ChakraIconButton,
  Icon,
  useColorMode,
} from '@chakra-ui/react';

import { IconType } from 'react-icons';

interface IconButtonProps extends ChakraIconButtonProps {
  remixIcon: IconType;
}

export function IconButton({ remixIcon, ...rest }: IconButtonProps) {
  const { colorMode } = useColorMode();
  return (
    <ChakraIconButton
      icon={<Icon as={remixIcon} />}
      variant="solid"
      fontSize="20"
      bg="inherit"
      _hover={{
        bgColor: colorMode === 'light' ? 'gray.300' : 'whiteAlpha.300',
      }}
      {...rest}
    />
  );
}
