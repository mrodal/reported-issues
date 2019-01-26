# webpack-test

## Project setup
```
npm install
```

### Error reproduction
- Run with `npm run serve`
- On `src/components/Extended.vue` edit the console.log on the mounted function. Works well
- Go to `src/components/Base.vue` and edit the console.log on the mounted function. The base component template gets rendered instead of the Extended one.

This happens only when importing Extended.vue on App.vue with import()

Issue: https://github.com/vuejs/vue/issues/9376
