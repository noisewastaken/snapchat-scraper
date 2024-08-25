import axios from 'axios';
import * as cheerio from 'cheerio'; 

import { SnapUser } from '../interfaces/snapUser';

export default async function scrapeUser(username: string): Promise<SnapUser | null> {
    const url = `https://story.snapchat.com/add/${username}/`;
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        const scriptElement = $('script#__NEXT_DATA__');
        const scriptData = scriptElement.html();

        if (!scriptData) {
            throw new Error('Script data not found');
        }

        const json = JSON.parse(scriptData);
        const props = json.props.pageProps;

        if (!props) {
            throw new Error('Page props not found');
        }

        const userProfile = props.userProfile?.userInfo || props.userProfile?.publicProfileInfo;

        if (!userProfile) {
            console.error('User profile data not found for username:', username);
            console.error('Full response:', JSON.stringify(props, null, 2));
            return null;
        }

        const user: SnapUser = {
            username: userProfile.username,
            title: userProfile.title || userProfile.displayName,
            snapcodeImageUrl: userProfile.snapcodeImageUrl,
            subscriberCount: userProfile.subscriberCount || 0,
            bio: userProfile.bio || '', 
            websiteUrl: userProfile.websiteUrl || '', 
            profilePictureUrl: userProfile.profilePictureUrl || userProfile.bitmoji3d?.avatarImage?.url || '',
            url: userProfile.url || '', 
            displayName: userProfile.displayName || userProfile.username,
            snapCode: userProfile.snapCode || '', 
            bitMoji: userProfile.bitmoji3d?.avatarImage?.url || '',
            subscription: userProfile.subscription || false 
        };

        return user;
    } catch (error) {
        console.error('Error scraping user data for username:', username);
        console.error(error);
        return null;
    }
}