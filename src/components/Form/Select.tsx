import {
  FormLabel,
  FormControl,
  useColorModeValue,
  FormErrorMessage,
  Select as ChakraSelect,
  SelectProps as ChakraSelectProps,
  useBreakpointValue,
} from '@chakra-ui/react';
import { forwardRef, ForwardRefRenderFunction } from 'react';
import { FieldError } from 'react-hook-form';

interface SelectInputProps extends ChakraSelectProps {
  name: string;
  options: string[];
  placeholder: string;
  label?: string;
  error?: FieldError;
}

const SelectInputBase: ForwardRefRenderFunction<
  HTMLSelectElement,
  SelectInputProps
> = ({ options, name, placeholder, label, error = null, ...rest }, ref) => {
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

      <ChakraSelect
        name={name}
        id={name}
        placeholder={placeholder}
        backgroundColor={backgroundColor}
        _hover={{
          bgColor: hoverColor,
        }}
        _focus={{
          bgColor: hoverColor,
        }}
        height="12"
        paddingBottom="0"
        border="0"
        size={isMobileVersion ? 'sm' : 'lg'}
        borderRadius={isMobileVersion ? 'md' : 'lg'}
        ref={ref}
        {...rest}
      >
        {options.map((option) => {
          return (
            <option value={option} key={option}>
              {option}
            </option>
          );
        })}
      </ChakraSelect>

      {!!error && <FormErrorMessage>{error.message}</FormErrorMessage>}
    </FormControl>
  );
};

export const Select = forwardRef(SelectInputBase);
