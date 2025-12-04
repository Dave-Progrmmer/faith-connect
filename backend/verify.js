

const BASE_URL = 'http://localhost:5000/api';
let ministerToken = '';
let memberToken = '';

async function testAuth() {
    console.log('Testing Auth...');
    
    // Register Minister
    const ministerRes = await fetch(`${BASE_URL}/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: 'Minister John',
            email: `minister${Date.now()}@test.com`,
            password: 'password123',
            role: 'minister'
        })
    });
    const ministerData = await ministerRes.json();
    console.log('Register Minister:', ministerRes.status);

    // Login Minister
    const loginMinisterRes = await fetch(`${BASE_URL}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email: ministerData.message === "User registered successfully" ? JSON.parse(ministerRes.config.body).email : `minister${Date.now()}@test.com`, // simplified for script
            password: 'password123'
        })
    });
    
    // Actually, let's just use the email we just created.
    // Re-doing logic slightly to be robust
}

async function runTests() {
    try {
        // 1. Register Minister
        const ministerEmail = `minister${Date.now()}@test.com`;
        const memberEmail = `member${Date.now()}@test.com`;

        console.log(`\n--- 1. Authentication ---`);
        const regMinister = await fetch(`${BASE_URL}/users/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'Minister', email: ministerEmail, password: 'pass', role: 'minister' })
        });
        console.log(`Register Minister: ${regMinister.status}`);

        const regMember = await fetch(`${BASE_URL}/users/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'Member', email: memberEmail, password: 'pass', role: 'member' })
        });
        console.log(`Register Member: ${regMember.status}`);

        // Login
        const loginMinister = await fetch(`${BASE_URL}/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: ministerEmail, password: 'pass' })
        });
        const ministerData = await loginMinister.json();
        ministerToken = ministerData.accessToken;
        console.log(`Login Minister: ${loginMinister.status}`);

        const loginMember = await fetch(`${BASE_URL}/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: memberEmail, password: 'pass' })
        });
        const memberData = await loginMember.json();
        memberToken = memberData.accessToken;
        console.log(`Login Member: ${loginMember.status}`);

        // 2. Events
        console.log(`\n--- 2. Events ---`);
        const createEvent = await fetch(`${BASE_URL}/events`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': ministerToken },
            body: JSON.stringify({ title: 'Sunday Service', description: 'Worship', date: new Date(), location: 'Main Hall' })
        });
        console.log(`Minister Create Event: ${createEvent.status}`);

        const memberCreateEvent = await fetch(`${BASE_URL}/events`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': memberToken },
            body: JSON.stringify({ title: 'Unauthorized Event', description: '...', date: new Date(), location: '...' })
        });
        console.log(`Member Create Event (Should fail): ${memberCreateEvent.status}`);

        const getEvents = await fetch(`${BASE_URL}/events`);
        console.log(`Get Events: ${getEvents.status}`);

        // 3. Sermons
        console.log(`\n--- 3. Sermons ---`);
        const createSermon = await fetch(`${BASE_URL}/sermons`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': ministerToken },
            body: JSON.stringify({ title: 'Faith', preacher: 'Minister John', date: new Date() })
        });
        console.log(`Minister Create Sermon: ${createSermon.status}`);

        // 4. Announcements
        console.log(`\n--- 4. Announcements ---`);
        const createAnn = await fetch(`${BASE_URL}/announcements`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': ministerToken },
            body: JSON.stringify({ title: 'Picnic', content: 'Join us', priority: 'high' })
        });
        console.log(`Minister Create Announcement: ${createAnn.status}`);

        // 5. Prayer Requests
        console.log(`\n--- 5. Prayer Requests ---`);
        const createPrayer = await fetch(`${BASE_URL}/prayer-requests`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': memberToken },
            body: JSON.stringify({ request: 'Pray for health' })
        });
        console.log(`Member Create Prayer Request: ${createPrayer.status}`);

        const ministerGetPrayer = await fetch(`${BASE_URL}/prayer-requests`, {
            headers: { 'Authorization': ministerToken }
        });
        const ministerPrayers = await ministerGetPrayer.json();
        console.log(`Minister Get Prayers (Count): ${ministerPrayers.length}`);

        const memberGetPrayer = await fetch(`${BASE_URL}/prayer-requests`, {
            headers: { 'Authorization': memberToken }
        });
        const memberPrayers = await memberGetPrayer.json();
        console.log(`Member Get Prayers (Count): ${memberPrayers.length}`);

    } catch (error) {
        console.error('Test Failed:', error);
    }
}

runTests();
