import { Flex, HStack, Spinner } from '@chakra-ui/react';
import { RiCheckLine, RiCloseLine } from 'react-icons/ri';
import { IconButton } from '../Buttons/IconButton';

interface IconsSectionsProps {
  onConfirmChanges(): void;
  onCancelChanges(): void;
  isSavingChanges: boolean;
}

export function IconsSection({
  onConfirmChanges,
  onCancelChanges,
  isSavingChanges,
}: IconsSectionsProps) {
  if (isSavingChanges) {
    return <Spinner minWidth="6" minHeight="6" />;
  }
  return (
    <HStack>
      <IconButton
        size="xs"
        fontSize="16"
        aria-label="Confirm changes"
        remixIcon={RiCheckLine}
        onClick={onConfirmChanges}
        color="primary.500"
      />

      <Flex height="16px" borderWidth="1px" borderColor="gray.700" />

      <IconButton
        size="xs"
        fontSize="16"
        aria-label="Confirm changes"
        remixIcon={RiCloseLine}
        onClick={onCancelChanges}
        color="red.400"
      />
    </HStack>
  );
}
