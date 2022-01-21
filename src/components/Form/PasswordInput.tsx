import {
  Input as ChakraInput,
  FormLabel,
  FormControl,
  InputProps as ChakraInputProps,
  useColorModeValue,
  InputGroup,
  InputRightElement,
  FormErrorMessage,
  useBreakpointValue,
} from '@chakra-ui/react';
import { useState, forwardRef, ForwardRefRenderFunction } from 'react';
import { FieldError } from 'react-hook-form';
import { EyeButton } from '../Buttons/EyeButton';

interface PasswordInputProps extends ChakraInputProps {
  name: string;
  label?: string;
  error?: FieldError;
}

const PasswordInputBase: ForwardRefRenderFunction<
  HTMLInputElement,
  PasswordInputProps
> = ({ name, label, error = null, ...rest }, ref) => {
  const backgroundColor = useColorModeValue('gray.400', 'gray.800');
  const hoverColor = useColorModeValue('gray.500', 'gray.900');

  const [show, setShow] = useState(false);
  const toogle = () => setShow(!show);

  const isMobileVersion = useBreakpointValue({
    base: true,
    sm: true,
    md: false,
  });
  return (
    <FormControl isInvalid={!!error} id={`form-control-${name}`}>
      {!!label && (
        <FormLabel htmlFor={name} marginTop="4">
          {label}
        </FormLabel>
      )}

      <InputGroup>
        <ChakraInput
          name={name}
          id={name}
          type={show ? 'text' : 'password'}
          focusBorderColor="brand.yellow"
          backgroundColor={backgroundColor}
          variant="filled"
          align="center"
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
        <InputRightElement align="center" height="100%" mr="2">
          <EyeButton
            show={show}
            aria-label="Toogle theme"
            onClick={toogle}
            marginBottom={rest.marginBottom ?? ''}
          />
        </InputRightElement>
      </InputGroup>

      {!!error && <FormErrorMessage>{error.message}</FormErrorMessage>}
    </FormControl>
  );
};

export const PasswordInput = forwardRef(PasswordInputBase);
