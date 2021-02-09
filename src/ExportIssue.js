class ExportIssue {
    constructor(context) {
        this.token = `token ${context.token}`;
        this.author = context.author;
        this.perPage = context?.perPage || 100;
    }

    get typeFilter() {
        return [
            `author:${this.author}`,
            `assignee:${this.author}`,
        ]
    }

    fetchIssues(page, filter) {
        fetch(
            `https://api.github.com/search/issues?q=+type:issue+repo:voicetube/voicetube_web+`
            + `${filter}&sort=created&order=desc&per_page=${this.perPage}&page=${page}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/vnd.github.v3+json',
                'Authorization': this.token,
            }
        })
        .then(response => response.json())
        .then((response) => {
            const formatedItems = response.items.map((item) => ({
                id: item.id,
                title: item.title,
                url: item.html_url,
                score: item.score,
                description: item.body,
                milestoneTitle: item?.milestone?.title || '',
                createdAt: item.created_at,
                assignees: item.assignees.map((a) => a.login).join(','),
                labels: item.labels.map((l) => l.name).join(','),
            }));
        })
    }
}