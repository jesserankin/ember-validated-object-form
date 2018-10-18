import Component from '@ember/component';
import { computed, defineProperty } from '@ember/object';

export default Component.extend({

  validations: computed.alias('object.validations.attrs'),
  wasBlurred: false,

  // setup validator computed property based on the name passed into this field
  init() {
    this._super(...arguments);
    const name = this.get('name');
    defineProperty(this, 'validator', computed('validations','validations.'+name, function() {
      if (this.get('validations')) {
        return this.get('validations').get(this.get('name'));
      }
    }));
  },

  validated: computed('validator','validator.{isValidating}','submitted', 'wasBlurred', function() {
    if (this.get('validator')) {
      if (this.get('submitted') ||
          this.get('wasBlurred')) {
        return !this.get('validator.isValidating');
      }
    }
  }),

  validationClass: computed('validated', 'validator.isValid', function() {
    if (this.get('validated')) {
      return this.get('validator.isValid') ? ' valid' : ' invalid';
    }
  }),

  validationError: computed('validated','validator.message', function() {
    if (this.get('validated')) {
      return this.get('validator.message');
    }
  }),

  actions: {
    markLeft: function() {
      this.set('wasBlurred', true);
    }
  }

});
