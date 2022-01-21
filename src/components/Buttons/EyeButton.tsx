import {
  IconButtonProps as ChakraIconButtonProps,
  IconButton as ChakraIconButton,
  Icon,
  useColorMode,
} from '@chakra-ui/react';
import { RiEyeCloseLine, RiEyeLine } from 'react-icons/ri';

interface IconButtonProps extends ChakraIconButtonProps {
  show: boolean;
}

export function EyeButton({ show, ...rest }: IconButtonProps) {
  const { colorMode } = useColorMode();
  return (
    <ChakraIconButton
      icon={show ? <Icon as={RiEyeLine} /> : <Icon as={RiEyeCloseLine} />}
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
