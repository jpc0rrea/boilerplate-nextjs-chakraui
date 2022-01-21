import {
  Input as ChakraInput,
  FormLabel,
  FormControl,
  InputProps as ChakraInputProps,
  useColorModeValue,
  FormErrorMessage,
  ComponentWithAs,
  useBreakpointValue,
} from '@chakra-ui/react';
import { forwardRef, ForwardRefRenderFunction } from 'react';
import { FieldError } from 'react-hook-form';
import { default as ReactMaskedInput } from 'react-text-mask';

interface MaskedInputProps extends ChakraInputProps {
  name: string;
  mask: string;
  label?: string;
  error?: FieldError;
}

interface MaskedChakraInputProps extends Omit<ChakraInputProps, 'ref'> {
  ref?: React.RefCallback<
    (HTMLInputElement & { inputElement: HTMLInputElement }) | null
  >;
}

const MaskedChakraInput: ComponentWithAs<'input', MaskedChakraInputProps> =
  ChakraInput;

const MaskedInputBase: ForwardRefRenderFunction<
  HTMLInputElement,
  MaskedInputProps
> = ({ name, mask, label, error, ...rest }, ref) => {
  const backgroundColor = useColorModeValue('gray.200', 'gray.800');
  const hoverColor = useColorModeValue('gray.300', 'gray.900');

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

      <MaskedChakraInput
        as={ReactMaskedInput}
        mask={mask}
        name={name}
        id={name}
        focusBorderColor="back.500"
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
        ref={(data) => {
          if (typeof ref === 'function') {
            if (data && data.inputElement) {
              ref(data.inputElement);
            } else {
              ref(data);
            }
          }
        }}
        {...rest}
      />

      {!!error && <FormErrorMessage>{error.message}</FormErrorMessage>}
    </FormControl>
  );
};

export const MaskedInput = forwardRef(MaskedInputBase);
