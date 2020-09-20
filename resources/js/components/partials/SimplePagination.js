import React, {Component} from 'react';
import Pagination from '@material-ui/lab/Pagination';

export default class SimplePagination extends Component{
    constructor(props){
        super(props);

    }

    render() {
        let {isLoading,onChange,defaultPage,count} = this.props;
        return(
            isLoading!==true?
            <Pagination count={count} onChange={onChange} defaultPage={defaultPage} variant="outlined" shape="rounded" />
                :
                ''
        )
    }
}
