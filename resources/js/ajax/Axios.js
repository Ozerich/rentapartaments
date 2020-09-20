import 'axios';

export default class Axios {

    constructor(options){
        this.options =options;
    }

    post(data){
        let {url,...extraParams} = this.options;
        return axios.post(url, data, extraParams).then((response) => {
            return response;
        }, (error) => {
            return error.response;
        });
    }
    get(){
        let {url,...extraParams} = this.options;
        return axios.get(url, {}, extraParams).then((response) => {
            return response;
        }, (error) => {
            return error.response;
        });
    }
}
