export interface ICustomFields {
  label: string;
  value: string | string[];
  displayAs?: 'headline' | 'tag' | 'title' | 'none' | 'languages' | 'interests';
}
