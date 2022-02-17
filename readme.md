# WebPack Crash Course

> 기본적으로 src 폴더는 소스코드, dist폴더는 배포되는 번들링된 파일들이 생성된다.
> + 웹팩은 기본적으로 ES2015 모듈을 지원한다.

## 기본

### 설치

```bash
npm i webpack webpack-cli --save-dev
```

### 번들링하기

```bash
npx webpack --mode=development
```

- 생판 아무것도 없이 실행하게된다면, src/index.js ➡️ dist/main.js 로 번들링 한다.

> 웹팩은 사실 import 와 export 구문을 제외하고는 아무 코드도 변경하지 않는다. 원하는 입맛대로 loader를 추가해줘야한다.

> 위와같이 단순히 npx webpack을 하지않고, 뒤에 추가적인 옵션을 넣는데, 점점 복잡하고, 많은 설정이 필요함으로 설정파일을 따로 만드는 것이 좋다.

## webpack.config.js

- 웹팩 config 파일은 아무런이름으로 지정해도되지만 (--config 옵션을 사용하여) default로 이름을 인식하기 때문에 편리하다.

### 가장기초적인 설정

```javascript
module.exports = {
    mode: 'production',
    entry : './src/index.js',
    output : {
        filename: "main.js",
        path: __dirname + '/dist',
    }
};
```

- 가장 기본적인 설정이다. 위 3가지옵션을 필수로 넣어주어야하고, 나머지는 선택적으로 넣어주면 된다.
- mode에는 development || production 이 있는데, 전자는 번들링 된 main.js파일에 주석도 달려있고, 가독성이좋지만, production 모드일경우 가독성은 저리가라하고 최대한 압축한다.
- entry는 말그대로 뿌리js파일이다. 저파일에서 종속성을 가진 파일들, 즉 import 구문들을 쭉 따라가서 번들링한다.
- output은 번들링된 최종 결과물의 이름과, 위치를 설정한다. path에는 반드시 절대 경로가 들어가야 하기 때문에(__dirname 을 꼭 포함시켜 주어야한다. 보통 path 모듈의 resolve메서드를 활용한다. OS마다 경로를 구분하는 기호가 다르기 때문에)

> path.resolve()는 상대경로를 무시하고 절대경로를 반환해준다.

```javascript
const path = require('path');

module.exports = {
    mode: 'production',
    entry : './src/index.js',
    output : {
        filename: "main.js",
        path: path.resolve(__dirname,'dist'),
    }
};
```
---

## NPM Scripts 로 실행하기

사실 뭐가 귀찮아서 스크립트를 만들겠냐하지만, 좋은 관습이라고 생각한다.

```json
  "scripts": {
    "build" : "webpack"
  },
```

```bash
npm run build
```

> npx webpack 한것과 동일하다.

