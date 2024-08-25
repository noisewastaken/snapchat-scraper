import readlineSync from 'readline-sync';
import scrapeUser from './modules/scrapeUser';

async function main() {
    const input = readlineSync.question('Enter the Snapchat username or URL: ');

    let username: string;
    if (input.startsWith('https://')) {
        const urlParts = input.split('/');
        username = urlParts[urlParts.length - 1];
    } else {
        username = input;
    }

    try {
        console.log('Scraping user data...');
        const user = await scrapeUser(username);
        if (user) {
            console.log('User Data:', JSON.stringify(user, null, 2));
        } else {
            console.log('User Data: Not found');
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

main();