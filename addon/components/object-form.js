import Component from '@ember/component';
import { scheduleOnce } from '@ember/runloop';
import $ from 'jquery';

export default Component.extend({

  currentFocus: null,
  blurredFields: [],

  init() {
    this._super(...arguments);
    if (!this.get('noFocus')) {
      scheduleOnce('afterRender', this, function() {
        $(this.element).find('input,textarea,select').first().focus();
      });
    }
  },

  actions: {
    markFieldFocused: function(name) {
      if (this.get('currentFocus')) {
        this.set('blurredFields', this.get('blurredFields').concat([this.get('currentFocus')]).uniq());
      }
      this.set('currentFocus', name);
    },
  },

});
