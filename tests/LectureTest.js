const fs = require('fs');
const axios = require('axios');

const filename = 'test_results.txt'; // or prompt with readline if needed
const baseUrl = 'http://localhost:3000'; // Change if deployed

const output = fs.createWriteStream(filename, { flags: 'w' });

function log(msg) {
    console.log(msg);
    output.write(msg + '\n');
}

async function runTests() {
    log(baseUrl);
    log('');

    // Test 1: GET /api/about
    log("testing getting the about");
    log("-------------------------");
    try {
        const url = `${baseUrl}/api/about`;
        const res = await axios.get(url);
        log(`url=${url}`);
        log(`status_code=${res.status}`);
        log(`data.text=${JSON.stringify(res.data, null, 2)}`);
    } catch (err) {
        log("problem");
        log(err.toString());
    }

    log('\n');

    // Test 2: GET /api/report (before adding)
    log("testing getting the report - 1");
    log("------------------------------");
    try {
        const url = `${baseUrl}/api/report?id=123123&year=2025&month=2`;
        const res = await axios.get(url);
        log(`url=${url}`);
        log(`status_code=${res.status}`);
        log(`data.text=${JSON.stringify(res.data, null, 2)}`);
    } catch (err) {
        log("problem");
        log(err.toString());
    }

    log('\n');

    // Test 3: POST /api/add
    log("testing adding cost item");
    log("----------------------------------");
    try {
        const url = `${baseUrl}/api/add`;
        const res = await axios.post(url, {
            userid: 123123,
            description: "milk",
            category: "food",
            sum: 8,
            year: 2025,
            month: 2,
            day: 12
        });
        log(`url=${url}`);
        log(`status_code=${res.status}`);
        log(`data.text=${JSON.stringify(res.data, null, 2)}`);
    } catch (err) {
        log("problem");
        log(err.toString());
    }

    log('\n');

    // Test 4: GET /api/report (after adding)
    log("testing getting the report - 2");
    log("------------------------------");
    try {
        const url = `${baseUrl}/api/report?id=123123&year=2025&month=2`;
        const res = await axios.get(url);
        log(`url=${url}`);
        log(`status_code=${res.status}`);
        log(`data.text=${JSON.stringify(res.data, null, 2)}`);
    } catch (err) {
        log("problem");
        log(err.toString());
    }

    log('\n✅ Tests finished');
    output.end();
}

runTests();
