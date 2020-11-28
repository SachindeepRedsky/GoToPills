exports.allBulletins = function (skip) {
    //console.log('user' + user);
    return new Promise((resolve, reject) => {
        fetch("https://gotopills.com/wp-admin/admin-ajax.php?action=all-bulletins-paged&skip=" + skip)
            .then((response) => response.json())
            .then((r) => {
                if (r.total_bulls == 0) {
                    //console.log('No Bulletins Found' + r.total_bulls);
                    alert("Unfortunately we could not find any bulletins");
                    reject(r);
                }
                //console.log('JSON Bulletins Found' + JSON.stringify(r));
                resolve(r);
            }).catch((err) => {
                console.log(err);
                reject(err);
            });
    });
};

exports.bulletinByID = function (id) {
    //console.log('user' + user);
    return new Promise((resolve, reject) => {
        fetch("https://gotopills.com/wp-admin/admin-ajax.php?action=bulletin-search&id=" + id)
            .then((response) => response.json())
            .then((r) => {
                //convert
                //rString = JSON.stringify(r);
                //console.log(r);
                //replace
                //rString = rString.replace(/(?:\\[rn]|[\r\n]+)+/g, "");
                //rString = rString.replace(/(?:\\[\t]+)+/g, "");
                //rString = rString.replace(/(?:\\[\"])+/g, "");
                //console.log(rString);
                //rJson = JSON.parse(rString);
                rJson = r;
                if (rJson == 'none') {
                    //console.log('No Bulletins Found' + rJson.total_bulls);
                    alert("Unfortunately we could not find the bulletin");
                    reject(rJson);
                }
                //console.log('JSON Bulletin Found' + JSON.stringify(rJson));
                resolve(rJson);
            }).catch((err) => {
                console.log(err);
                reject(err);
            });
    });
};
 
exports.allBulletinsNames = function () {
    //console.log('user' + user);
    return new Promise((resolve, reject) => {
        fetch("https://gotopills.com/wp-admin/admin-ajax.php?action=all-bulletins-names") 
            .then((response) => response.json())
            .then((r) => {
                if (r == 'none') {
                    //console.log('No Bulletins Found' + r.total_bulls);
                    alert("Unfortunately we could not find the bulletins");
                    reject(r);
                }
                //console.log('Bulletins Found' + JSON.stringify(r));
                resolve(r);
            }).catch((err) => {
                console.log(err);
                reject(err);
            });
    });
};

exports.allConditionNames = function () {
    //console.log('user' + user);
    return new Promise((resolve, reject) => {
        fetch("https://gotopills.com/wp-admin/admin-ajax.php?action=all-conditions-names") 
            .then((response) => response.json())
            .then((r) => {
                if (r == 'none') {
                    //console.log('No Bulletins Found' + r.total_bulls);
                    alert("Unfortunately we could not conditions");
                    reject(r);
                }
                //console.log('Bulletins Found' + JSON.stringify(r));
                resolve(r);
            }).catch((err) => {
                console.log(err);
                reject(err);
            });
    });
};