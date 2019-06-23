import optionsSync from './options-sync.js';
import * as API from './api.js';

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

  (async () => {
    const options = await optionsSync.getAll();
    $checkboxPrivate.prop('checked', options.defaultPrivate);
    $checkboxReadLater.prop('checked', options.defaultReadLater);
    $checkboxTagSuggestion.prop('checked', options.useTagSuggestion);

    if (options.authToken.length !== 0) {
      API.checkToken(options.authToken).then(() => {
        setAlertSuccess(Message.succeed);
      }).catch(() => {
        setAlertDanger(Message.failed);
      });
    } else {
      setAlertInfo(Message.isBlank);
    }

    $input.val(options.authToken);
  })();

  $input.on('change', () => {
    setAlertWarning(Message.changed);
  });

  $checkboxPrivate.on('change', () => {
    optionsSync.set({
      defaultPrivate: $checkboxPrivate.prop('checked')
    });
  });

  $checkboxReadLater.on('change', () => {
    optionsSync.set({
      defaultReadLater: $checkboxReadLater.prop('checked')
    });
  });

  $checkboxTagSuggestion.on('change', () => {
    optionsSync.set({
      useTagSuggestion: $checkboxTagSuggestion.prop('checked')
    });
  });

  // if the save button is clicked
  $button.on('click', () => {
    const authToken = $input.val();

    optionsSync.set({ authToken }).then(() => {
      if (authToken.length !== 0) {
        API.checkToken(authToken).then(() => {
          optionsSync.set('isAuthenticated', true).then(() => {
            setAlertSuccess(Message.succeed);
          });
        }).catch(() => {
          optionsSync.set('isAuthenticated', false).then(() => {
            setAlertDanger(Message.failed);
          });
        });
      } else {
        optionsSync.set('isAuthenticated', false).then(() => {
          setAlertInfo(Message.isBlank);
        });
      }
    });
  });
});
