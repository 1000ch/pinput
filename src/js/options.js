import * as constant from './constant';
import * as API from './api';

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

  const keys = [
    constant.authToken,
    constant.defaultPrivate,
    constant.defaultReadLater,
    constant.useTagSuggestion
  ];

  let authToken;
  let defaultPrivate;
  let defaultReadLater;
  let useTagSuggestion;

  // check set API token is authenticated
  chrome.storage.sync.get(keys, items => {
    if (items.hasOwnProperty(constant.authToken)) {
      authToken = String(items[constant.authToken]);
    } else {
      authToken = '';
    }

    if (items.hasOwnProperty(constant.defaultPrivate)) {
      defaultPrivate = Boolean(items[constant.defaultPrivate]);
    } else {
      defaultPrivate = false;
    }

    if (items.hasOwnProperty(constant.defaultReadLater)) {
      defaultReadLater = Boolean(items[constant.defaultReadLater]);
    } else {
      defaultReadLater = false;
    }

    if (items.hasOwnProperty(constant.useTagSuggestion)) {
      useTagSuggestion = Boolean(items[constant.useTagSuggestion]);
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
    data[constant.defaultPrivate] = defaultPrivate;

    chrome.storage.sync.set(data, () => {});
  });

  $checkboxReadLater.on('change', () => {
    defaultReadLater = $checkboxReadLater.prop('checked');

    let data = {};
    data[constant.defaultReadLater] = defaultReadLater;

    chrome.storage.sync.set(data, () => {});
  });

  $checkboxTagSuggestion.on('change', () => {
    useTagSuggestion = $checkboxTagSuggestion.prop('checked');

    let data = {};
    data[constant.useTagSuggestion] = useTagSuggestion;

    chrome.storage.sync.set(data, () => {});
  });

  // if the save button is clicked
  $button.on('click', () => {
    authToken = $input.val();

    let data = {};
    data[constant.authToken] = authToken;

    chrome.storage.sync.set(data, () => {
      if (authToken.length !== 0) {
        API.checkToken(authToken).then(() => {
          data[constant.isAuthenticated] = true;

          chrome.storage.sync.set(data, () => {
            setAlertSuccess(Message.succeed);
          });
        }).catch(() => {
          data[constant.isAuthenticated] = false;

          chrome.storage.sync.set(data, () => {
            setAlertDanger(Message.failed);
          });
        });
      } else {
        data[constant.isAuthenticated] = false;

        chrome.storage.sync.set(data, () => {
          setAlertInfo(Message.isBlank);
        });
      }
    });
  });
});
