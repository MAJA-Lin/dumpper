# Dumpper

Extract stuff from github issues

## Steps

- Create *Personal Access token* with at least **full access to repo section**
- Copy code snippet from [ExportIssue.js](./src/ExportIssue.js) to browser -> developer console
- Change token & author and paste it into [this block](./src/ExportIssue.js#L83L87)

```js
let obj = new ExportIssue({
    token: 'YOUR_GITHUB_PERSONAL_ACCESS_TOKEN',
    author: 'YOUR_AUTHOR_NAME',
    perPage: 100
});
```

- Run it on Github pages (to skip Content Security Policy check)

Now you have your issues history in a .CSV file. Enjoy it!


Issues searching API example:
https://api.github.com/search/issues?q=api+type:issue+repo:voicetube/voicetube_web+author:majaja&sort=created&order=desc&per_page=50&page=1


## References:

- [Github - Create your personal access token](https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token#creating-a-token)

- [Github - REST API authentication](https://docs.github.com/en/rest/overview/resources-in-the-rest-api#authentication)

- [Github - Search issues and pull requests](https://docs.github.com/en/rest/reference/search#search-issues-and-pull-requests)

- [Github - Search only issues and PRs](https://docs.github.com/en/github/searching-for-information-on-github/searching-issues-and-pull-requests#search-only-issues-or-pull-requests)
