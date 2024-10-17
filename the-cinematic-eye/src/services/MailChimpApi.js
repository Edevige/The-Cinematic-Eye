import axios from "axios";

export default () => {
    return axios.create({
        baseURL: "https://us22.api.mailchimp.com/3.0/",
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer 109a471a8a84665a48ae7625fe15233a-us22'
        }
        
    })
}
