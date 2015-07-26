
## Installation [future]
future...


## Examples:
### `Code`
    examples/
        login
        register
        Oauth pin

### `Screenshot`
    examples/screen

### `Notify`
    examples/notify

## Api

### `twitter.loginAndGetPin(email, pwd, url, [notify], [done])`
find the pin Oauth.
done(err, pin)

### `twitter.register(name, email, pwd, username, done)`
attempts to register a new account. Run done(err, user)
Unstable because twitter block by ip.


### twitter.plugin
Plugins for [Nightmare](https://github.com/segmentio/nightmare)

#### `twitter.plugin.register(name, email, pwd, username, [done])`
attempts to register a new account. Run done(err, user)
Unstable because twitter block by ip.

#### `twitter.plugin.login(email, password, [notify])`
Login in twitter.com. notify default false.

#### `twitter.plugin.getPinNumber(url, [notify], [onSuccesCode])`
Get the pin for Oauth login, before use twitter.plugin.login.
    notify: default false
    onSuccesCode: onSuccesCode(err, code)

#### `twitter.plugin.tweet`
Coming soon

## Test

```
$ npm install
```
```
$ npm test
```
