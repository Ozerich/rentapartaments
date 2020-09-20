import React from 'react';
import UpdateOutlinedIcon from '@material-ui/icons/UpdateOutlined';
import PaymentOutlinedIcon from '@material-ui/icons/PaymentOutlined';
import PhoneIphoneOutlinedIcon from '@material-ui/icons/PhoneIphoneOutlined';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import EditDialog from './EditDialog';
import RemoveDialog from './RemoveDialog';
export const FlatCard = ({data,admin,reload}) => {
    let {id, header, storage, updated_announcement_date, price, phone_for_contact, description} = data;
    let descriptionArr = description.substring(0,description.length-1).split(';');
    return (
        <div className="result__item">
            <p className='result__item__header'>{header}</p>
            <p className='result__item__updated_announcement_date'>
                <span>Обновлено: </span><UpdateOutlinedIcon/><span>{updated_announcement_date}</span></p>
            <p className='result__item__img'><img src={`/storage/${storage}`} alt={`flat_${id}`}/></p>
            <div className='wrapper-1'>
                <p className='result__item__price'><PaymentOutlinedIcon/><span>{price}</span></p>
                <p className='result__item__contacts'><PhoneIphoneOutlinedIcon/><span><a
                    href={`tel:${phone_for_contact}`}>{phone_for_contact}</a></span></p>
            </div>
            <div className='result__item__description'>
                <p>Описание</p>
                {
                    descriptionArr.map((item, i) => {
                        return (
                            <div dangerouslySetInnerHTML={{__html: item}} key={i}/>
                        )
                    })
                }
            </div>
            <div className={admin===false?'admin-controls d-none':'admin-controls'}>
                <EditDialog modelId={id} reload={reload}/>
                <RemoveDialog modelId={id} reload={reload}/>
            </div>
        </div>
    )
};


