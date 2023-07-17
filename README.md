# Jest Environment - Firebase Functions

> A Jest testing environment for Firebase functions.

[![Version][version-image]][version-link]
[![Downloads Stats][npm-downloads]][npm-link]

## Installation

```sh
npm i --save-dev jest-environment-firebase-functions
```

## Usage

### Configuring Jest

```js
// jest.config.js
/** @type {import('jest').Config} */
module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'jest-environment-firebase-functions',
	/** @type {import('jest-environment-firebase-functions').Options} */
	testEnvironmentOptions: {
		firebaseMode: 'online',
		projectId: 'my-project',
		storageBucket: 'my-project.appspot.com',
		databaseURL: 'https://my-project.firebaseio.com',
		keyPath: './serviceAccountKey.json'
	}
}
```

For more on writing tests, see the [Firebase documentation](https://firebase.google.com/docs/functions/unit-testing#testing_http_functions).

## Options

| Option        | Required | Notes                                        |
| ------------- | -------- | -------------------------------------------- |
| projectId     | Yes      |                                              |
| firebaseMode  | No       | `"online"` or `"offline"` (default)          |
| keyPath       | No       | firebaseMode defaults to `"online"` when set |
| storageBucket | No       |                                              |
| databaseURL   | No       |                                              |

<!-- Markdown link & img dfn's -->

[version-image]: https://img.shields.io/github/package-json/v/bkeys818/jest-environment-firebase-functions/v1.0.0?label=version
[version-link]: https://github.com/bkeys818/jest-environment-firebase-functions/releases/tag/v1.0.0
[npm-downloads]: https://img.shields.io/npm/dm/jest-environment-firebase-functions.svg
[npm-link]: https://www.npmjs.com/package/jest-environment-firebase-functions/v/1.0.0
