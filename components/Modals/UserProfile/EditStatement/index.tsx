import { Checkbox, Flex, Link } from '@chakra-ui/react';
import { useDAO, useEditProfile } from 'contexts';
import { FC } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const modules = {
  toolbar: [['bold', 'italic', 'underline', 'strike'], ['link'], ['clean']],
};

export const EditStatement: FC = () => {
  const { theme, daoInfo } = useDAO();
  const {
    newStatement,
    editStatementText,
    acceptedTerms,
    changeAcceptedTerms,
  } = useEditProfile();
  const newStatementValue = newStatement.value as string;

  const editorStyle = {
    '.quill': { minHeight: '200px' },
    '.ql-toolbar': {
      bg: theme.modal.background,
      color: theme.modal.statement.text,
      border: `1px solid ${theme.modal.statement.sidebar.item.border}`,
      borderTopRadius: '8px',
      fontFamily: 'Poppins, sans-serif',
    },
    '.ql-snow.ql-toolbar button:hover .ql-stroke ': {
      stroke: theme.modal.statement.sidebar.item.border,
    },
    '.ql-snow.ql-toolbar button.ql-active .ql-stroke': {
      stroke: theme.modal.statement.sidebar.item.border,
    },
    '.ql-snow.ql-toolbar button.ql-active': {
      color: theme.modal.statement.sidebar.item.border,
      stroke: theme.modal.statement.sidebar.item.border,
    },
    '.ql-formats': {
      button: {
        '.ql-stroke': {
          color: theme.modal.statement.sidebar.section,
          stroke: theme.modal.statement.sidebar.section,
        },
        '.ql-fill': {
          color: theme.modal.statement.sidebar.section,
          stroke: theme.modal.statement.sidebar.section,
          fill: theme.modal.statement.sidebar.section,
        },
      },
    },
    '.ql-picker-label': {
      color: theme.modal.statement.text,
    },
    '.ql-editor': {
      color: theme.modal.statement.sidebar.section,
      fontSize: 'sm',
    },
    '.ql-container': {},

    '.ql-active': {
      color: `${theme.modal.statement.text}`,
      '.ql-stroke': {
        stroke: `${theme.modal.statement.text}`,
      },
    },
  };

  return (
    <Flex flexDir="column" gap="1">
      <Flex
        maxW={{ base: '18rem', sm: 'full', lg: '30rem' }}
        minW={{ base: 'full', sm: '18rem', lg: '30rem' }}
        w="full"
        gap="4"
        flexDir="column"
        flex="1"
        sx={editorStyle}
        h="full"
        minH={{ base: 'full', sm: '18rem', lg: '16rem' }}
        maxH={{ base: 'full', sm: '18rem', lg: '16rem' }}
      >
        <ReactQuill
          theme="snow"
          value={newStatementValue}
          onChange={editStatementText}
          modules={modules}
        />
      </Flex>
      {daoInfo.config.TOS_URL ? (
        <Checkbox
          defaultChecked={acceptedTerms}
          onChange={event => changeAcceptedTerms(event.target.checked)}
        >
          I accept the{' '}
          <Link href={daoInfo.config.TOS_URL} isExternal textDecor="underline">
            Code of Conduct
          </Link>
          .
        </Checkbox>
      ) : null}
    </Flex>
  );
};

export default EditStatement;
