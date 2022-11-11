// Code editor
const flask = new CodeFlask('#config', {
    language: 'js',
    tabSize: 4,
    lineNumbers: true
});

// Business logic
let domain = 'http://localhost:3005';

refreshSyncs();
let lastSyncId = undefined;

function runCode() {
    let code = document.getElementById('config').value;

    let options = {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain'
        },
        body: code
    };
    fetch(`${domain}/api/addSync`, options).then(async (resp) => {
        let nangoResponse = await resp.json();
        lastSyncId = nangoResponse.sync_id;

        $('#syncid').text(`Your sync has been added, the id is ${lastSyncId}`).css('visibility', 'visible');
        setStatus('🏃‍♂️ Nango is fetching data, this might take a few seconds...', 'alert-primary', true);
        setTimeout(awaitData, 500);

        refreshSyncs();
    });
}

function resetState() {
    setStatus('', 'alert-primary', false);
}

async function awaitData() {
    let res = await fetch(`${domain}/api/getData`);
    let data = await res.json();

    if (data[0]['sync_id'] === lastSyncId) {
        refreshData();
        setStatus(
            '🎉 Your data has arrived, explore it in the data section below. Nango will now continuously refresh your data for you',
            'alert-success',
            true
        );
        //setTimeout(resetState, 15000);
    } else {
        setTimeout(awaitData, 500);
    }
}

function setStatus(text, type, visibility) {
    let status = document.getElementById('status');
    status.style.visibility = visibility ? 'visible' : 'hidden';
    status.className = `alert ${type}`;
    status.innerText = text;
}

function refreshSyncs() {
    fetch(`${domain}/api/getSyncs`).then(async (res) => {
        let json = await res.json();
        json = json.slice(0, 5);

        let syncsTableBody = document.getElementById('syncs-body');
        var newBody = '';
        for (let sync of json) {
            newBody += `
            <tr>
                <td>${sync.id}</td>
                <td>${sync.url}</td>
                <td>${sync.created_at}</td>
                <td>${sync.updated_at}</td>
            </tr>
            `;
        }
        syncsTableBody.innerHTML = newBody;
    });
}

function refreshData() {
    fetch(`${domain}/api/getData`).then(async (res) => {
        let json = await res.json();
        json = json.slice(0, 100);

        let dataTableBody = document.getElementById('data-body');
        var newBody = '';
        for (let item of json) {
            newBody += `
            <tr>
                <td>${item.id}</td>
                <td>${item.sync_id}</td>
                <td>${item.emitted_at}</td>
                <td style="max-width: 300px; word-wrap: break-word;">
                    <div class="content hideContent">
                        <pre>
                        ${JSON.stringify(item.data, undefined, 2)}
                        </pre>
                    </div>
                    <div class="show-more">
                        <a href="#">Show more</a>
                    </div>
                </td>
            </tr>
            `;
        }
        dataTableBody.innerHTML = newBody;

        // Show more/less
        $('.show-more a').on('click', function () {
            var $this = $(this);
            var $content = $this.parent().prev('div.content');
            var linkText = $this.text().toUpperCase();

            if (linkText === 'SHOW MORE') {
                linkText = 'Show less';
                $content.switchClass('hideContent', 'showContent', 100);
            } else {
                linkText = 'Show more';
                $content.switchClass('showContent', 'hideContent', 100);
            }

            $this.text(linkText);
        });
    });
}
