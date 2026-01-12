async function test() {
    const url = 'https://api.the-odds-api.com/v4/sports/?apiKey=e8c1d1568e8ceb4ca3eda4cb71cecfe0';
    try {
        console.log('Fetching from:', url);
        const res = await fetch(url);
        console.log('Status:', res.status);
        const data = await res.json();
        console.log('Data (first items):', data.slice(0, 2));
    } catch (err) {
        console.error('Error in test script:', err);
    }
}

test();
