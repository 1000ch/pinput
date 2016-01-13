import variable from './variable';
import constant from './constant';
import util     from './util';
import API      from './api';

const Message = {
  isBookmarked           : 'This URL is already bookmarked.',
  isNotAuthenticated     : 'API Token is not authenticated.',
  bookmarkedSuccessfully : 'Bookmarked successfully!',
  updatedSuccessfully    : 'Updated successfully!',
  deletedSuccessfully    : 'Deleted successfully!',
  failedToBookmark       : 'Failed to bookmark...',
  failedToUpdate         : 'Failed to update...',
  failedToDelete         : 'Failed to delete...'
};

// autofocus attribute is not working on chrome extension :(
// https://code.google.com/p/chromium/issues/detail?id=111660#c7
if (location.search !== '?foo') {
  location.search = '?foo';
  throw new Error();
  // load everything on the next page;
  // stop execution on this page
}

$(() => {
  let $form        = $('#js-form');
  let $url         = $('#js-url');
  let $title       = $('#js-title');
  let $tags        = $('#js-tags');
  let $description = $('#js-description');
  let $private     = $('#js-private');
  let $readlater   = $('#js-readlater');
  let $bookmark    = $('#js-bookmark');
  let $dropdown    = $('#js-bookmark-dropdown');
  let $delete      = $('#js-delete');
  let $alert       = $('#js-alert');

  //function setAlertInfo(message = '') {
  //  $alert.removeClass('alert-danger alert-warning alert-success')
  //        .addClass('alert-info')
  //        .text(message);
  //}

  function setAlertSuccess(message = '') {
    $alert
      .removeClass('alert-info alert-warning alert-danger')
      .addClass('alert-success')
      .text(message);
  }

  function setAlertDanger(message = '') {
    $alert
      .removeClass('alert-info alert-warning alert-success')
      .addClass('alert-danger')
      .text(message);
  }

  function setAlertWarning(message = '') {
    $alert
      .removeClass('alert-info alert-success alert-danger')
      .addClass('alert-warning')
      .text(message);
  }

  // when popup is opened,
  // send blank message to background
  chrome.runtime.sendMessage({useStrict : true}, response => {
    $url.val(response.url);
    $title.val(response.title);
    $tags.focus();

    const keys = [
      constant.authToken,
      constant.isAuthenticated,
      constant.defaultPrivate,
      constant.defaultReadLater,
      constant.useTagSuggestion
    ];

    chrome.storage.sync.get(keys, item => {
      variable.authToken        = String(item[constant.authToken]);
      variable.isAuthenticated  = Boolean(item[constant.isAuthenticated]);
      variable.defaultPrivate   = Boolean(item[constant.defaultPrivate]);
      variable.defaultReadLater = Boolean(item[constant.defaultReadLater]);
      variable.useTagSuggestion = Boolean(item[constant.useTagSuggestion]);

      if (variable.defaultPrivate) {
        $private.prop('checked', true);
      }

      if (variable.defaultReadLater) {
        $readlater.prop('checked', true);
      }

      if (!variable.isAuthenticated) {
        setAlertDanger(Message.isNotAuthenticated);
        $bookmark.prop('disabled', true);
      } else {
        API.getPost(response.url).then(data => {
          if (data.posts.length !== 0) {
            let post = data.posts.shift();
            $tags.val(post.tags);
            $description.val(post.extended);
            $private.prop('checked', post.shared === 'no');
            $readlater.prop('checked', post.toread !== 'no');
            $bookmark
              .removeClass('btn-primary')
              .addClass('btn-warning')
              .text('Update bookmark');
            $dropdown
              .removeAttr('disabled')
              .removeClass('btn-primary')
              .addClass('btn-warning');

            setAlertWarning(Message.isBookmarked);

            Message.bookmarkedSuccessfully = Message.updatedSuccessfully;
            Message.failedToBookmark = Message.failedToUpdate;
          } else if (variable.useTagSuggestion) {
            API.suggestPost(response.url).then(array => {
              for (let tag of array) {
                if (Array.isArray(tag.popular)) {
                  $tags.val(tag.popular.join(' '));
                }
              }
            });
          }
        }).then(() => {
          // set up word suggestion
          API.getTags().then(data => {
            let availableTags = Object.keys(data);

            $tags.on('keydown', e => {
              let $this = $(e.target);

              if (e.keyCode === $.ui.keyCode.TAB &&
                  $this.data('ui-autocomplete').menu.active) {
                e.preventDefault();
              }
            }).autocomplete({
              minLength : 0,
              max       : 5,
              autoFocus : true,

              source : (req, res) => {
                // delegate back to autocomplete, but extract the last term
                res(
                  $.ui.autocomplete.filter(
                    availableTags,
                    util.extractLast(req.term)
                  ).slice(0, 5)
                );
              },
              focus : () => {
                // prevent value inserted on focus
                return false;
              },
              select : (e, ui) => {
                let terms = util.split(e.target.value);
                // remove the current input
                terms.pop();
                // add the selected item
                terms.push(ui.item.value);
                // add placeholder to get the comma-and-space at the end
                terms.push('');
                e.target.value = terms.join(' ');
                return false;
              }
            });
          });
        });

        $form.on('submit', e => {
          e.preventDefault();

          API.addPost(
            $url.val(),
            $title.val(),
            $description.val(),
            $tags.val(),
            $private.prop('checked') ? 'no' : 'yes',
            $readlater.prop('checked') ? 'yes' : 'no'
          ).then(data => {
            if (data.result_code !== 'done') {
              setAlertDanger(Message.failedToBookmark);

              chrome.runtime.sendMessage({
                useStrict    : false,
                isBookmarked : false
              });
            } else {
              setAlertSuccess(Message.bookmarkedSuccessfully);

              chrome.runtime.sendMessage({
                useStrict    : false,
                isBookmarked : true
              });

              // close popup window
              window.setTimeout(() => window.close(), 300);
            }
          }).catch(error => {
            setAlertDanger(error);

            chrome.runtime.sendMessage({
              useStrict    : false,
              isBookmarked : false
            });
          });
        });

        $bookmark.on('click', e => {
          e.preventDefault();

          API.addPost(
            $url.val(),
            $title.val(),
            $description.val(),
            $tags.val(),
            $private.prop('checked') ? 'no' : 'yes',
            $readlater.prop('checked') ? 'yes' : 'no'
          ).then((data) => {

            if (data.result_code !== 'done') {
              setAlertDanger(Message.failedToBookmark);

              chrome.runtime.sendMessage({
                useStrict    : false,
                isBookmarked : false
              });
            } else {
              setAlertSuccess(Message.bookmarkedSuccessfully);

              chrome.runtime.sendMessage({
                useStrict    : false,
                isBookmarked : true
              });

              window.setTimeout(() => window.close(), 300);
            }
          }).catch(error => {
            setAlertDanger(error);

            chrome.runtime.sendMessage({
              useStrict    : false,
              isBookmarked : false
            });
          });
        });

        $delete.on('click', e => {
          e.preventDefault();

          API.deletePost(
            $url.val()
          ).then(data => {
            if (data.result_code !== 'done') {
              setAlertDanger(Message.failedToDelete);

              chrome.runtime.sendMessage({
                useStrict    : false,
                isBookmarked : true
              });
            } else {
              setAlertSuccess(Message.deletedSuccessfully);

              chrome.runtime.sendMessage({
                useStrict    : false,
                isBookmarked : false
              });

              window.setTimeout(() => window.close(), 300);
            }
          }).catch((error) => {
            setAlertDanger(error);

            chrome.runtime.sendMessage({
              useStrict    : false,
              isBookmarked : true
            });
          });
        });
      }
    });
  });
});
