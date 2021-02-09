class ExportIssue {
    constructor(context) {
        this.token = `token ${context.token}`;
        this.author = context.author;
        this.perPage = context?.perPage || 100;
        this.result = [];
    }

    get typeFilter() {
        return [
            `author:${this.author}`,
            `assignee:${this.author}`,
        ]
    }

    async fetchAllIssues() {
        const pageCounts = await Promise.all(this.typeFilter.map((type) => {
            return this.fetchMaxPage(type);
        }));

        return Promise.all(this.typeFilter.flatMap((type, index) => {
            return Array(pageCounts[index]).fill('').map((item, i) => {
                return this.fetchIssues(i, type);
            });
        }))
    }

    fetchMaxPage(filter) {
        return fetch(
            `https://api.github.com/search/issues?q=+type:issue+repo:voicetube/voicetube_web+`
            + `${filter}&sort=created&order=desc&per_page=1&page=1`, {
            method: 'GET',
            headers: {
                'Accept': 'application/vnd.github.v3+json',
                'Authorization': this.token,
            }
        })
        .then(response => response.json())
        .then((response) => {
            return Math.ceil(response.total_count / this.perPage);
        });
    }

    fetchIssues(page, filter) {
        return fetch(
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
            this.result = this.result.concat(response.items.map((item) => {
                const storyPoint = item.labels.find((label) => {
                    return label.name.includes('Story Point')
                }) || 0

                return {
                    id: item.id,
                    title: item.title,
                    url: item.html_url,
                    description: item.body,
                    milestoneTitle: item?.milestone?.title || '',
                    createdAt: item.created_at,
                    assignees: item.assignees.map((a) => a.login).join(','),
                    labels: item.labels.map((l) => l.name).join(','),
                    storyPoint: storyPoint && parseFloat(storyPoint.name.replace(' Story Point', ''))
                }
            }));
        });
    }
}

let obj = new ExportIssue({
    token: '',
    author: '',
    perPage: 100
});

obj.fetchAllIssues().then(() => {
    console.table(obj.result)
})
