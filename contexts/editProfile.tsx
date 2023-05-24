import React, { useContext, createContext, useMemo, useState } from 'react';

import { useIsMounted } from 'hooks/useIsMounted';
import { useToasty } from 'hooks';
import { ICustomFields, IProfile } from 'types';
import { api, API_ROUTES, KARMA_API } from 'helpers';
import { useAccount } from 'wagmi';
import axios from 'axios';
import { useDelegates } from './delegates';
import { useDAO } from './dao';
import { useAuth } from './auth';

interface IEditProfileProps {
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
  editName: (text: string) => void;
  editProfilePicture: (url: string | null) => void;
  newName: string | null;
  newProfilePicture: string | null;
  changeHandle: (
    newHandle: string,
    media: 'twitter' | 'forum'
  ) => Promise<void>;
  acceptedTerms: boolean;
  changeAcceptedTerms: (choice: boolean) => void;
}

export const EditProfileContext = createContext({} as IEditProfileProps);

interface ProviderProps {
  children: React.ReactNode;
}

const presetInterests = [
  'Identity',
  'Security',
  'NFT',
  'DAOs',
  'Governance',
  'Legal',
];

export const EditProfileProvider: React.FC<ProviderProps> = ({ children }) => {
  const isMounted = useIsMounted();
  const { isConnected } = useAccount();
  const [isEditing, setIsEditing] = useState(false);
  const [isEditSaving, setEditSaving] = useState(false);
  const [value, setValue] = useState('');
  const [newName, setNewName] = useState<string | null>(null);
  const [newProfilePicture, setNewProfilePicture] = useState<string | null>(
    null
  );
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const { toast } = useToasty();
  const {
    profileSelected,
    interests: delegatesInterests,
    refreshProfileModal,
    fetchDelegates,
  } = useDelegates();
  const { daoInfo } = useDAO();
  const { address } = useAccount();
  const { authToken, isAuthenticated, isDaoAdmin } = useAuth();
  const { config } = daoInfo;

  const defaultInterests = delegatesInterests.length
    ? delegatesInterests
    : presetInterests;

  const defaultCustomFields: ICustomFields = {
    label: '',
    value: [],
  };

  const [statement, setStatement] =
    useState<ICustomFields>(defaultCustomFields);
  const [languages, setLanguages] =
    useState<ICustomFields>(defaultCustomFields);
  const [interests, setInterests] =
    useState<ICustomFields>(defaultCustomFields);

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

  const [newInterests, setNewInterests] = useState(defaultCustomFields);
  const [newStatement, setNewStatement] =
    useState<ICustomFields>(defaultCustomFields);

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
        customFields?.find(
          item =>
            item.label.toLowerCase().includes('interests') ||
            item.displayAs === 'interests'
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
      setInterests(defaultCustomFields);
      setStatement(defaultCustomFields);
      setNewInterests(defaultCustomFields);
      setNewStatement(defaultCustomFields);

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
      setNewInterests({
        ...newInterests,
        value: filtered,
        label: 'Interests',
        displayAs: 'interests',
      });
      return;
    }
    newInterestsValue.push(selectedInterest);
    setNewInterests({
      ...newInterests,
      value: newInterestsValue,
      label: 'Interests',
      displayAs: 'interests',
    });
  };

  const changeAcceptedTerms = async (choice: boolean) => {
    try {
      const authorizedAPI = axios.create({
        timeout: 30000,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: authToken ? `Bearer ${authToken}` : '',
        },
      });
      await authorizedAPI.put(
        API_ROUTES.DELEGATE.TERMS_OF_SERVICE(daoInfo.config.DAO_KARMA_ID)
      );
      setAcceptedTerms(choice);
    } catch (error) {
      console.error(error);
    }
  };

  useMemo(() => {
    if (profileSelected) {
      queryStatement();
      setNewName(profileSelected.realName || profileSelected.ensName || '');
      setNewProfilePicture(profileSelected.profilePicture || '');
    }
  }, [profileSelected]);

  const hasDelegatePitch = async (): Promise<ICustomFields[] | undefined> => {
    try {
      const { data } = await api.get(
        `/forum-user/${config.DAO_KARMA_ID}/delegate-pitch/${profile.address}`
      );
      return data?.data.delegatePitch;
    } catch (error) {
      return undefined;
    }
  };

  const saveEdit = async () => {
    setIsEditing(true);
    setEditSaving(true);
    const fetchedDelegatePitch = await hasDelegatePitch();
    let hasError = false;
    let actualError = '';
    if (
      newInterests.value !== interests.value ||
      newStatement.value !== statement.value
    ) {
      try {
        const authorizedAPI = axios.create({
          timeout: 30000,
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: authToken ? `Bearer ${authToken}` : '',
          },
        });
        if (fetchedDelegatePitch) {
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
      } catch (error: any) {
        hasError = true;
        actualError = error.response.data.error.message;
      }
    }

    if (
      profileSelected?.address !== newName ||
      profileSelected?.profilePicture !== newProfilePicture
    ) {
      try {
        const authorizedAPI = axios.create({
          timeout: 30000,
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: authToken ? `Bearer ${authToken}` : '',
          },
        });
        if (!profileSelected) return;

        const handleField = (
          constant: string | null,
          originalConstant?: string
        ) => {
          if (constant === null) return null;
          if (constant === originalConstant) return undefined;
          if (constant) return constant;
          return undefined;
        };

        await authorizedAPI.put(
          `${KARMA_API.base_url}/user/${config.DAO_KARMA_ID}/${profileSelected.address}`,
          {
            name: handleField(
              newName,
              profileSelected.realName || profileSelected.ensName || ''
            ),
            profilePicture: handleField(
              newProfilePicture,
              profileSelected?.profilePicture
            ),
          }
        );
        refreshProfileModal('statement');
      } catch (error: any) {
        hasError = true;
        actualError = error.response.data.error.message;
      } finally {
        setEditSaving(false);
        setIsEditing(false);
      }
    }

    if (hasError) {
      toast({
        title: 'We could not save your profile. Please try again.',
        description: actualError,
        status: 'error',
      });
    } else {
      toast({
        description: 'Your profile has been saved',
        status: 'success',
      });
    }
  };

  const changeHandle = async (
    newHandle: string,
    media: 'twitter' | 'forum'
  ) => {
    try {
      const authorizedAPI = axios.create({
        timeout: 30000,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: authToken ? `Bearer ${authToken}` : '',
        },
      });
      await authorizedAPI
        .put(
          `${KARMA_API.base_url}/user/${daoInfo.config.DAO_KARMA_ID}/handles/${profileSelected?.address}`,
          {
            [`${media}Handle`]: newHandle,
          }
        )
        .then(() => {
          refreshProfileModal('handles');
          fetchDelegates(0);
        });
      toast({
        description: `${
          media.charAt(0).toUpperCase() + media.slice(1)
        } has been saved`,
        status: 'success',
      });
    } catch (error: any) {
      if (error.response?.data?.error?.message)
        toast({
          status: 'error',
          description: error.response.data.error.message,
        });
    }
  };

  useMemo(() => {
    setIsEditing(false);
    if (
      (address?.toLowerCase() === profileSelected?.address?.toLowerCase() &&
        isConnected &&
        isAuthenticated) ||
      isDaoAdmin
    ) {
      setIsEditing(true);
    }
  }, [address]);

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

  const editName = (text: string) => {
    if (text === '') {
      setNewName(null);
      return;
    }
    setNewName(text);
  };

  const editProfilePicture = (url: string | null) => {
    setNewProfilePicture(url);
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
      newName,
      editName,
      newProfilePicture,
      editProfilePicture,
      changeHandle,
      changeAcceptedTerms,
      acceptedTerms,
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
      newName,
      editName,
      newProfilePicture,
      editProfilePicture,
      changeHandle,
      changeAcceptedTerms,
      acceptedTerms,
    ]
  );

  return isMounted ? (
    <EditProfileContext.Provider value={providerValue}>
      {children}
    </EditProfileContext.Provider>
  ) : null;
};

export const useEditProfile = () => useContext(EditProfileContext);
