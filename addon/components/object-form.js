import Component from '@ember/component';
import { scheduleOnce } from '@ember/runloop';

export default Component.extend({
  init() {
    this._super(...arguments);
    scheduleOnce('afterRender', this, function() {
      this.$('input,textarea,select').first().focus();
    });
  }
});
