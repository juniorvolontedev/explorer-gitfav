export class GithubUser {
  static search(username) {
    return fetch(`https://api.github.com/users/${username}`)
      .then((data) => data.json())
      .then(({ avatar_url, url, login, name, public_repos, followers }) => ({
        avatar_url,
        url,
        login,
        name,
        public_repos,
        followers,
      }));
  }
}
