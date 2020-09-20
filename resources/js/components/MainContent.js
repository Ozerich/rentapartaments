import React, {Component} from 'react';
import FilterByRoom from './partials/FilterByRoom';
import FilterByPrice from './partials/FilterByPrice';
export default class MainContent extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let {links,ajax,admin} = this.props;
        return (
            <main>
                <input id="tab1" type="radio" name="tabs" defaultChecked={true}/>
                <label htmlFor="tab1">Фильтр по количеству комнат</label>

                <input id="tab2" type="radio" name="tabs"/>
                <label htmlFor="tab2">Фильтр по цене</label>

                <FilterByRoom links={links} ajax={ajax} admin={admin}/>
                <FilterByPrice ajax={ajax} admin={admin}/>
            </main>
        )
    }
}
