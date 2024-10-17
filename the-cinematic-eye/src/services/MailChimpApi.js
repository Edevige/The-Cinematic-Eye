import axios from 'axios';

const MailChimpApi = axios.create({
    baseURL: "https://us22.api.mailchimp.com/3.0/", 
    headers: {
        accept: 'application/json',
        Authorization: `Basic ${btoa('anystring:109a471a8a84665a48ae7625fe15233a-us22')}`
    }
});

export default MailChimpApi;