import React, {Component} from 'react';
import {TextInput} from './TextInput'
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import BlockOutlinedIcon from '@material-ui/icons/BlockOutlined';
import Axios from '../../ajax/Axios';
import {EditAjaxSettings} from "../../componentsData/Data";

export default class EditForm extends Component {
    constructor(props) {
        super(props);
        this.ajax = EditAjaxSettings;
        this.state = {
            pagesData: {
                header: '',
                updated_announcement_date: '',
                price: '',
                phone_for_contact: '',
                description: '',
                storage: ''
            },
            denySave: false,
            errorInputs: {
                'header': {hasError: false, description: ''},
                'updated_announcement_date': {hasError: false, description: ''},
                'price': {hasError: false, description: ''},
                'phone_for_contact': {hasError: false, description: ''},
                'description': {hasError: false, description: ''},
            },

        };
        this.changeHandler = $.proxy(this.changeHandler, this);
        this.intControl = $.proxy(this.intControl, this);
        this.emptyControl = $.proxy(this.emptyControl, this);
        this.emptyFieldForTextArea = $.proxy(this.emptyFieldForTextArea, this);
        this.minLengthControl = $.proxy(this.minLengthControl, this);
        this.saveHandler = $.proxy(this.saveHandler, this);
        this.input = React.createRef();
    }

    componentDidMount() {

        let {modelId} = this.props;
        this._isMounted = true;
        let requestParams = {...this.ajax.get};
        requestParams.url = requestParams.url + `id=${modelId}`;
        this.request = new Axios(requestParams);
        let promise = this.request.get();
        promise.then((response) => {
            this.setState({
                pagesData: response.data,
            })
        }).catch((error) => {
            console.log(error);
        });
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        let {modelId, closeDialog} = this.props;
        let {pagesData, denySave, errorInputs} = this.state;
        return (
            <form action={'/ajax/edit'} method="POST" autoComplete="off" variant="outlined"
                  encType="multipart/form-data" id="edit_form">
                <div>
                    <TextareaAutosize name="header" placeholder="Заголовок обявления"
                                      defaultValue={pagesData.header}
                                      className={errorInputs.header.hasError === false ? 'd-block' : 'errorInput'}
                                      onChange={this.changeHandler} onBlur={this.emptyFieldForTextArea}/>
                    <p className={errorInputs.header.hasError === false ? 'd-none' : 'error-label'}>{errorInputs.header.description}</p>
                </div>
                <TextInput name="updated_announcement_date" label="Дата обновления"
                           value={pagesData.updated_announcement_date}
                           error={errorInputs.updated_announcement_date.hasError}
                           onChange={this.changeHandler}/>
                <p className={errorInputs.updated_announcement_date.hasError === false ? 'd-none' : 'error-label'}>{errorInputs.updated_announcement_date.description}</p>
                <TextInput name="price" label="Цена за сутки" value={pagesData.price} error={errorInputs.price.hasError}
                           onChange={this.changeHandler}/>
                <p className={errorInputs.price.hasError === false ? 'd-none' : 'error-label'}>{errorInputs.price.description}</p>
                <TextInput name="phone_for_contact" label="Контакты" value={pagesData.phone_for_contact}
                           error={errorInputs.phone_for_contact.hasError} onChange={this.changeHandler}/>
                <p className={errorInputs.phone_for_contact.hasError === false ? 'd-none' : 'error-label'}>{errorInputs.phone_for_contact.description}</p>
                <TextInput name="storage" label=""
                           error={false} type={'file'} onChange={this.changeHandler}/>
                <input name="id" type="hidden" ref="this.input" defaultValue={pagesData.id}/>
                <div>
                    <TextareaAutosize name="description" placeholder="Объявление"
                                      defaultValue={pagesData.description}
                                      className={errorInputs.description.hasError === false ? 'd-block' : 'errorInput'}
                                      onChange={this.changeHandler} onBlur={this.emptyFieldForTextArea}/>
                    <p className={errorInputs.description.hasError === false ? 'd-none' : 'error-label'}>{errorInputs.description.description}</p>
                </div>
                <div className='buttons-container'>
                    <Button
                        type="submit"
                        disabled={denySave === false ? false : true}
                        variant="contained"
                        color="primary"
                        size="small"
                        startIcon={<SaveIcon/>}
                        onClick={this.saveHandler}
                    >
                        Сохранить
                    </Button>
                    <Button
                        variant="contained"
                        color="default"
                        size="small"
                        startIcon={<BlockOutlinedIcon/>}
                        onClick={closeDialog}
                    >
                        Отмена
                    </Button>
                </div>
            </form>
        )
    }

    emptyFieldForTextArea(e) {
        let {errorInputs} = this.state;
        let target$ = $(e.target);
        if (target$.val().length === 0) {
            errorInputs[target$.attr('name')].hasError = true;
            errorInputs[target$.attr('name')].description = 'Поле не может быть пустым';
            this.setState({
                denySave: true,
                errorInputs: errorInputs
            });
        } else {
            errorInputs[target$.attr('name')].hasError = false;
            errorInputs[target$.attr('name')].description = '';
            this.setState({
                denySave: false,
                errorInputs: errorInputs
            });
        }
    }

    emptyControl(target$) {
        let {errorInputs} = this.state;

        if (target$.val().length === 0) {
            errorInputs[target$.attr('name')].hasError = true;
            errorInputs[target$.attr('name')].description = 'Поле не может быть пустым';
            this.setState({
                denySave: true,
                errorInputs: errorInputs
            });
            return this;
        }
        errorInputs[target$.attr('name')].hasError = false;
        errorInputs[target$.attr('name')].description = '';
        this.setState({
            denySave: false,
            errorInputs: errorInputs
        });
        return this;
    }

    intControl(target$) {
        let {errorInputs} = this.state;
        if (isNaN(parseInt(target$.val()))) {
            errorInputs[target$.attr('name')].hasError = true;
            errorInputs[target$.attr('name')].description = 'Первый символ обязательно число';
            this.setState({
                denySave: true,
                errorInputs: errorInputs
            });
            return this;
        }

        errorInputs[target$.attr('name')].hasError = false;
        errorInputs[target$.attr('name')].description = '';
        this.setState({
            denySave: false,
            errorInputs: errorInputs
        });

        return this;

    }

    minLengthControl(target$) {
        let {errorInputs} = this.state;
        if ((target$.attr('name') === 'header' || target$.attr('name') === 'description') && target$.val().length < 20) {
            errorInputs[target$.attr('name')].hasError = true;
            errorInputs[target$.attr('name')].description = 'Минимальное число символов:20';
            this.setState({
                denySave: true,
                errorInputs: errorInputs
            });
            return this;
        } else if (target$.val().length < 8) {
            errorInputs[target$.attr('name')].hasError = true;
            errorInputs[target$.attr('name')].description = 'Минимальное число символов:8';
            this.setState({
                denySave: true,
                errorInputs: errorInputs
            });
            return this;
        }
        errorInputs[target$.attr('name')].hasError = false;
        errorInputs[target$.attr('name')].description = '';
        this.setState({
            denySave: false,
            errorInputs: errorInputs
        });
        return this;
    }

    changeHandler(e) {
        let {pagesData} = this.state;
        let target$ = $(e.target);
        pagesData[target$.attr('name')] = target$.val();

        switch (target$.attr('name')) {
            case 'price':
                this.emptyControl(target$).intControl(target$);
                break;
            case 'storage':
                break;
            default:
                this.emptyControl(target$).minLengthControl(target$);
        }
        this.setState({
            pagesData: pagesData
        });
    }

    saveHandler(e) {
        e.preventDefault();
        let {reload, closeDialog} = this.props;
        let target$ = $(e.target);
        if (target$.hasClass('disabled')) return false;
        let {pagesData} = this.state;
        /*let priceInt = parseInt(pagesData.price);
        pagesData.price = priceInt;*/
        this.request = new Axios(this.ajax.post);
        let data = new FormData($('#edit_form')[0]);
        data.id = pagesData.id;
        let promise = this.request.post(data);
        promise.then((response) => {
            this.setState({
                result: response.data,
            });
            reload();
            closeDialog();
        }).catch((error) => {
            console.log(error);
        });
    }

}
