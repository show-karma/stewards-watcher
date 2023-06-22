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
  onSubmit?: (email: string) => Promise<void> | void;
  flexProps?: FlexProps;
  inputProps?: InputProps;
  buttonProps?: ButtonProps;
}> = ({ onSubmit, flexProps, inputProps, buttonProps }) => {
  const [email, setEmail] = useState<string>('');
  const [done, setDone] = useState(false);

  const { toast } = useToasty();

  const handleInput = (str: string) => setEmail(str);

  const submit = async () => {
    if (validateEmail(email)) {
      await onSubmit?.(email);
      setDone(true);
    } else {
      toast({ title: 'You entered an invalid e-mail', status: 'error' });
    }
  };

  return (
    <Flex {...flexProps}>
      <Input
        type="email"
        onChange={event => handleInput(event.target.value)}
        backgroundColor="#FFFFFF"
        height="32px"
        placeholder="Your best e-mail"
        pr={8}
        fontSize={12}
        readOnly={done}
        onKeyUp={event => event.key === 'Enter' && submit()}
        _placeholder={{
          color: 'rgba(0,0,0,0.5)',
        }}
        _focusVisible={{
          outline: 'none',
        }}
        w="full"
        borderRadius="4px"
        {...inputProps}
      />
      <Button
        type="button"
        onClick={submit}
        backgroundColor="#7E8C9D"
        color="white"
        fontWeight="normal"
        fontSize={12}
        marginLeft={-2}
        px={6}
        height="32px"
        borderRadius={3}
        zIndex={2}
        isDisabled={done}
        __css={{}}
        {...buttonProps}
      >
        Submit
      </Button>
    </Flex>
  );
};
