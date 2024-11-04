/* eslint-disable no-param-reassign */
import { AxiosResponse } from 'axios';
import { api } from 'helpers';
import { ForumPosts } from 'types/delegate-compensation/forumActivity';

export const getForumActivity = async (
  month?: string | number,
  year?: string | number,
  forumHandle?: string
) => {
  try {
    const response: AxiosResponse<{
      data: { posts: ForumPosts[] };
    }> = await api.get(`/delegate/${forumHandle}/forum-posts`, {
      params: {
        month: month || undefined,
        year: year || undefined,
      },
    });
    const posts = response?.data?.data?.posts;
    if (!posts) throw new Error('No posts');
    posts.forEach(post => {
      post.topic = post.topic[0].toUpperCase() + post.topic.slice(1);
      post.topic = post.topic.replaceAll('-', ' ');
    });
    return posts;
  } catch (error) {
    console.error(error);
    return [];
  }
};
