import React, {Component} from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Axios from '../../ajax/Axios';
import {RemoveAjaxSettings} from "../../componentsData/Data";
import $ from 'jquery';
import DeleteForeverOutlinedIcon from "./FlatCard";

export default class RemoveDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false
        };
        this.handleClickOpen = $.proxy(this.handleClickOpen, this);
        this.handleClose = $.proxy(this.handleClose, this);
        this.ajaxClick = $.proxy(this.ajaxClick, this);
        this.ajax = RemoveAjaxSettings;
    }

    render() {
        let {modelId} = this.props;
        let {open} = this.state;
        return (
            <div className="remove-dialog-container">
                <Button variant="outlined" color="secondary" onClick={this.handleClickOpen}>
                    Удалить запись
                </Button>
                <Dialog
                    open={open}
                    onClose={this.handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">Удалить выбранную запись</DialogTitle>
                    <DialogActions>
                        <Button onClick={this.ajaxClick} color="secondary">
                            ДА
                        </Button>
                        <Button onClick={this.handleClose} color="primary">
                            НЕТ
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }

    handleClickOpen() {
        this.setState({
            open: true
        });
    }

    handleClose() {
        this.setState({
            open: false
        });
    }

    ajaxClick() {
        let {modelId,reload} = this.props;
        this.request = new Axios(this.ajax.post);
        let promise = this.request.post(JSON.stringify({filter: modelId}));
        promise.then((response) => {
            this.setState({
                result: response.data,
                open: false,
            });
            reload();
        }).catch((error) => {
            console.log(error);
        });
    }
}
