import type { CollectionConfig } from '../../../src/collections/config/types';

const VersionPosts: CollectionConfig = {
  slug: 'version-posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'description', 'createdAt'],
    preview: () => 'https://payloadcms.com',
  },
  versions: {
    drafts: false,
    maxPerDoc: 35,
    retainDeleted: false,
  },
  access: {
    read: ({ req: { user } }) => {
      if (user) {
        return true;
      }

      return {
        or: [
          {
            _status: {
              equals: 'published',
            },
          },
          {
            _status: {
              exists: false,
            },
          },
        ],
      };
    },
    readVersions: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'title',
      label: 'Title',
      type: 'text',
      required: true,
      unique: true,
      localized: true,
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      required: true,
    },
  ],
};

export default VersionPosts;
