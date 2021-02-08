let token = 'token ' + '';
let author = '';
let assignee = '';
let page = 1;
let urlIssues = 'https://api.github.com/search/issues?q=+type:issue+repo:voicetube/voicetube_web+author:'
    + author
    + '&sort=created&order=desc&per_page=10&page='
    + page;
fetch(urlIssues, {
    method: 'GET',
    headers: {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': token,
    }
})
.then(response => response.json())
.then(({ items }) => {
  // console.log(items);
  // items.forEach((item) => console.log(JSON.stringify(item, null, 2)));
  const formatedItems = items.map((item) => ({
    id: item.id,
    title: item.title,
    url: item.html_url,
    score: item.score,
    description: item.body,
    milestoneTitle: item.milestone.title,
    createdAt: item.created_at,
    assignees: item.assignees.map((a) => a.login).join(','),
    labels: item.labels.map((l) => l.name).join(','),
  }))
})