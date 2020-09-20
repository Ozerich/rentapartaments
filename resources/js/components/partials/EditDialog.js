import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined';
import EditForm from './EditForm';
import $ from 'jquery';

const styles = {
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
};

class EditDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false
        };
        this.handleOpen = $.proxy(this.handleOpen, this);
        this.handleClose = $.proxy(this.handleClose, this);
        this.hasUnmounted = false;
    }

render()
{
    let {open} = this.state;
    let {classes, modelId, reload} = this.props;
    return (
        <div className="edit-dialog-container">
            <Button variant="outlined" color="primary" onClick={this.handleOpen}>Редактировать запись</Button>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={open}
                onClose={this.handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={open}>
                    <div className='edit-dialog-container__modal'>
                        <p onClick={this.handleClose}><CloseOutlinedIcon/></p>
                        <EditForm modelId={modelId} closeDialog={this.handleClose} reload={reload}/>
                    </div>
                </Fade>
            </Modal>
        </div>
    );
}
handleOpen()
{
    this.setState({
        open: true
    })
}
;

handleClose()
{
    this.setState({
        open: false
    })
}
;
}


export default withStyles(styles)(EditDialog);
