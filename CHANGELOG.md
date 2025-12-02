# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.1.3](https://github.com/zely-js/dobs/compare/v0.1.2...v0.1.3) (2025-12-02)

### Features

* add build mode option to CLI and builder ([6d4fca6](https://github.com/zely-js/dobs/commit/6d4fca6b6c4fedf55e8abea073d10d87829b0165))
* apply `plugin.server` in prod mode ([#54](https://github.com/zely-js/dobs/issues/54)) ([43254d0](https://github.com/zely-js/dobs/commit/43254d06f36c0c61bc8a30b10ce0c5e97f3b25d8))

## [0.1.2](https://github.com/zely-js/dobs/compare/v0.1.1...v0.1.2) (2025-12-01)

### Features

* **core:** 404 handler ([74021cb](https://github.com/zely-js/dobs/commit/74021cbde367d83d64c933f09a608390054b005a))
* **logger:** logger plugin ([80f84b8](https://github.com/zely-js/dobs/commit/80f84b81b6d18b04b8803ff5ed6f4ef610041739))

## [0.1.1](https://github.com/zely-js/dobs/compare/v0.1.0...v0.1.1) (2025-12-01)

### Bug Fixes

* resolve issue where some built-in plugins were not applied ([d26f8ca](https://github.com/zely-js/dobs/commit/d26f8caacb62ffdf877edc3e288eb5257a215e7d))

# [0.1.0](https://github.com/zely-js/dobs/compare/v0.1.0-beta.3...v0.1.0) (2025-11-30)

### Features

* **@dobsjs/dev:** devtool ([#52](https://github.com/zely-js/dobs/issues/52)) ([acb67ea](https://github.com/zely-js/dobs/commit/acb67eaac20aa449edb72e90b3a1c330d25f3462))
* plugin apply mode and runner filtering ([7ea4f1e](https://github.com/zely-js/dobs/commit/7ea4f1e974cfebb805b4cb5a0878607b1a598da5))

# [0.1.0-beta.3](https://github.com/zely-js/dobs/compare/v0.1.0-beta.2...v0.1.0-beta.3) (2025-11-26)

### Features

* **@dobsjs/websocket:** websocket client ([2096416](https://github.com/zely-js/dobs/commit/20964161078ac0716ce851d3bcb44faafa61622d))
* **create-dobs:** include server entry in template ([ea7c21b](https://github.com/zely-js/dobs/commit/ea7c21b4b18f62118edaa2bd9e0d7e799fd27b0a))

# [0.1.0-beta.2](https://github.com/zely-js/dobs/compare/v0.1.0-beta.1...v0.1.0-beta.2) (2025-11-19)

### Bug Fixes

* **builder:** apply plugins in build mode ([6592876](https://github.com/zely-js/dobs/commit/65928764ceebfe72a739380fc3a48f606aec75b1))
* remove duplicated plugin call ([dfeb932](https://github.com/zely-js/dobs/commit/dfeb9326ee28613606492b6164fb86a491d2e1c3))

### Features

* **builtin_tracker:** tracker for error tracking ([6ef5928](https://github.com/zely-js/dobs/commit/6ef5928f2387f54188e69393eeb56f5da48af8d2))
* public plugin for static assets ([#36](https://github.com/zely-js/dobs/issues/36)) ([d57376e](https://github.com/zely-js/dobs/commit/d57376e8007d2e63389e4281ebcb52d90abe0579))
* server entry ([#43](https://github.com/zely-js/dobs/issues/43)) ([b60908e](https://github.com/zely-js/dobs/commit/b60908eb53efbd973eff741d2e9f831a1fac8a50))

### Performance Improvements

* **router:** run route-generation plugin only once and reuse pageModule per request ([47037ac](https://github.com/zely-js/dobs/commit/47037ac80507c6c4b6e162cbafd7fab1b6f06cf5))

# [0.1.0-beta.1](https://github.com/zely-js/dobs/compare/v0.1.0-beta.0...v0.1.0-beta.1) (2025-11-14)

**Note:** Version bump only for package dobs

**Note:** Version bump only for package dobs

# [0.1.0-beta.0](https://github.com/zely-js/dobs/compare/v0.0.2...v0.1.0-beta.0) (2025-11-14)

### Bug Fixes

* check files existence before build ([097c322](https://github.com/zely-js/dobs/commit/097c322ea12a8e9aff0e802d8961988453eb9373))

## [0.0.2](https://github.com/zely-js/dobs/compare/v0.0.1...v0.0.2) (2025-11-14)

### Bug Fixes

* **builder:** include router files in bundle ([64a8bfd](https://github.com/zely-js/dobs/commit/64a8bfd28ff11d3140a0dc71c3aceb1a4f3af311))
* tsconfig path ([b759630](https://github.com/zely-js/dobs/commit/b759630132803b258560f488c4372e960daf3aa3))
* unlink temp files ([748bd64](https://github.com/zely-js/dobs/commit/748bd64d42e775014e23c849cdcc721552196ebf))

### Features

* implement plugin architecture ([#34](https://github.com/zely-js/dobs/issues/34)) ([e06d0fe](https://github.com/zely-js/dobs/commit/e06d0fe012313762938745dca1e47adf2ad78d9c))

## [0.0.1](https://github.com/zely-js/dobs/compare/v0.0.1-alpha.8...v0.0.1) (2025-11-09)

**Note:** Version bump only for package dobs

## [0.0.1-alpha.8](https://github.com/zely-js/dobs/compare/v0.0.1-alpha.7...v0.0.1-alpha.8) (2025-11-09)

**Note:** Version bump only for package dobs

## [0.0.1-alpha.7](https://github.com/zely-js/dobs/compare/v0.0.1-alpha.6...v0.0.1-alpha.7) (2025-11-08)

### Features

* add a wrapper function for data caching ([#25](https://github.com/zely-js/dobs/issues/25)) ([d2dd885](https://github.com/zely-js/dobs/commit/d2dd88583334144ff181e91af1581a3a0aabca13))

## [0.0.1-alpha.6](https://github.com/zely-js/dobs/compare/v0.0.1-alpha.5...v0.0.1-alpha.6) (2025-11-08)

**Note:** Version bump only for package dobs

## [0.0.1-alpha.5](https://github.com/zely-js/dobs/compare/v0.0.1-alpha.4...v0.0.1-alpha.5) (2025-11-08)

### Bug Fixes

* update yarn.lock to resolve module-loader-ts version ([dcb3b90](https://github.com/zely-js/dobs/commit/dcb3b90707b29fd19f62368cb6e533b5e283b444))
* write package.json with type commonjs in build outputs ([4703922](https://github.com/zely-js/dobs/commit/47039229f3c4d2a2ebc2cdbea425eafbbd39482c))

## [0.0.1-alpha.4](https://github.com/zely-js/dobs/compare/v0.0.1-alpha.3...v0.0.1-alpha.4) (2025-11-08)

**Note:** Version bump only for package dobs

## [0.0.1-alpha.3](https://github.com/zely-js/dobs/compare/v0.0.1-alpha.2...v0.0.1-alpha.3) (2025-11-08)

**Note:** Version bump only for package dobs
