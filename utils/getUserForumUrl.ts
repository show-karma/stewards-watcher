import { IForumType } from 'types';

export const getUserForumUrl = (
  user: string,
  forumType: IForumType,
  forumUrl: string
) => {
  const urlToForum = forumUrl + forumUrl.slice(-1) !== '/' && '/';
  if (forumType === 'commonwealth') return `${urlToForum}account/${user}`;
  return `${forumUrl}u/${user}`;
};
