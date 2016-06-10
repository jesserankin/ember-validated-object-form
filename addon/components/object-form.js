import Ember from 'ember';

export default Ember.Component.extend({

  focusFirstField: Ember.on('init', function() {
    Ember.run.scheduleOnce('afterRender', this, function() {
      this.$('input,select').find(':first').focus();
    });
  })
});
