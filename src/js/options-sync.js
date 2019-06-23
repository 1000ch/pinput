import OptionsSync from 'webext-options-sync';

const optionsSync = new OptionsSync();
optionsSync.define({
  defaults: {
    authToken: '',
    isAuthenticated: false,
    defaultPrivate: false,
    defaultReadLater: false,
    useTagSuggestion: false
  }
});

(async () => {
  const options = await optionsSync.getAll();
  const migrateOptions = {};

  if (options.pinput_authToken) {
    migrateOptions.authToken = pinput_authToken;
    migrateOptions.pinput_authToken = null;
  }

  if (options.pinput_isAuthenticated) {
    migrateOptions.isAuthenticated = options.pinput_isAuthenticated;
    migrateOptions.pinput_isAuthenticated = null;
  }

  if (options.pinput_defaultPrivate) {
    migrateOptions.defaultPrivate = options.pinput_defaultPrivate;
    migrateOptions.pinput_defaultPrivate = null;
  }

  if (options.pinput_defaultReadLater) {
    migrateOptions.defaultReadLater = options.pinput_defaultReadLater;
    migrateOptions.pinput_defaultReadLater = null;
  }

  if (options.pinput_useTagSuggestion) {
    migrateOptions.useTagSuggestion = options.pinput_useTagSuggestion;
    migrateOptions.pinput_useTagSuggestion = null;
  }

  await optionsSync.setAll(migrateOptions);
})

export default optionsSync;
