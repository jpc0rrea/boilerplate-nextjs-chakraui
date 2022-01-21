import { Flex, Tooltip, useColorMode } from '@chakra-ui/react';
import { RiSunLine, RiMoonLine } from 'react-icons/ri';
import { IconButton } from '../Buttons/IconButton';

export function ToogleThemeButton() {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Tooltip
      label={`Ativar ${colorMode === 'light' ? 'dark' : 'light'} mode`}
      fontSize={['xx-small', 'smaller', 'sm']}
      hasArrow
    >
      <Flex>
        <IconButton
          aria-label="Toogle theme"
          remixIcon={colorMode === 'light' ? RiMoonLine : RiSunLine}
          onClick={toggleColorMode}
        />
      </Flex>
    </Tooltip>
  );
}
