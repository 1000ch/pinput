import variable from './variable';
import constant from './constant';
import API      from './api';

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
    $alert.removeClass('alert-danger alert-warning alert-success')
          .addClass('alert-info')
          .text(message);
  }

  function setAlertSuccess(message) {
    $alert.removeClass('alert-info alert-warning alert-danger')
          .addClass('alert-success')
          .text(message);
  }

  function setAlertDanger(message) {
    $alert.removeClass('alert-info alert-warning alert-success')
          .addClass('alert-danger')
          .text(message);
  }

  function setAlertWarning(message) {
    $alert.removeClass('alert-info alert-success alert-danger')
          .addClass('alert-warning')
          .text(message);
  }

  const keys = [
    constant.authToken,
    constant.defaultPrivate,
    constant.defaultReadLater,
    constant.useTagSuggestion
  ];

  // check set API token is authenticated
  chrome.storage.sync.get(keys, (items) => {

    if (items.hasOwnProperty(constant.authToken)) {
      variable.authToken = String(items[constant.authToken]);
    } else {
      variable.authToken = '';
    }

    if (items.hasOwnProperty(constant.defaultPrivate)) {
      variable.defaultPrivate = Boolean(items[constant.defaultPrivate]);
    } else {
      variable.defaultPrivate = false;
    }

    if (items.hasOwnProperty(constant.defaultReadLater)) {
      variable.defaultReadLater = Boolean(items[constant.defaultReadLater]);
    } else {
      variable.defaultReadLater = false;
    }

    if (items.hasOwnProperty(constant.useTagSuggestion)) {
      variable.useTagSuggestion = Boolean(items[constant.useTagSuggestion]);
    } else {
      variable.useTagSuggestion = false;
    }

    $checkboxPrivate.prop('checked', variable.defaultPrivate);
    $checkboxReadLater.prop('checked', variable.defaultReadLater);
    $checkboxTagSuggestion.prop('checked', variable.useTagSuggestion);

    if (variable.authToken.length !== 0) {
      API.checkToken().then(() => {
        setAlertSuccess(Message.succeed);
        variable.isAuthenticated = true;
      }).catch((error) => {
        setAlertDanger(Message.failed);
        variable.isAuthenticated = false;
        console.error(error);
      });
    } else {
      setAlertInfo(Message.isBlank);
      variable.isAuthenticated = false;
    }

    $input.val(variable.authToken);
  });

  $input.on('change', function() {
    setAlertWarning(Message.changed);
  });

  $checkboxPrivate.on('change', function() {

    variable.defaultPrivate = $checkboxPrivate.prop('checked');

    let data = {};
    data[constant.defaultPrivate] = variable.defaultPrivate;

    chrome.storage.sync.set(data, () => {});
  });

  $checkboxReadLater.on('change', function() {

    variable.defaultReadLater = $checkboxReadLater.prop('checked');

    let data = {};
    data[constant.defaultReadLater] = variable.defaultReadLater;

    chrome.storage.sync.set(data, () => {});
  });

  $checkboxTagSuggestion.on('change', function() {

    variable.useTagSuggestion = $checkboxTagSuggestion.prop('checked');

    let data = {};
    data[constant.useTagSuggestion] = variable.useTagSuggestion;

    chrome.storage.sync.set(data, () => {});
  });

  // if the save button is clicked
  $button.on('click', function() {

    variable.authToken = $input.val();

    let data = {};
    data[constant.authToken] = variable.authToken;

    chrome.storage.sync.set(data, () => {
      if (variable.authToken.length !== 0) {
        API.checkToken().then(() => {

          variable.isAuthenticated = true;
          data[constant.isAuthenticated] = true;

          chrome.storage.sync.set(data, () => {
            setAlertSuccess(Message.succeed);
          });

        }).catch((error) => {

          variable.isAuthenticated = false;
          data[constant.isAuthenticated] = false;
          console.error(error);

          chrome.storage.sync.set(data, () => {
            setAlertDanger(Message.failed);
          });
        });
      } else {

        variable.isAuthenticated = false;
        data[constant.isAuthenticated] = false;

        chrome.storage.sync.set(data, () => {
          setAlertInfo(Message.isBlank);
        });
      }
    });
  });
});
