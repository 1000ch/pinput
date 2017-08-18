import { storageKey } from './constant';
import * as API from './api';
import { getData, setData} from './util';

const Message = {
  isBlank : 'Please input token and try to save.',
  succeed : 'API token is successfully authenticated!',
  changed : 'API token is not authenticated...',
  failed  : 'API token authentication is failed...'
};

$(() => {
  let $input                 = $('#js-input');
  let $button                = $('#js-button');
  let $alert                 = $('#js-alert');
  let $checkboxPrivate       = $('#js-checkbox-private');
  let $checkboxReadLater     = $('#js-checkbox-readlater');
  let $checkboxTagSuggestion = $('#js-checkbox-tagsuggestion');

  function setAlertInfo(message) {
    $alert
      .removeClass('alert-danger alert-warning alert-success')
      .addClass('alert-info')
      .text(message);
  }

  function setAlertSuccess(message) {
    $alert
      .removeClass('alert-info alert-warning alert-danger')
      .addClass('alert-success')
      .text(message);
  }

  function setAlertDanger(message) {
    $alert
      .removeClass('alert-info alert-warning alert-success')
      .addClass('alert-danger')
      .text(message);
  }

  function setAlertWarning(message) {
    $alert
      .removeClass('alert-info alert-success alert-danger')
      .addClass('alert-warning')
      .text(message);
  }

  let authToken;
  let defaultPrivate;
  let defaultReadLater;
  let useTagSuggestion;

  // check set API token is authenticated
  getData([
    storageKey.authToken,
    storageKey.defaultPrivate,
    storageKey.defaultReadLater,
    storageKey.useTagSuggestion
  ]).then(items => {
    if (items.hasOwnProperty(storageKey.authToken)) {
      authToken = String(items[storageKey.authToken]);
    } else {
      authToken = '';
    }

    if (items.hasOwnProperty(storageKey.defaultPrivate)) {
      defaultPrivate = Boolean(items[storageKey.defaultPrivate]);
    } else {
      defaultPrivate = false;
    }

    if (items.hasOwnProperty(storageKey.defaultReadLater)) {
      defaultReadLater = Boolean(items[storageKey.defaultReadLater]);
    } else {
      defaultReadLater = false;
    }

    if (items.hasOwnProperty(storageKey.useTagSuggestion)) {
      useTagSuggestion = Boolean(items[storageKey.useTagSuggestion]);
    } else {
      useTagSuggestion = false;
    }

    $checkboxPrivate.prop('checked', defaultPrivate);
    $checkboxReadLater.prop('checked', defaultReadLater);
    $checkboxTagSuggestion.prop('checked', useTagSuggestion);

    if (authToken.length !== 0) {
      API.checkToken(authToken).then(() => {
        setAlertSuccess(Message.succeed);
      }).catch(() => {
        setAlertDanger(Message.failed);
      });
    } else {
      setAlertInfo(Message.isBlank);
    }

    $input.val(authToken);
  });

  $input.on('change', () => {
    setAlertWarning(Message.changed);
  });

  $checkboxPrivate.on('change', () => {
    defaultPrivate = $checkboxPrivate.prop('checked');

    let data = {};
    data[storageKey.defaultPrivate] = defaultPrivate;

    chrome.storage.sync.set(data, () => {});
  });

  $checkboxReadLater.on('change', () => {
    defaultReadLater = $checkboxReadLater.prop('checked');

    let data = {};
    data[storageKey.defaultReadLater] = defaultReadLater;

    chrome.storage.sync.set(data, () => {});
  });

  $checkboxTagSuggestion.on('change', () => {
    useTagSuggestion = $checkboxTagSuggestion.prop('checked');

    let data = {};
    data[storageKey.useTagSuggestion] = useTagSuggestion;

    chrome.storage.sync.set(data, () => {});
  });

  // if the save button is clicked
  $button.on('click', () => {
    authToken = $input.val();

    let data = {};
    data[storageKey.authToken] = authToken;

    chrome.storage.sync.set(data, () => {
      if (authToken.length !== 0) {
        API.checkToken(authToken).then(() => {
          data[storageKey.isAuthenticated] = true;

          chrome.storage.sync.set(data, () => {
            setAlertSuccess(Message.succeed);
          });
        }).catch(() => {
          data[storageKey.isAuthenticated] = false;

          chrome.storage.sync.set(data, () => {
            setAlertDanger(Message.failed);
          });
        });
      } else {
        data[storageKey.isAuthenticated] = false;

        chrome.storage.sync.set(data, () => {
          setAlertInfo(Message.isBlank);
        });
      }
    });
  });
});
