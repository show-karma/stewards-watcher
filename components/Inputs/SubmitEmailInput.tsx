import {
  Button,
  ButtonProps,
  Flex,
  FlexProps,
  Input,
  InputProps,
} from '@chakra-ui/react';
import { useToasty } from 'hooks';
import { useState } from 'react';
import { validateEmail } from 'utils/validateEmail';

export const SubmitEmailInput: React.FC<{
  onSubmit?: (email: string) => void;
  flexProps?: FlexProps;
  inputProps?: InputProps;
  buttonProps?: ButtonProps;
}> = ({ onSubmit, flexProps, inputProps, buttonProps }) => {
  const [email, setEmail] = useState<string>('');

  const { toast } = useToasty();

  const handleInput = (str: string) => setEmail(str);

  const submit = () => {
    if (validateEmail(email)) {
      onSubmit?.(email);
    } else {
      toast({ title: 'You entered an invalid e-mail', status: 'error' });
    }
  };

  return (
    <Flex {...flexProps}>
      <Input
        type="email"
        onChange={event => handleInput(event.target.value)}
        backgroundColor="rgba(173, 184, 192, 0.25)"
        height="32px"
        placeholder="Your best e-mail"
        pr={8}
        fontSize={12}
        onKeyUp={event => event.key === 'Enter' && submit()}
        _placeholder={{
          color: 'rgba(0,0,0,0.5)',
        }}
        _focusVisible={{
          outline: 'none',
        }}
        {...inputProps}
      />
      <Button
        type="button"
        onClick={submit}
        backgroundColor="#606060"
        color="white"
        fontWeight="normal"
        fontSize={12}
        marginLeft={-2}
        px={6}
        height="32px"
        borderRadius={5}
        zIndex={2}
        __css={{}}
        {...buttonProps}
      >
        Submit
      </Button>
    </Flex>
  );
};
