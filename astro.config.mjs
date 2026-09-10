import { defineConfig } from 'astro/config';

// GitHub Actions provides GITHUB_REPOSITORY as "username/repository".
// This makes a normal project repository deploy correctly at
// https://username.github.io/repository/ without you editing this file.
const githubRepository = process.env.GITHUB_REPOSITORY;
const [githubOwner = '', repositoryName = ''] = githubRepository?.split('/') ?? [];
const buildingOnGitHub =
  process.env.GITHUB_ACTIONS === 'true' && githubOwner && repositoryName;
const userSiteRepository = repositoryName === `${githubOwner}.github.io`;

export default defineConfig({
  output: 'static',

  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
      config: {
        webp: {
          effort: 6,
          smartSubsample: true,
          preset: 'photo',
        },
      },
    },
  },

  ...(buildingOnGitHub
    ? {
        site: `https://${githubOwner}.github.io`,
        base: userSiteRepository ? '/' : `/${repositoryName}/`,
      }
    : {}),
});