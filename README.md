# ReviewLog

Z-Blog 应用审议记录（试行）

## QQ 群

群号：836912740

加群链接：https://jq.qq.com/?_wv=1027&k=10fqcZgq

## 统计查看

Z-Blog 应用审议统计：

[https://wdssmq.github.io/ReviewLog/](https://wdssmq.github.io/ReviewLog/ "Z-Blog 应用审议统计")

## 一些标准

- 不允许对系统表结构进行修改；
- 引入样式或脚本放 `$header` 或 `$footer` 里；
- `HasConfig` 和 `HasKey` 还是希望区分使用场景；
- 在「公共头部」「公共尾部」模板内应各自放置`{$header}`或`{$footer}`标签；
- 后台表单有`.tableBorder`类名后不需要再加`border='1'`属性，另外这个属性本身就是废弃的；
- `img/`，`css/`，`script/`，明明可以很有规则感的(╯﹏╰）；
- 以下 HTML 标签不需`type`属性：

  ```html
  <link rel="stylesheet" href="style.css">
  <script src="script.js"></script>
  <script></script>
  ```
注意事项速查表 - 常见问题 - 应用开发：

[https://docs.zblogcn.com/php/#/books/dev-55-faq?id=%e6%b3%a8%e6%84%8f%e4%ba%8b%e9%a1%b9%e9%80%9f%e6%9f%a5%e8%a1%a8](https://docs.zblogcn.com/php/#/books/dev-55-faq?id=%e6%b3%a8%e6%84%8f%e4%ba%8b%e9%a1%b9%e9%80%9f%e6%9f%a5%e8%a1%a8 "注意事项速查表 - 常见问题 - 应用开发")
