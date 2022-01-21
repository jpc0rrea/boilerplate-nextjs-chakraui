import {
  Input as ChakraInput,
  FormLabel,
  FormControl,
  InputProps as ChakraInputProps,
  useColorModeValue,
  FormErrorMessage,
  useBreakpointValue,
} from '@chakra-ui/react';
import { forwardRef, ForwardRefRenderFunction } from 'react';
import { FieldError } from 'react-hook-form';

interface InputProps extends ChakraInputProps {
  name: string;
  label?: string;
  error?: FieldError;
}

const InputBase: ForwardRefRenderFunction<HTMLInputElement, InputProps> = (
  { name, label, error = null, ...rest },
  ref
) => {
  const backgroundColor = useColorModeValue('gray.400', 'gray.800');
  const hoverColor = useColorModeValue('gray.500', 'gray.900');

  const isMobileVersion = useBreakpointValue({
    base: true,
    sm: true,
    md: false,
  });
  return (
    <FormControl isInvalid={!!error} id={`form-control-${name}`}>
      {!!label && (
        <FormLabel htmlFor={name} marginTop="2">
          {label}
        </FormLabel>
      )}

      <ChakraInput
        name={name}
        id={name}
        backgroundColor={backgroundColor}
        variant="filled"
        _hover={{
          bgColor: hoverColor,
        }}
        _focus={{
          bgColor: hoverColor,
        }}
        size={isMobileVersion ? 'sm' : 'lg'}
        borderRadius={isMobileVersion ? 'md' : 'lg'}
        ref={ref}
        {...rest}
      />

      {!!error && <FormErrorMessage>{error.message}</FormErrorMessage>}
    </FormControl>
  );
};

export const Input = forwardRef(InputBase);
