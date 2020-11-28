exports.bulletinSearch = function (drug) {
    //console.log('drug is ' + drug.ms);
    return new Promise((resolve, reject) => {
        fetch("https://gotopills.com/wp-admin/admin-ajax.php?action=bulletin-search&ms=" + encodeURIComponent(drug.ms)  + "&age=" + drug.age + "&age_type=" + drug.age_type + "&gender=" + drug.gender + "&duration=" + drug.duration +"&duration_type=" + drug.duration_type + "&reason=" + encodeURIComponent(drug.reason) + "&condition=" + encodeURIComponent(drug.condition))
            .then((response) => response.json())
            .then((r) => {
                if (r == 'none') {
                    //console.log('No Bulletins Found' + r.total_bulls);
                    alert("Unfortunately we could not find the bulletin");
                    reject(r);
                }
                //console.log('JSON Bulletins Found' + JSON.stringify(r));
                resolve(r);
            }).catch((err) => {
                //console.log(err);
                reject(err);
            });
    });
};