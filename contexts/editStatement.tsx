import React, { useContext, createContext, useMemo, useState } from 'react';

import { useIsMounted } from 'hooks/useIsMounted';
import { useToasty } from 'hooks';
import { ICustomFields, IProfile } from 'types';
import { api, AxiosClient, KARMA_API } from 'helpers';
import { useAccount } from 'wagmi';
import axios from 'axios';
import { useDelegates } from './delegates';
import { useDAO } from './dao';
import { useAuth } from './auth';

interface IEditStatementProps {
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  isEditSaving: boolean;
  saveEdit: () => void;
  profile: IProfile;
  statement: ICustomFields;
  languages: ICustomFields;
  interests: ICustomFields;
  newStatement: ICustomFields;
  newInterests: ICustomFields;
  isLoadingStatement: boolean;
  editInterests: (selectedInterest: string) => void;
  defaultInterests: string[];
  editStatementText: (text: string) => void;
}

export const EditStatementContext = createContext({} as IEditStatementProps);

interface ProviderProps {
  children: React.ReactNode;
}

const defaultInterests = [
  'Accessibility',
  'DAOs',
  'Data analytics',
  'DeFi',
  'Writing',
  'Economics',
  'Events',
  'Identity',
  'Environment',
  'Governance',
  'Infrastructure',
  'Legal',
  'NFT',
  'Music',
  'Messaging',
  'Oracles',
  'Privacy',
  'Security',
  'Social Impact',
];

export const EditStatementProvider: React.FC<ProviderProps> = ({
  children,
}) => {
  const isMounted = useIsMounted();
  const { isConnected } = useAccount();
  const [isEditing, setIsEditing] = useState(false);
  const [isEditSaving, setEditSaving] = useState(false);
  const [value, setValue] = useState('');
  const { toast } = useToasty();
  const { profileSelected } = useDelegates();
  const { daoInfo } = useDAO();
  const { address } = useAccount();
  const { authToken, isAuthenticated } = useAuth();
  const { config } = daoInfo;

  const [statement, setStatement] = useState<ICustomFields>({
    label: '',
    value: [],
  } as ICustomFields);
  const [languages, setLanguages] = useState<ICustomFields>({
    label: '',
    value: [],
  } as ICustomFields);
  const [interests, setInterests] = useState<ICustomFields>({
    label: '',
    value: [],
  } as ICustomFields);

  const [isLoadingStatement, setIsLoadingStatement] = useState(false);

  const profile: IProfile = {
    address: profileSelected?.address || '',
    avatar:
      profileSelected?.profilePicture ||
      `${config.IMAGE_PREFIX_URL}${profileSelected?.address}` ||
      '',
    ensName: profileSelected?.ensName || '',
    twitter: profileSelected?.twitterHandle || '',
    aboutMe: profileSelected?.aboutMe || '',
    realName: profileSelected?.realName || '',
  };

  const [newInterests, setNewInterests] = useState({
    label: '',
    value: [],
  } as ICustomFields);
  const [newStatement, setNewStatement] = useState<ICustomFields>({
    label: '',
    value: [],
  } as ICustomFields);

  const queryStatement = async () => {
    if (!profile.address) return;
    setIsLoadingStatement(true);
    try {
      const { data } = await api.get(
        `/forum-user/${config.DAO_KARMA_ID}/delegate-pitch/${profile.address}`
      );

      const customFields: ICustomFields[] =
        data?.data.delegatePitch.customFields;
      const emptyField: ICustomFields = { label: '', value: [] };

      let fetchedInterests =
        customFields?.find(item =>
          item.label.toLowerCase().includes('interests')
        ) || emptyField;

      const fetchedStatement =
        customFields?.find(
          (item: { value: string | string[]; label: string }) =>
            typeof item.value === 'string' && item.label.includes('statement')
        ) || emptyField;

      if (fetchedInterests.value.length) {
        const interestsValue = Array.isArray(fetchedInterests.value)
          ? fetchedInterests.value
          : fetchedInterests.value.split(',');
        const trimmedMap = interestsValue.map((item: string) => item.trim());
        fetchedInterests = {
          ...fetchedInterests,
          value: trimmedMap,
        };
      }

      setInterests(fetchedInterests);
      setStatement(fetchedStatement);
      setNewInterests(fetchedInterests);
      setNewStatement(fetchedStatement);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingStatement(false);
    }
  };

  const editInterests = (selectedInterest: string) => {
    const newInterestsValue = Array.isArray(newInterests.value)
      ? newInterests.value
      : newInterests.value.split(',');
    const findInterest = newInterestsValue.find(
      item => item === selectedInterest
    );

    if (findInterest) {
      const filtered = newInterestsValue.filter(
        (item: string) => item !== selectedInterest
      );
      setNewInterests({ ...newInterests, value: filtered });
      return;
    }
    newInterestsValue.push(selectedInterest);
    setNewInterests({
      ...newInterests,
      value: newInterestsValue,
    });
  };

  useMemo(() => {
    queryStatement();
  }, [profileSelected]);

  const saveEdit = async () => {
    setIsEditing(true);
    setEditSaving(true);
    try {
      const hasStatement =
        profileSelected?.delegatePitch ||
        profileSelected?.delegatePitch?.customFields?.length;
      const authorizedAPI = axios.create({
        timeout: 30000,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: authToken ? `Bearer ${authToken}` : '',
        },
      });
      if (hasStatement) {
        await authorizedAPI.put(
          `${KARMA_API.base_url}/forum-user/${daoInfo.config.DAO_KARMA_ID}/delegate-pitch/${profileSelected?.address}`,
          {
            customFields: [newInterests, newStatement],
            forum: '0',
            threadId: 0,
            postId: 0,
            discourseHandle: '0',
          }
        );
      } else {
        await authorizedAPI.post(
          `${KARMA_API.base_url}/forum-user/${daoInfo.config.DAO_KARMA_ID}/delegate-pitch/${profileSelected?.address}`,
          {
            customFields: [
              {
                label: 'Interests',
                value: newInterests.value,
                displayAs: 'interests',
              },
              newStatement,
            ],
            forum: '0',
            threadId: 0,
            postId: 0,
            discourseHandle: '0',
          }
        );
      }
      await queryStatement();
      toast({
        description: 'Your profile has been saved',
        status: 'success',
      });
    } catch (error: any) {
      console.error(error);
      toast({
        description: 'We could not save your profile. Please try again.',
        status: 'error',
      });
    } finally {
      setEditSaving(false);
      setIsEditing(false);
    }
  };

  useMemo(() => {
    setIsEditing(false);
    if (address?.toLowerCase() === profileSelected?.address?.toLowerCase()) {
      setIsEditing(true);
    }
  }, [address, profileSelected]);

  const editStatementText = (text: string) => {
    if (newStatement.value) {
      setNewStatement({
        ...newStatement,
        value: text || [],
      });
    }
    setNewStatement({
      label: 'statement',
      displayAs: 'headline',
      value: text || [],
    });
  };

  const providerValue = useMemo(
    () => ({
      isEditing,
      setIsEditing,
      value,
      setValue,
      isEditSaving,
      saveEdit,
      profile,
      statement,
      languages,
      interests,
      isLoadingStatement,
      defaultInterests,
      editInterests,
      newStatement,
      newInterests,
      editStatementText,
    }),
    [
      isEditing,
      setIsEditing,
      value,
      setValue,
      isEditSaving,
      profile,
      statement,
      languages,
      interests,
      isLoadingStatement,
      editInterests,
      defaultInterests,
      newStatement,
      newInterests,
      editStatementText,
    ]
  );

  return isMounted ? (
    <EditStatementContext.Provider value={providerValue}>
      {children}
    </EditStatementContext.Provider>
  ) : null;
};

export const useEditStatement = () => useContext(EditStatementContext);
