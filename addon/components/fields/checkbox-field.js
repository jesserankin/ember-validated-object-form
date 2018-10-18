import FormField from 'ember-validated-object-form/components/fields/text-field';

export default FormField.extend({
  actions: {
    toggle: function() {
      const path = 'object.' + this.get('name');
      const val = this.get(path);
      this.set(path, !val);
      this.get('onFocus')(this.get('name'));
    }
  }
});
