const GITHUB_USERNAME_PATTERN =
  /^[A-Za-z0-9](?:[A-Za-z0-9]|-(?=[A-Za-z0-9])){0,38}$/;

/** Return whether a value matches the syntax GitHub allows for account names. */
export function isGitHubUsername(value: string): boolean {
  return GITHUB_USERNAME_PATTERN.test(value);
}
