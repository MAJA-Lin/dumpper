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

    fetchAllIssues() {
        Promise.all(this.typeFilter.map((type) => {
            return this.fetchIssues(1, type);
        })).then(console.log);
    }

    fetchIssues(page, filter) {
        return new Promise((resolve, reject) => {
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
                if (response.total_count >= (page * this.perPage)) {
                    this.fetchIssues(page + 1, filter)
                } else {
                    resolve()
                }

                this.result.concat(response.items.map((item) => {
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
        });
    }
}

let obj = new ExportIssue({token: '', author: 'scott-vt', perPage: 100})
obj.fetchAllIssues();
console.table(obj.result)
