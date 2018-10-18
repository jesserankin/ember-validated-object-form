import Component from '@ember/component';
import { scheduleOnce } from '@ember/runloop';

export default Component.extend({
  init() {
    this._super(...arguments);
    if (!this.get('noFocus')) {
      scheduleOnce('afterRender', this, function() {
        this.$('input,textarea,select').first().focus();
      });
    }
  },
});
