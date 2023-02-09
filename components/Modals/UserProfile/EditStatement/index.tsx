import { Flex, Text } from '@chakra-ui/react';
import { useDAO, useEditStatement } from 'contexts';
import { FC } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const modules = {
  toolbar: [['bold', 'italic', 'underline', 'strike'], ['link'], ['clean']],
};

export const EditStatement: FC = () => {
  const { theme } = useDAO();
  const { newStatement, editStatementText } = useEditStatement();
  const newStatementValue = newStatement.value as string;

  const editorStyle = {
    '.quill': { minHeight: '200px' },
    '.ql-toolbar': {
      bg: '#1C1E21',
      color: theme.modal.statement.text,
      border: `1px solid ${theme.modal.statement.sidebar.item.border}`,
      borderTopRadius: '8px',
      fontFamily: 'Poppins, sans-serif',
    },
    '.ql-picker-label': {
      color: theme.modal.statement.text,
    },
    '.ql-editor': {
      color: theme.modal.statement.sidebar.section,
      fontSize: 'sm',
    },
    '.ql-container': {
      bg: '#1C1E21',
      color: theme.modal.statement.text,
      height: '100%',
      border: `1px solid ${theme.modal.statement.sidebar.item.border}`,
      borderBottomRadius: '8px',
      fontFamily: 'Poppins, sans-serif',
    },
    '.ql-active': {
      color: `${theme.modal.statement.text}`,
      '.ql-stroke': {
        stroke: `${theme.modal.statement.text}`,
      },
    },
  };

  return (
    <Flex maxW="30rem" gap="4" flexDir="column" flex="1" sx={editorStyle}>
      <Text color={theme.modal.statement.text}>Write your statement</Text>
      <ReactQuill
        theme="snow"
        value={newStatementValue}
        onChange={editStatementText}
        modules={modules}
      />
    </Flex>
  );
};

export default EditStatement;
