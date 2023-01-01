import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hook';
import { selectUser } from '../../features/user/userSlice';
import { getNotifications } from '../../features/notification/notificationSlice';
import { useSignalR } from '../../hooks/useSignalR';
import { store } from '../../app/store';

type Props = {};

const Signalr = (props: Props) => {
  // Controls:

  const { getInstance } = useSignalR();

  // Redux:
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();

  const getCurrentUserId = () => {
    // pass this function to the listener as a parameter so the listener can take the lastest value of user everytime
    return store.getState().user.user?.identity;
  };

  useEffect(() => {
    const listenToNotificationChanges = async (getUserId: () => string | undefined) => {
      getInstance().then((connection) => {
        try {
          connection.on('UpdateNotify', (a) => {
            console.log('================================Received signal from SignalR');
            if (getUserId()) dispatch(getNotifications());
          });
        } catch (e) {
          console.log('Fail to add listener to noti changes: ', e);
        }
      });
    };

    if (user?.identity) listenToNotificationChanges(getCurrentUserId);
  }, [user?.identity]);

  return <></>;
};

export default Signalr;
