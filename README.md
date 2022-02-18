# WebPack Crash Course

> 기본적으로 src 폴더는 소스코드, dist폴더는 배포되는 번들링된 파일들이 생성된다.
> 웹팩은 기본적으로 ES2015 모듈을 지원한다.

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

## Asset Management

### CSS 로딩

```bash
npm i style-loader css-loader
```

```js
 rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      }
  ]
```

### 이미지 로딩

- 내장 asset/resource 사용

```js
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      }
```

### 폰트 로딩

```js
      {
        test: /\.(woff|woff2|eot|ttf|otf)/,
        type: "asset/resource",
      },
```

### Data 로딩 (csv,xml..)

```bash
npm i --save-dev csv-loader xml-loader
```

```js
      {
        test: /\.(csv|tsv)$/i,
        use: ["csv-loader"],
      },
      {
        test: /\.xml$/i,
        use: ["xml-loader"],
      },
```

### Output Management

## 결과물을 하나가아닌 원하는대로 만들기

- 엔트리를 {[이름]:"경로"} 로 분리하고싶은데로 설정

```js
  entry: {
    index: "./src/index.js",
    print: "./src/print.js",
  }
```

- entry 에서의 key 값을 [name] 으로 참조할 수 있음, 결과물을 유동적으로 생성할 수 있다.

```js
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
  }
```

- html

```html
<body>
    <script src="./print.bundle.js"></script>
    <script src="./index.bundle.js"></script>
</body>
```

> 그런데 여기서 문제점은, src파일들과, 엔트리 포인트를 우리가 수정해주면 자동으로 번들링에서 적용이되지만, html같은 경우 정적으로 이미 print.bundle.js, index.bundle.js 와 같이 고정되어있기때문에, html파일에서 직접 수정해줘야한다는 번거러움이 발생한다.
> 이를 해결하기위해서 plugin을 사용한다.

## HtmlWebpackPlugin

- index.html 파일도 번들링한 결과물에 포함시킨다. 즉 html파일 조차 미리 작성할 필요가 없다

> ❗️ 다만 이경우는 jsx 와같이, 우리가 html 요소들을 동적으로 넣을때만 해당된다. 정적인 파일은 우리가 직접 마크업 해주어야하니까!

```bash
npm i --save-dev html-webpack-plugin
```

```js
const HtmlWebpackPlugin = require("html-webpack-plugin");

entry: {
    ...
},
plugins: [
    new HtmlWebpackPlugin({
        title: "Output Managenment", //html의 title태그 명이다. 더많은 옵션은 공식문서 참조
    }),
],
```

## Cleaning up the /dist folder

- 위 코드들을 작업하다보면 dist폴더가 지워지지는 않고 추가되고 있을겁니다. 깔끔하게 지우고 새로운 파일들로만 구성하려면 아래의 옵션을 추가해줍니다.

```js
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
    clean:true
}
```

## Using source maps

- 지금 우리가 하고있는작업은 bundle.js로 모든 파일을 한데 모으는 것입니다. 만약에 콘솔이나, 에러가 발생했을때 로그창을 보면 어디에서 발생했다고 가르키고있을까요? 바로 bundle이겠죠, 모든 출처는 bundle 이 됨으로 에러를 추적하기 힘들것입니다. 그럴때 sass에서도 사용되는 map정보를 포함하도록 설정하면 추적할 수 있는 정보를 함꼐 번들링합니다.

```js
devtool: "inline-source-map"
```

> 이렇게 설정하면 console.log 든 에러든 번들링되기전의 자신의 파일을 가르키고 있습니다.


## Choosing a Development Tool

- 지금까지 매번 수정사항이 있을때마다 `npx webpack` 이나 `npm run build` 를 직접해주었는데, 이를 자동으로 감지하고 적용해주는 방법 3가지가 있습니다.

### watch mode

```bash
npx webpack --watch
```

- watch 모드로 실행을 하게되면 변경사항이 발생할 시 자동으로 재 번들링을 시작합니다. 하지만 변경사항을 확인하려면 브라우저를 새로고침 해야합니다. 이것이 자동으로 되면 좋겠죠?

### webpack-dev-server

```bash
npm i --save-dev webpack-dev-server 
```

```js
  devServer: {
    static: "./dist",
  },
```

```bash
npx webpack serve --open
```

- 데브 서버를 설치하고, config에서 서버로 동작시킬 디렉토리를 지정해줍니다. 그리고 serve옵션으로 실행하면 핫 리로딩까지 해주는 서버가 실행됩니다.
- 서버는 localhost:8080에서 제공됩니다.
- `--open` 속성까지 넣어주면 바로 열립니다.
