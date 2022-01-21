import { Button, ButtonProps, Flex, HStack } from '@chakra-ui/react';

interface ConfirmChangesSectionProps extends ButtonProps {
  onCancelChanges(): void;
  isSavingChanges: boolean;
}

export function ConfirmChangesSection({
  onCancelChanges,
  isSavingChanges,
  ...rest
}: ConfirmChangesSectionProps) {
  return (
    <HStack marginBottom="1">
      <Button
        colorScheme="green"
        type="submit"
        isLoading={isSavingChanges}
        {...rest}
      >
        Confirmar
      </Button>

      <Flex height="10" borderWidth="1px" borderColor="gray.700" />
      <Button
        colorScheme="red"
        variant="outline"
        onClick={onCancelChanges}
        isLoading={isSavingChanges}
        {...rest}
      >
        Cancelar
      </Button>
    </HStack>
  );
}
