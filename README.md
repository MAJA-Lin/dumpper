# Dumpper

Extract stuff from github issues

## Steps

- Create *Personal Access token* with at least **full access to repo section**
- Go to the Github pages (to skip Content Security Policy check)
- Copy code snippet from [ExportIssue.js](./src/ExportIssue.js) to browser -> developer console
- Paste the following code. You need to change *YOUR_GITHUB_PERSONAL_ACCESS_TOKEN* and *YOUR_AUTHOR_NAME* to your own.

```js
let obj = new ExportIssue({
    token: 'YOUR_GITHUB_PERSONAL_ACCESS_TOKEN',
    author: 'YOUR_AUTHOR_NAME',
    perPage: 100
});

obj.fetchAllIssues().then(() => {
    obj.removeDuplicatedData();
})
.then(() => {
    let csvContent = obj.toCSV();
    exportAsFile(csvContent, 'github_vt_working_history.csv', 'text/csv;charset=utf-8;');
});
```

Now you have your issues history in a .CSV file. Enjoy it!

*Optional*: For json file, you can run

```js
obj.fetchAllIssues().then(() => {
    obj.removeDuplicatedData();
})
.then(() => {
    exportAsFile(JSON.stringify(obj.result), 'github_vt_working_history.json', 'application/json;');
})
```


For people who might have issues more than 1000 (which hits the GitHub search limitation)

```js
obj.fetchAllIssues()
.then(() => {
    obj.removeDuplicatedData();
    obj.sortByCreatedAt();
})
.then(() => {
    return new Promise((resolve) => {
        setTimeout(() => resolve(), 1000 * 5);
    })
})
.then(() => {
    exportAsFile(JSON.stringify(obj.result), 'github_vt_working_history.json', 'application/json;');
})
```


Issues searching API example:
https://api.github.com/search/issues?q=api+type:issue+repo:voicetube/voicetube_web+author:majaja&sort=created&order=desc&per_page=50&page=1


## References:

- [Github - Create your personal access token](https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token#creating-a-token)

- [Github - REST API authentication](https://docs.github.com/en/rest/overview/resources-in-the-rest-api#authentication)

- [Github - Search issues and pull requests](https://docs.github.com/en/rest/reference/search#search-issues-and-pull-requests)

- [Github - Search only issues and PRs](https://docs.github.com/en/github/searching-for-information-on-github/searching-issues-and-pull-requests#search-only-issues-or-pull-requests)
